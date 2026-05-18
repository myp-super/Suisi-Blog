import { prisma } from "@/lib/prisma";
import { PostEditorForm } from "../PostEditorForm";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">新建文章</h1>
      <PostEditorForm categories={categories} tags={tags} />
    </div>
  );
}
