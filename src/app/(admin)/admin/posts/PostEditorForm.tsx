"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  featured: boolean;
  categories: { categoryId: string; category: Category }[];
  tags: { tagId: string; tag: Tag }[];
}

interface Props {
  categories: Category[];
  tags: Tag[];
  post?: Post;
}

export function PostEditorForm({ categories, tags, post }: Props) {
  const router = useRouter();
  const folderInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [published, setPublished] = useState(post?.published || false);
  const [featured, setFeatured] = useState(post?.featured || false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories.map((pc) => pc.categoryId) || []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    post?.tags.map((pt) => pt.tagId) || []
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [editMode, setEditMode] = useState<"folder" | "direct">(post ? "direct" : "folder");

  function generateSlug(t: string) {
    setSlug(slugify(t, { lower: true, strict: true }));
  }

  function toggleCategory(id: string) {
    setSelectedCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  function toggleTag(id: string) {
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  }

  // Upload a single image file
  async function uploadImageFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    return data.url || null;
  }

  // ======= Folder upload: Obsidian vault =======
  async function handleFolderUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadStatus("读取文件中...");
    const allFiles = Array.from(files);

    // Separate .md files and image files
    const mdFiles = allFiles.filter((f) => /\.(md|mdx|markdown)$/i.test(f.name));
    const imageFiles = allFiles.filter((f) => /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i.test(f.name));

    if (mdFiles.length === 0) {
      alert("文件夹中没有找到 .md 文件");
      return;
    }

    // Read the first .md file
    const mainMd = mdFiles[0];
    setFolderName(mainMd.webkitRelativePath?.split("/")[0] || mainMd.name);
    const mdContent = await mainMd.text();
    let processedContent = mdContent;

    // Set title from filename
    const mdName = mainMd.name.replace(/\.(md|mdx|markdown)$/i, "");
    if (!title) {
      setTitle(mdName.replace(/[-_]/g, " "));
      generateSlug(mdName);
    }

    // Upload images and build replacement map
    if (imageFiles.length > 0) {
      setUploadStatus(`上传 ${imageFiles.length} 张图片中...`);

      const imageMap = new Map<string, string>(); // originalPath → uploadedUrl

      for (let i = 0; i < imageFiles.length; i++) {
        const img = imageFiles[i];
        setUploadStatus(`上传图片 ${i + 1}/${imageFiles.length}: ${img.name}`);
        const url = await uploadImageFile(img);
        if (url) {
          // Map by exact filename
          imageMap.set(img.name, url);
          // Also map by relative path (for Obsidian-style links)
          const relPath = img.webkitRelativePath;
          if (relPath) {
            imageMap.set(relPath, url);
            // Also store just the filename part for matching
            const parts = relPath.replace(/\\/g, "/").split("/");
            // Map subfolder paths: "attachments/img.png", "assets/img.png" etc
            for (let j = 0; j < parts.length; j++) {
              const subPath = parts.slice(j).join("/");
              imageMap.set(subPath, url);
            }
          }
        }
      }

      // Helper to find matching uploaded URL for a given image path
      function findImageUrl(imgPath: string): string | null {
        // Try exact match
        if (imageMap.has(imgPath)) return imageMap.get(imgPath)!;
        // Try just the filename
        const filename = imgPath.split("/").pop() || imgPath;
        if (imageMap.has(filename)) return imageMap.get(filename)!;
        // Try URL-decoded
        try {
          const decoded = decodeURIComponent(imgPath);
          if (imageMap.has(decoded)) return imageMap.get(decoded)!;
          const decodedFilename = decoded.split("/").pop() || decoded;
          if (imageMap.has(decodedFilename)) return imageMap.get(decodedFilename)!;
        } catch { /* ignore */ }
        return null;
      }

      let replacementCount = 0;

      // 1) Replace Obsidian wiki-link images: ![[filename.png]] or ![[folder/file.png]]
      processedContent = processedContent.replace(
        /!\[\[([^\]]+)\]\]/g,
        (match, imgPath) => {
          const cleanPath = imgPath.replace(/[|].*$/, "").trim(); // remove Obsidian aliases like |200
          const url = findImageUrl(cleanPath);
          if (url) {
            replacementCount++;
            const alt = cleanPath.split("/").pop() || cleanPath;
            return `![${alt}](${url})`;
          }
          // Keep original if no match
          return match;
        }
      );

      // 2) Replace standard markdown images: ![alt](path)
      processedContent = processedContent.replace(
        /!\[([^\]]*)\]\(([^)\s]+)\)/g,
        (match, altText, imgPath) => {
          // Skip URLs that are already absolute (http/https)
          if (/^https?:\/\//.test(imgPath)) return match;
          const url = findImageUrl(imgPath);
          if (url) {
            replacementCount++;
            return `![${altText}](${url})`;
          }
          return match;
        }
      );

      setUploadStatus(`完成！上传 ${imageFiles.length} 张，替换 ${replacementCount} 处引用`);
    } else {
      setUploadStatus("完成（无图片）");
    }

    setContent(processedContent);
  }

  // Cover image upload
  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImageFile(file);
    if (url) setCoverImage(url);
    setUploading(false);
  }

  // Preview
  async function handlePreview() {
    if (!content.trim()) return;
    setPreviewLoading(true);
    setShowPreview(true);
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      setPreviewHtml(data.html || "<p class='text-muted'>预览失败</p>");
    } catch {
      setPreviewHtml("<p class='text-destructive'>预览请求失败</p>");
    }
    setPreviewLoading(false);
  }

  // Submit
  async function handleSubmit(e: React.FormEvent, publishAfter: boolean) {
    e.preventDefault();
    if (!content.trim()) {
      alert("请先上传文件夹或编写内容");
      return;
    }
    setSaving(true);

    const finalSlug =
      slug || slugify(title || "untitled", { lower: true, strict: true }) || `post-${Date.now()}`;

    const body = {
      title: title || "未命名",
      slug: finalSlug,
      content,
      excerpt: excerpt || undefined,
      coverImage: coverImage || undefined,
      published: publishAfter,
      featured,
      categoryIds: selectedCategories,
      tagIds: selectedTags,
    };

    const url = isEdit ? `/api/posts/${post.slug}` : "/api/posts";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
    } else {
      const err = await res.json();
      alert(err.error || "保存失败");
    }
    setSaving(false);
  }

  return (
    <form className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1.5">标题</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => !slug && title && generateSlug(title)}
          placeholder="文章标题"
          required
          className="w-full px-4 py-2.5 bg-bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium mb-1.5">Slug</label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">/blog/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="article-slug"
            className="flex-1 px-4 py-2.5 bg-bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-mono"
          />
          <button
            type="button"
            onClick={() => title && generateSlug(title)}
            className="px-3 py-2.5 border border-border rounded-lg text-xs text-muted hover:text-foreground transition-colors shrink-0"
          >
            自动生成
          </button>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium mb-1.5">摘要</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          placeholder="简短的文章摘要（选填）"
          className="w-full px-4 py-2.5 bg-bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium mb-1.5">封面图片</label>
        <div className="flex items-center gap-3">
          <label className="px-4 py-2.5 border border-border rounded-lg text-sm cursor-pointer hover:border-primary/50 transition-colors">
            {uploading ? "上传中..." : "选择图片"}
            <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
          </label>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="或输入图片 URL"
            className="flex-1 px-4 py-2.5 bg-bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
        {coverImage && (
          <div className="mt-3 relative w-40 aspect-video rounded-lg overflow-hidden border border-border">
            <img src={coverImage} alt="封面预览" className="object-cover w-full h-full" />
            <button
              type="button"
              onClick={() => setCoverImage("")}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Categories + Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">分类</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategories.includes(cat.id)
                    ? "bg-primary text-white"
                    : "bg-bg-muted text-muted hover:text-foreground border border-border"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">标签</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedTags.includes(tag.id)
                    ? "bg-primary-light text-white"
                    : "bg-bg-muted text-muted hover:text-foreground border border-border"
                }`}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="rounded bg-bg-muted border-border"
          />
          <span className="text-sm">已发布</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="rounded bg-bg-muted border-border"
          />
          <span className="text-sm">精选</span>
        </label>
      </div>

      {/* ====== Content: Folder Upload vs Direct Edit ====== */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">内容</label>
          <div className="flex items-center gap-3">
            {editMode === "direct" && (
              <button type="button" onClick={() => setEditMode("folder")} className="text-xs text-primary-light hover:underline">
                切换到文件夹上传
              </button>
            )}
            {editMode === "folder" && (
              <button type="button" onClick={() => setEditMode("direct")} className="text-xs text-muted hover:text-foreground transition-colors">
                手动编辑
              </button>
            )}
            <button type="button" onClick={handlePreview} className="text-xs text-primary-light hover:underline">
              {showPreview ? "刷新预览" : "预览"}
            </button>
          </div>
        </div>

        {editMode === "folder" && (
          <div
            className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => folderInputRef.current?.click()}
          >
            <input
              ref={folderInputRef}
              type="file"
              /* @ts-expect-error webkitdirectory is widely supported */
              webkitdirectory=""
              directory=""
              multiple
              onChange={handleFolderUpload}
              className="hidden"
            />
            {folderName ? (
              <div>
                <div className="text-accent text-3xl mb-2">✓</div>
                <p className="text-sm font-medium">{folderName}</p>
                <p className="text-xs text-muted mt-1">{uploadStatus || "处理中..."}</p>
                <p className="text-xs text-muted mt-3">点击重新选择文件夹</p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-3 text-muted">📁</div>
                <p className="text-sm font-medium">点击选择 Obsidian 文件夹</p>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  自动识别 .md 文件作为文章内容
                  <br />
                  自动上传所有图片并替换路径
                  <br />
                  支持附件子文件夹（attachments / assets / images）
                </p>
              </div>
            )}
          </div>
        )}

        {editMode === "folder" && content && (
          <div className="mt-3 flex items-center gap-4 text-xs text-muted">
            <span>{content.length.toLocaleString()} 字符</span>
            <span>{content.split("\n").length} 行</span>
            <span>{(content.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length + (content.match(/!\[\[[^\]]+\]\]/g) || []).length} 张图片引用</span>
          </div>
        )}

        {editMode === "direct" && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            placeholder="用 Markdown 编写内容..."
            className="w-full px-4 py-3 bg-bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-mono resize-y"
          />
        )}

        {/* Preview panel */}
        {showPreview && (
          <div className="mt-4 border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-bg-muted border-b border-border">
              <span className="text-xs font-medium">预览</span>
              <button type="button" onClick={() => setShowPreview(false)} className="text-xs text-muted hover:text-foreground">
                关闭
              </button>
            </div>
            <div className="p-6 max-h-[600px] overflow-y-auto bg-[#0d1117]">
              {previewLoading ? (
                <p className="text-sm text-muted">渲染中...</p>
              ) : (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submit buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, false)}
          disabled={saving}
          className="px-5 py-2.5 border border-border rounded-lg text-sm font-medium hover:border-primary/50 transition-colors disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存为草稿"}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={saving}
          className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? "发布中..." : "发布"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  );
}
