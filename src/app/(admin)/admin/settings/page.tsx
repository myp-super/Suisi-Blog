import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">设置</h1>

      {/* Account info */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-heading font-semibold">账户信息</h2>
        <p className="text-xs text-muted">
          以下是您当前的账户信息。
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-muted mb-1">用户名</label>
            <div className="rounded-lg bg-bg-muted border border-border px-3 py-2 text-sm">
              {session?.user?.name || "—"}
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">邮箱</label>
            <div className="rounded-lg bg-bg-muted border border-border px-3 py-2 text-sm">
              {session?.user?.email || "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Form to update name */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-heading font-semibold">更新用户名</h2>
        <form className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-xs text-muted mb-1">
              新用户名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={session?.user?.name || ""}
              className="w-full max-w-md rounded-lg bg-bg-muted border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            保存更改
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="glass-card rounded-xl p-6 space-y-4 border border-destructive/20">
        <h2 className="text-lg font-heading font-semibold text-destructive">
          危险区域
        </h2>
        <p className="text-xs text-muted">
          此区域的操作不可逆，请谨慎操作。
        </p>
        <button
          type="button"
          disabled
          className="rounded-lg bg-destructive/10 px-5 py-2 text-sm font-medium text-destructive opacity-50 cursor-not-allowed"
        >
          删除账户（未实现）
        </button>
      </div>
    </div>
  );
}
