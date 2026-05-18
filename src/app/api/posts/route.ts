import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireAdmin, apiError, apiSuccess } from "@/lib/api-utils";
import { postSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "6")));
    const categorySlug = searchParams.get("category");
    const tagName = searchParams.get("tag");

    const where: Record<string, unknown> = { published: true };

    if (categorySlug) {
      where.categories = { some: { category: { slug: categorySlug } } };
    }
    if (tagName) {
      where.tags = { some: { tag: { name: tagName } } };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, image: true } },
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const serialized = posts.map((post) => ({
      ...post,
      categories: post.categories.map((pc) => pc.category),
      tags: post.tags.map((pt) => pt.tag),
    }));

    return apiSuccess({
      posts: serialized,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return apiError("Failed to fetch posts");
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const body = await request.json();
    const data = postSchema.parse(body);
    const { categoryIds, tagIds, ...postData } = data;

    const post = await prisma.post.create({
      data: {
        ...postData,
        authorId: session.user.id,
        categories: categoryIds?.length
          ? { create: categoryIds.map((id: string) => ({ categoryId: id })) }
          : undefined,
        tags: tagIds?.length
          ? { create: tagIds.map((id: string) => ({ tagId: id })) }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });

    const serialized = {
      ...post,
      categories: post.categories.map((pc) => pc.category),
      tags: post.tags.map((pt) => pt.tag),
    };

    return apiSuccess(serialized, 201);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return apiError(`Validation failed: ${error.message}`, 400);
    }
    console.error("Create post error:", error);
    return apiError("Failed to create post");
  }
}
