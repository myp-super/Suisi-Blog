import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requireAdmin, apiError, apiSuccess } from "@/lib/api-utils";
import { tagSchema } from "@/lib/validations";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
    });

    return apiSuccess(tags);
  } catch (error) {
    return apiError("Failed to fetch tags");
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const body = await request.json();
    const data = tagSchema.parse(body);

    const tag = await prisma.tag.create({ data });
    return apiSuccess(tag, 201);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return apiError("Validation failed", 400);
    }
    return apiError("Failed to create tag");
  }
}
