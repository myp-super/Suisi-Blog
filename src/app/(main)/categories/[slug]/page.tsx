import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);
  const limit = 6;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const where = {
    published: true,
    categories: { some: { categoryId: category.id } },
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { categories: { include: { category: true } }, author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <h1 className="text-3xl font-heading font-bold mb-2">{category.name}</h1>
      <p className="text-muted text-sm mb-8">共 {total} 篇文章</p>

      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="glass-card p-5 hover:border-primary/30 transition-all group block"
          >
            <h2 className="text-lg font-heading font-semibold group-hover:text-primary-light transition-colors">
              {post.title}
            </h2>
            <p className="text-sm text-muted mt-1 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted">
              <span>{post.author.name}</span>
              <span>·</span>
              <time>{new Date(post.createdAt).toLocaleDateString("zh-CN")}</time>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {page > 1 && (
            <Link href={`/categories/${slug}?page=${page - 1}`} className="px-4 py-2 border border-border rounded-lg text-sm hover:border-primary/50 transition-colors">
              ← 上一页
            </Link>
          )}
          <span className="text-sm text-muted px-4">{page} / {totalPages}</span>
          {page < totalPages && (
            <Link href={`/categories/${slug}?page=${page + 1}`} className="px-4 py-2 border border-border rounded-lg text-sm hover:border-primary/50 transition-colors">
              下一页 →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
