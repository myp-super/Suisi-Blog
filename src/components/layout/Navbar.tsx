"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/blog", label: "文章" },
  { href: "/projects", label: "项目" },
  { href: "/categories", label: "分类" },
  { href: "/about", label: "关于" },
];

export default function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link
            href="/"
            className="font-heading text-xl font-semibold tracking-wide text-foreground transition-colors hover:text-primary-light"
          >
            邃思
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive(link.href)
                    ? "bg-primary/20 text-primary-light"
                    : "text-muted hover:bg-bg-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Search button */}
            <Link
              href="/search"
              className="ml-2 rounded-lg p-2 text-muted transition-colors hover:bg-bg-muted hover:text-foreground"
              aria-label="搜索"
            >
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
            </Link>

            {/* Admin link — only visible when logged in */}
            {isLoggedIn && (
              <Link
                href="/admin"
                className="ml-1 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-bg-muted hover:text-foreground"
              >
                管理
              </Link>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            <Link
              href="/search"
              className="rounded-lg p-2 text-muted transition-colors hover:bg-bg-muted hover:text-foreground"
              aria-label="搜索"
            >
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
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-bg-muted hover:text-foreground"
              aria-label="菜单"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="5" y2="5" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="19" y2="19" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 flex h-full w-64 flex-col bg-bg-muted border-l border-border p-6 animate-slide-in">
            <div className="flex items-center justify-between mb-8">
              <span className="font-heading text-lg font-semibold text-foreground">
                邃思
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-bg hover:text-foreground"
                aria-label="关闭"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/20 text-primary-light font-medium"
                      : "text-muted hover:bg-bg hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isLoggedIn && (
                <>
                  <div className="border-t border-border my-2" />
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-bg hover:text-foreground transition-colors"
                  >
                    管理后台
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
