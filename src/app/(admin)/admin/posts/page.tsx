import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteButton } from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: {
      categories: { include: { category: true } },
      author: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">文章管理</h1>
          <p className="text-muted text-sm">共 {posts.length} 篇文章</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + 新建文章
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-muted text-sm">暂无文章</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">标题</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">分类</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">状态</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">更新日期</th>
                <th className="px-4 py-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/posts/${post.id}`} className="hover:text-primary-light transition-colors">
                      <span className="font-medium line-clamp-1">{post.title}</span>
                    </Link>
                    <span className="text-xs text-muted block">{post.slug}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {post.categories.map((pc) => (
                        <span key={pc.categoryId} className="text-xs text-primary-light bg-primary/10 px-1.5 py-0.5 rounded">
                          {pc.category.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {post.published ? (
                      <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full">已发布</span>
                    ) : (
                      <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">草稿</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted hidden lg:table-cell text-xs">
                    {new Date(post.updatedAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-xs text-muted hover:text-primary-light transition-colors px-2 py-1"
                      >
                        预览
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-xs text-primary-light hover:underline px-2 py-1"
                      >
                        编辑
                      </Link>
                      <DeleteButton slug={post.slug} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
