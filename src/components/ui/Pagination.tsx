import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];

  // Always show first page
  pages.push(1);

  if (current > 3) {
    pages.push("ellipsis");
  }

  // Pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("ellipsis");
  }

  // Always show last page
  if (total > 1) {
    pages.push(total);
  }

  return pages;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const buildHref = (page: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${page}`;
  };

  const btnBase =
    "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors";

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="分页导航">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className={`${btnBase} border border-border text-muted hover:border-primary/40 hover:text-foreground`}
        >
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
        </Link>
      ) : (
        <span
          className={`${btnBase} cursor-not-allowed border border-border text-muted-strong opacity-40`}
        >
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
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, idx) => {
        if (page === "ellipsis") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className={`${btnBase} cursor-default text-muted-strong`}
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <Link
            key={page}
            href={buildHref(page)}
            className={`${btnBase} border ${
              isActive
                ? "border-primary bg-primary text-white font-medium"
                : "border-border text-muted hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {page}
          </Link>
        );
      })}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className={`${btnBase} border border-border text-muted hover:border-primary/40 hover:text-foreground`}
        >
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
        </Link>
      ) : (
        <span
          className={`${btnBase} cursor-not-allowed border border-border text-muted-strong opacity-40`}
        >
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
        </span>
      )}
    </nav>
  );
}
