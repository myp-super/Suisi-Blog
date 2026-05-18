import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <h1 className="text-3xl font-heading font-bold mb-2">分类</h1>
      <p className="text-muted text-sm mb-8">按分类浏览文章</p>

      {categories.length === 0 ? (
        <div className="glass-card p-12 text-center"><p className="text-muted">暂无分类</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="glass-card p-5 hover:border-primary/30 transition-all group"
            >
              <h2 className="text-lg font-heading font-semibold group-hover:text-primary-light transition-colors">
                {cat.name}
              </h2>
              <p className="text-sm text-muted mt-1">{cat._count.posts} 篇文章</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
