"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [tab, setTab] = useState<"email" | "password">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("邮箱或密码错误");
    } else if (result?.ok) {
      window.location.href = "/admin";
    }
    setLoading(false);
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn("email", { email, redirect: false });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold font-heading glow-text">邃思</h1>
          <p className="text-muted mt-2 text-sm">管理后台</p>
        </div>

        {/* Tab switcher */}
        <div className="flex mb-6 border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setTab("password")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              tab === "password" ? "bg-primary text-white" : "bg-bg-muted text-muted hover:text-foreground"
            }`}
          >
            密码登录
          </button>
          <button
            onClick={() => setTab("email")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              tab === "email" ? "bg-primary text-white" : "bg-bg-muted text-muted hover:text-foreground"
            }`}
          >
            邮箱链接
          </button>
        </div>

        {tab === "password" ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">邮箱</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-2.5 bg-bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">密码</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入开发密码"
                className="w-full px-4 py-2.5 bg-bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? "登录中..." : "登录"}
            </button>
            <p className="text-xs text-muted text-center">开发密码: suisi2024 (可在 .env 中修改 DEV_PASSWORD)</p>
          </form>
        ) : (
          <div>
            {!sent ? (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label htmlFor="magic-email" className="block text-sm font-medium mb-1.5">邮箱地址</label>
                  <input
                    id="magic-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-2.5 bg-bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
                >
                  {loading ? "发送中..." : "发送登录链接"}
                </button>
              </form>
            ) : (
              <div className="text-center p-6 glass-card">
                <div className="text-accent text-4xl mb-3">✓</div>
                <p className="text-sm">已发送登录链接至</p>
                <p className="font-medium text-sm mt-1">{email}</p>
                <p className="text-muted text-xs mt-3">请检查邮箱并点击链接完成登录</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 text-primary-light text-xs hover:underline"
                >
                  更换邮箱
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
