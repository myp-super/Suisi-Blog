import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

const sidebarLinks = [
  { href: "/admin", label: "仪表盘", icon: "◫" },
  { href: "/admin/posts", label: "文章", icon: "☷" },
  { href: "/admin/projects", label: "项目", icon: "⬡" },
  { href: "/admin/categories", label: "分类", icon: "⊞" },
  { href: "/admin/tags", label: "标签", icon: "#" },
  { href: "/admin/comments", label: "评论", icon: "💬" },
  { href: "/admin/settings", label: "设置", icon: "⚙" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isLogin = !session?.user;

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 min-h-screen bg-bg-muted border-r border-border flex flex-col shrink-0">
        <div className="p-5 border-b border-border">
          <Link href="/admin" className="text-xl font-heading font-semibold tracking-tight">
            邃思<span className="text-primary-light text-sm ml-1">管理</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-white/[0.04] transition-colors"
          >
            <span className="w-5 text-center text-base">↗</span>
            查看网站
          </a>
          <div className="border-t border-border my-1" />
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-white/[0.04] transition-colors"
            >
              <span className="w-5 text-center text-base">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary-light">
              {session.user.name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-xs text-muted truncate">{session.user.email}</p>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="w-full mt-2 px-3 py-2 text-xs text-muted hover:text-destructive rounded-lg hover:bg-white/[0.04] transition-colors text-left">
              退出登录
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-6 lg:p-8 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
