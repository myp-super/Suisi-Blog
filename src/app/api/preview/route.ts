import { NextRequest } from "next/server";
import { requireAdmin, apiError, apiSuccess } from "@/lib/api-utils";
import { markdownToHtml } from "@/lib/markdown";

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { content } = await request.json();
    if (!content) return apiError("Content required", 400);
    const html = await markdownToHtml(content);
    return apiSuccess({ html });
  } catch {
    return apiError("Failed to render markdown");
  }
}
