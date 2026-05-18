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
    const body = await request.json();

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return apiError("Category not found", 404);
    }

    const category = await prisma.category.update({
      where: { id },
      data: body,
    });

    return apiSuccess(category);
  } catch (error) {
    return apiError("Failed to update category");
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
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return apiError("Category not found", 404);
    }

    await prisma.category.delete({ where: { id } });
    return apiSuccess({ message: "Category deleted" });
  } catch (error) {
    return apiError("Failed to delete category");
  }
}
