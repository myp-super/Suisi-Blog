import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q) {
      return apiSuccess({ posts: [] });
    }

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q } },
          { excerpt: { contains: q } },
        ],
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const serialized = posts.map((post) => ({
      ...post,
      categories: post.categories.map((pc) => pc.category),
      tags: post.tags.map((pt) => pt.tag),
    }));

    return apiSuccess({ posts: serialized });
  } catch (error) {
    return apiError("Search failed");
  }
}
