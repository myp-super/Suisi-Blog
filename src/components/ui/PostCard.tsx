import Link from "next/link";
import Image from "next/image";

interface Category {
  category: { name: string; slug: string };
}

interface Tag {
  tag: { name: string };
}

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt?: string | null;
    coverImage?: string | null;
    createdAt: string | Date;
    published?: boolean;
    featured?: boolean;
    categories?: { category: { name: string; slug: string } }[];
    tags?: { tag: { name: string } }[];
    author?: { name: string } | null;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const {
    slug,
    title,
    excerpt,
    coverImage,
    createdAt,
    featured,
    categories,
    author,
  } = post;

  const dateStr = new Date(createdAt).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="glass-card overflow-hidden transition-colors hover:border-primary/30">
        {/* Cover image */}
        {coverImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-3 p-5">
          {/* Category badges */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <span
                  key={c.category.slug}
                  className="inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent"
                >
                  {c.category.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-heading text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary-light">
            {featured && (
              <span className="mr-2 inline-block rounded bg-primary/25 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-primary-light">
                精选
              </span>
            )}
            {title}
          </h3>

          {/* Excerpt */}
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">
            {excerpt}
          </p>

          {/* Meta */}
          <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-strong">
            <time dateTime={new Date(createdAt).toISOString()}>{dateStr}</time>
            {author?.name && <span>{author.name}</span>}
          </div>
        </div>
      </article>
    </Link>
  );
}
