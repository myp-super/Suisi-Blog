import Link from "next/link";

interface Category {
  name: string;
  slug: string;
  _count?: { posts: number };
}

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  if (!categories || categories.length === 0) {
    return (
      <p className="text-sm text-muted-strong">暂无分类</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/categories/${cat.slug}`}
          className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
        >
          <span className="font-heading text-base font-semibold text-foreground transition-colors group-hover:text-primary-light">
            {cat.name}
          </span>
          {cat._count && (
            <span className="rounded-full bg-bg-muted px-2.5 py-0.5 text-xs text-muted">
              {cat._count.posts} 篇
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
