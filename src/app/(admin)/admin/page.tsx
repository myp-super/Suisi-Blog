import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();
  const [postCount, draftCount, commentPending, projectCount] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: false } }),
    prisma.comment.count({ where: { approved: false } }),
    prisma.project.count(),
  ]);

  const cards = [
    { label: "文章总数", value: postCount, href: "/admin/posts", color: "text-primary-light" },
    { label: "草稿", value: draftCount, href: "/admin/posts", color: "text-yellow-400" },
    { label: "待审核评论", value: commentPending, href: "/admin/comments", color: "text-accent" },
    { label: "项目", value: projectCount, href: "/admin/projects", color: "text-purple-400" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-1">仪表盘</h1>
      <p className="text-muted text-sm mb-8">欢迎回来，{session?.user?.name || "作者"}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="glass-card p-5 hover:border-primary/30 transition-all"
          >
            <p className="text-3xl font-bold font-heading mb-1" style={{ color: "inherit" }}>
              <span className={card.color}>{card.value}</span>
            </p>
            <p className="text-xs text-muted">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold mb-4">快捷操作</h2>
          <div className="space-y-2">
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors text-sm"
            >
              <span className="text-primary-light">+</span> 新建文章
            </Link>
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors text-sm"
            >
              <span className="text-accent">+</span> 新建项目
            </Link>
            <Link
              href="/admin/comments"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors text-sm"
            >
              <span className="text-yellow-400">!</span> 审核评论
              {commentPending > 0 && (
                <span className="ml-auto text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                  {commentPending}
                </span>
              )}
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors text-sm"
            >
              <span>⚙</span> 账户设置
            </Link>
          </div>
        </div>

        {/* Recent posts */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold mb-4">最近文章</h2>
          <RecentPosts />
        </div>
      </div>
    </div>
  );
}

async function RecentPosts() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
    select: { id: true, title: true, slug: true, published: true, updatedAt: true },
  });

  return (
    <div className="space-y-1">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/admin/posts/${post.id}`}
          className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors text-sm"
        >
          <span className="truncate flex-1 min-w-0">{post.title}</span>
          <span className="ml-2 shrink-0">
            {post.published ? (
              <span className="text-xs text-accent">已发布</span>
            ) : (
              <span className="text-xs text-yellow-400">草稿</span>
            )}
          </span>
        </Link>
      ))}
      {posts.length === 0 && <p className="text-xs text-muted p-3">暂无文章</p>}
    </div>
  );
}
