import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { commentSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get("postSlug");
    if (!postSlug) return apiError("postSlug required", 400);

    const post = await prisma.post.findUnique({ where: { slug: postSlug }, select: { id: true } });
    if (!post) return apiError("Post not found", 404);

    const comments = await prisma.comment.findMany({
      where: { postId: post.id, approved: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, authorName: true, content: true, createdAt: true },
    });

    return apiSuccess(comments);
  } catch {
    return apiError("Failed to fetch comments");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = commentSchema.parse(body);
    const { postSlug, ...commentData } = data;

    const post = await prisma.post.findUnique({
      where: { slug: postSlug },
      select: { id: true },
    });

    if (!post) {
      return apiError("Post not found", 404);
    }

    await prisma.comment.create({
      data: {
        ...commentData,
        postId: post.id,
        approved: false,
      },
    });

    return apiSuccess({ message: "Comment submitted for review" }, 201);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return apiError("Validation failed", 400);
    }
    return apiError("Failed to create comment");
  }
}
