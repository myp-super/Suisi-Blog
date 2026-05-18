import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireAdmin, apiError, apiSuccess } from "@/lib/api-utils";
import { categorySchema } from "@/lib/validations";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { posts: true } },
      },
      orderBy: { name: "asc" },
    });

    return apiSuccess(categories);
  } catch (error) {
    return apiError("Failed to fetch categories");
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const body = await request.json();
    const data = categorySchema.parse(body);

    const category = await prisma.category.create({ data });
    return apiSuccess(category, 201);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return apiError("Validation failed", 400);
    }
    return apiError("Failed to create category");
  }
}
