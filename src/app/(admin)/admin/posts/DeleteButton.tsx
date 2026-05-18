"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({ slug, endpoint }: { slug: string; endpoint?: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const apiUrl = endpoint || `/api/posts/${slug}`;

  async function handleDelete() {
    await fetch(apiUrl, { method: "DELETE" });
    router.refresh();
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-xs text-destructive hover:underline px-2 py-1"
      >
        删除
      </button>
    );
  }

  return (
    <span className="flex items-center gap-1">
      <button
        onClick={handleDelete}
        className="text-xs text-destructive font-medium px-1 py-1 hover:underline"
      >
        确认
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="text-xs text-muted px-1 py-1 hover:underline"
      >
        取消
      </button>
    </span>
  );
}
