"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  postSlug: string;
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments ?? []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [postSlug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!authorName.trim() || !content.trim()) {
      setError("请填写昵称和评论内容");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug,
          authorName: authorName.trim(),
          content: content.trim(),
        }),
      });

      if (res.ok) {
        setSuccessMsg("评论已提交，待审核后显示");
        setAuthorName("");
        setContent("");
      } else {
        const data = await res.json();
        setError(data.error || "提交失败，请稍后重试");
      }
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="font-heading text-xl font-semibold text-foreground">
        评论
      </h2>

      {/* Existing comments */}
      {loading ? (
        <p className="text-sm text-muted">加载评论中...</p>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="glass-card p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-strong">
                <span className="font-medium text-foreground">
                  {comment.authorName}
                </span>
                <span>
                  {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-strong">暂无评论，来抢个沙发吧</p>
      )}

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="昵称"
          maxLength={50}
          className="w-full rounded-lg border border-border bg-bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-strong outline-none transition-colors focus:border-primary/50"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下你的想法..."
          rows={4}
          maxLength={1000}
          className="w-full rounded-lg border border-border bg-bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-strong outline-none transition-colors focus:border-primary/50 resize-none"
        />

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {successMsg && (
          <p className="text-sm text-accent">{successMsg}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "提交中..." : "发表评论"}
        </button>
      </form>
    </div>
  );
}
