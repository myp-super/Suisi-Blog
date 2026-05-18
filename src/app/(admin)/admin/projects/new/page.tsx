"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NewProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    demoUrl: "",
    repoUrl: "",
    coverImage: "",
    featured: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const uploadImage = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      if (!res.ok) throw new Error("上传失败");
      const json = await res.json();
      setForm((prev) => ({ ...prev, coverImage: json.url }));
    } catch (err) {
      console.error("图片上传失败", err);
      alert("图片上传失败");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("创建失败");
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      console.error("创建项目失败", err);
      alert("创建项目失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">新建项目</h1>
      </div>

      <form onSubmit={handleSubmit} className="glass-card space-y-6 rounded-xl p-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1.5">
            标题
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-lg bg-bg-muted border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="项目标题"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1.5">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={form.slug}
            onChange={handleChange}
            className="w-full rounded-lg bg-bg-muted border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="project-slug"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1.5">
            描述
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-lg bg-bg-muted border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="简短描述"
          />
        </div>

        {/* Content (MDX) */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1.5">
            内容 (MDX)
          </label>
          <textarea
            id="content"
            name="content"
            rows={12}
            value={form.content}
            onChange={handleChange}
            className="w-full rounded-lg bg-bg-muted border border-border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="MDX 内容..."
          />
        </div>

        {/* Demo URL */}
        <div>
          <label htmlFor="demoUrl" className="block text-sm font-medium mb-1.5">
            演示地址
          </label>
          <input
            id="demoUrl"
            name="demoUrl"
            type="url"
            value={form.demoUrl}
            onChange={handleChange}
            className="w-full rounded-lg bg-bg-muted border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="https://example.com"
          />
        </div>

        {/* Repo URL */}
        <div>
          <label htmlFor="repoUrl" className="block text-sm font-medium mb-1.5">
            仓库地址
          </label>
          <input
            id="repoUrl"
            name="repoUrl"
            type="url"
            value={form.repoUrl}
            onChange={handleChange}
            className="w-full rounded-lg bg-bg-muted border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="https://github.com/..."
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium mb-1.5">封面图片</label>
          {form.coverImage && (
            <div className="mb-3 relative w-48 aspect-video rounded-lg overflow-hidden border border-border">
              <Image
                src={form.coverImage}
                alt="封面预览"
                fill
                className="object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadImage(file);
            }}
            className="block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-bg-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-white/10 file:cursor-pointer"
          />
          {uploading && <p className="mt-1 text-xs text-muted">上传中...</p>}
          <input
            name="coverImage"
            type="url"
            value={form.coverImage}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg bg-bg-muted border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="或直接输入图片 URL"
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            checked={form.featured}
            onChange={handleChange}
            className="h-4 w-4 rounded border-border bg-bg-muted accent-primary"
          />
          <label htmlFor="featured" className="text-sm font-medium">
            精选项目
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? "保存中..." : "创建项目"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg bg-bg-muted px-5 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
