"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }, [query, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative flex w-full max-w-lg items-center">
      {/* Search icon */}
      <div className="pointer-events-none absolute left-3 text-muted-strong">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="搜索文章..."
        className="w-full rounded-lg border border-border bg-bg-muted py-2.5 pl-10 pr-20 text-sm text-foreground placeholder:text-muted-strong outline-none transition-colors focus:border-primary/50"
      />

      <button
        onClick={handleSearch}
        className="absolute right-2 rounded-md bg-primary px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary/80"
      >
        搜索
      </button>
    </div>
  );
}
