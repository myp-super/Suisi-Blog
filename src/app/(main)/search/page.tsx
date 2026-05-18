import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  if (!q) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <h1 className="text-3xl font-heading font-bold mb-8">搜索</h1>
        <form method="get" action="/search" className="flex gap-3">
          <input
            name="q"
            type="text"
            placeholder="输入关键词搜索文章..."
            className="flex-1 px-4 py-2.5 bg-bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
          >
            搜索
          </button>
        </form>
        <div className="mt-10 glass-card p-8 text-center">
          <p className="text-muted text-sm">输入关键词开始搜索</p>
        </div>
      </div>
    );
  }

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: q } },
        { excerpt: { contains: q } },
      ],
    },
    include: {
      categories: { include: { category: true } },
      author: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <h1 className="text-3xl font-heading font-bold mb-2">搜索结果</h1>
      <p className="text-muted text-sm mb-8">
        关键词 &quot;{q}&quot; — 找到 {posts.length} 篇文章
      </p>

      <form method="get" action="/search" className="flex gap-3 mb-10">
        <input
          name="q"
          type="text"
          defaultValue={q}
          placeholder="输入关键词搜索文章..."
          className="flex-1 px-4 py-2.5 bg-bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
        >
          搜索
        </button>
      </form>

      {posts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted">未找到相关文章</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="glass-card p-5 hover:border-primary/30 transition-all group block"
            >
              <div className="flex items-center gap-2 mb-2">
                {post.categories.map((pc) => (
                  <span key={pc.categoryId} className="text-xs text-primary-light bg-primary/10 px-2 py-0.5 rounded">
                    {pc.category.name}
                  </span>
                ))}
              </div>
              <h2 className="text-lg font-heading font-semibold group-hover:text-primary-light transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-muted mt-1 line-clamp-2">{post.excerpt}</p>
              <div className="text-xs text-muted mt-2">
                {post.author.name} · {new Date(post.createdAt).toLocaleDateString("zh-CN")}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
