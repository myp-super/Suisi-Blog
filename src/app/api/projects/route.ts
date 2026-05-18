import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireAdmin, apiError, apiSuccess } from "@/lib/api-utils";
import { projectSchema } from "@/lib/validations";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        post: { select: { id: true, slug: true, title: true } },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return apiSuccess(projects);
  } catch (error) {
    return apiError("Failed to fetch projects");
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const body = await request.json();
    const data = projectSchema.parse(body);

    const project = await prisma.project.create({
      data,
      include: {
        post: { select: { id: true, slug: true, title: true } },
      },
    });

    return apiSuccess(project, 201);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return apiError("Validation failed", 400);
    }
    return apiError("Failed to create project");
  }
}
