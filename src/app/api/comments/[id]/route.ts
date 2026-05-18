import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireAdmin, apiError, apiSuccess } from "@/lib/api-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { id } = await params;
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return apiError("Comment not found", 404);
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { approved: !comment.approved },
    });

    return apiSuccess(updated);
  } catch (error) {
    return apiError("Failed to update comment");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { id } = await params;
    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) {
      return apiError("Comment not found", 404);
    }

    await prisma.comment.delete({ where: { id } });
    return apiSuccess({ message: "Comment deleted" });
  } catch (error) {
    return apiError("Failed to delete comment");
  }
}
