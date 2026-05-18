import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { requireAdmin, apiError, apiSuccess } from "@/lib/api-utils";
import { saveFile } from "@/lib/upload";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("No file provided", 400);
    }

    const url = await saveFile(file);
    return apiSuccess({ url }, 201);
  } catch (error) {
    return apiError("Failed to upload file");
  }
}
