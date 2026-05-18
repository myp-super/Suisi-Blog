import Link from "next/link";

interface PostLink {
  slug: string;
  title: string;
}

interface PrevNextPostProps {
  prev: PostLink | null;
  next: PostLink | null;
}

const arrowLeft = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const arrowRight = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function PrevNextPost({ prev, next }: PrevNextPostProps) {
  if (!prev && !next) return null;

  return (
    <nav className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="文章导航">
      {/* Previous */}
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
        >
          <span className="mt-0.5 text-muted-strong transition-colors group-hover:text-primary-light">
            {arrowLeft}
          </span>
          <div className="min-w-0">
            <span className="block text-xs text-muted-strong">上一篇</span>
            <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary-light">
              {prev.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 opacity-40 cursor-not-allowed">
          <span className="mt-0.5 text-muted-strong">{arrowLeft}</span>
          <div className="min-w-0">
            <span className="block text-xs text-muted-strong">上一篇</span>
            <span className="block text-sm text-muted-strong">已经是第一篇了</span>
          </div>
        </div>
      )}

      {/* Next */}
      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex items-start justify-end gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30 sm:text-right"
        >
          <div className="min-w-0">
            <span className="block text-xs text-muted-strong">下一篇</span>
            <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary-light">
              {next.title}
            </span>
          </div>
          <span className="mt-0.5 text-muted-strong transition-colors group-hover:text-primary-light">
            {arrowRight}
          </span>
        </Link>
      ) : (
        <div className="flex items-start justify-end gap-3 rounded-xl border border-border bg-card p-4 opacity-40 cursor-not-allowed sm:text-right">
          <div className="min-w-0">
            <span className="block text-xs text-muted-strong">下一篇</span>
            <span className="block text-sm text-muted-strong">已经是最后一篇了</span>
          </div>
          <span className="mt-0.5 text-muted-strong">{arrowRight}</span>
        </div>
      )}
    </nav>
  );
}
