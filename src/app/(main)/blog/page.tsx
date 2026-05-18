import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/ui/PostCard";

export const dynamic = "force-dynamic";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = 6;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { published: true };
  if (params.category) {
    where.categories = { some: { category: { slug: params.category } } };
  }
  if (params.tag) {
    where.tags = { some: { tag: { name: params.tag } } };
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        author: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const pageTitle = params.category
    ? `分类: ${params.category}`
    : params.tag
      ? `标签: ${params.tag}`
      : "文章";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <h1 className="text-3xl font-heading font-bold mb-2">{pageTitle}</h1>
      <p className="text-muted text-sm mb-8">共 {total} 篇文章</p>

      {posts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted">暂无文章</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {page > 1 && (
            <Link
              href={`/blog?page=${page - 1}${params.category ? `&category=${params.category}` : ""}${params.tag ? `&tag=${params.tag}` : ""}`}
              className="px-4 py-2 border border-border rounded-lg text-sm hover:border-primary/50 transition-colors"
            >
              ← 上一页
            </Link>
          )}
          <span className="text-sm text-muted px-4">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/blog?page=${page + 1}${params.category ? `&category=${params.category}` : ""}${params.tag ? `&tag=${params.tag}` : ""}`}
              className="px-4 py-2 border border-border rounded-lg text-sm hover:border-primary/50 transition-colors"
            >
              下一页 →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
