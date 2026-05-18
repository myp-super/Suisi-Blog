import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function toggleApproved(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) return;
  await prisma.comment.update({
    where: { id },
    data: { approved: !comment.approved },
  });
  revalidatePath("/admin/comments");
}

async function deleteComment(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.comment.delete({ where: { id } });
  revalidatePath("/admin/comments");
}

export default async function CommentsPage() {
  const comments = await prisma.comment.findMany({
    include: {
      post: { select: { id: true, title: true, slug: true } },
    },
    orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">评论管理</h1>

      <div className="glass-card overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                作者
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                内容
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                文章
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted uppercase tracking-wider">
                状态
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {comments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted">
                  暂无评论
                </td>
              </tr>
            )}
            {comments.map((comment) => (
              <tr key={comment.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{comment.authorName}</p>
                    <p className="text-xs text-muted">
                      {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="max-w-xs truncate text-muted">{comment.content}</p>
                </td>
                <td className="px-4 py-3">
                  {comment.post ? (
                    <Link
                      href={`/blog/${comment.post.slug}`}
                      className="text-primary-light hover:underline"
                    >
                      {comment.post.title}
                    </Link>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {comment.approved ? (
                    <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      已通过
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                      待审核
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <form action={toggleApproved}>
                      <input type="hidden" name="id" value={comment.id} />
                      <button
                        type="submit"
                        className="rounded-md px-3 py-1.5 text-xs font-medium bg-bg-muted hover:bg-white/10 transition-colors"
                      >
                        {comment.approved ? "驳回" : "通过"}
                      </button>
                    </form>
                    <form action={deleteComment}>
                      <input type="hidden" name="id" value={comment.id} />
                      <button
                        type="submit"
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        删除
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
