import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireAdmin, apiError, apiSuccess } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, image: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        comments: { where: { approved: true } },
      },
    });

    if (!post) {
      return apiError("Post not found", 404);
    }

    const [prevPost, nextPost] = await Promise.all([
      prisma.post.findFirst({
        where: { published: true, createdAt: { lt: post.createdAt } },
        orderBy: { createdAt: "desc" },
        select: { slug: true },
      }),
      prisma.post.findFirst({
        where: { published: true, createdAt: { gt: post.createdAt } },
        orderBy: { createdAt: "asc" },
        select: { slug: true },
      }),
    ]);

    const serialized = {
      ...post,
      categories: post.categories.map((pc) => pc.category),
      tags: post.tags.map((pt) => pt.tag),
      prevSlug: prevPost?.slug ?? null,
      nextSlug: nextPost?.slug ?? null,
    };

    return apiSuccess(serialized);
  } catch (error) {
    return apiError("Failed to fetch post");
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { slug } = await params;
    const body = await request.json();
    const { categoryIds, tagIds, ...postData } = body;

    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing) {
      return apiError("Post not found", 404);
    }

    if (categoryIds !== undefined) {
      await prisma.postCategory.deleteMany({ where: { postId: existing.id } });
    }
    if (tagIds !== undefined) {
      await prisma.postTag.deleteMany({ where: { postId: existing.id } });
    }

    const post = await prisma.post.update({
      where: { slug },
      data: {
        ...postData,
        categories:
          categoryIds !== undefined && categoryIds.length > 0
            ? { create: categoryIds.map((id: string) => ({ categoryId: id })) }
            : undefined,
        tags:
          tagIds !== undefined && tagIds.length > 0
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

    return apiSuccess(serialized);
  } catch (error) {
    return apiError("Failed to update post");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { slug } = await params;
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing) {
      return apiError("Post not found", 404);
    }

    await prisma.post.delete({ where: { slug } });
    return apiSuccess({ message: "Post deleted" });
  } catch (error) {
    return apiError("Failed to delete post");
  }
}
