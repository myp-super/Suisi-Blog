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

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        post: { select: { id: true, slug: true, title: true } },
      },
    });

    if (!project) {
      return apiError("Project not found", 404);
    }

    return apiSuccess(project);
  } catch (error) {
    return apiError("Failed to fetch project");
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

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing) {
      return apiError("Project not found", 404);
    }

    const project = await prisma.project.update({
      where: { slug },
      data: body,
      include: {
        post: { select: { id: true, slug: true, title: true } },
      },
    });

    return apiSuccess(project);
  } catch (error) {
    return apiError("Failed to update project");
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
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing) {
      return apiError("Project not found", 404);
    }

    await prisma.project.delete({ where: { slug } });
    return apiSuccess({ message: "Project deleted" });
  } catch (error) {
    return apiError("Failed to delete project");
  }
}
