import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostEditorForm } from "../PostEditorForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;

  const [post, categories, tags] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">编辑文章</h1>
      <PostEditorForm categories={categories} tags={tags} post={post} />
    </div>
  );
}
