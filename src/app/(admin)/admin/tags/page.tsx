import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function addTag(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  if (!name?.trim()) return;
  await prisma.tag.create({ data: { name: name.trim() } });
  revalidatePath("/admin/tags");
}

async function updateTag(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  if (!id || !name?.trim()) return;
  await prisma.tag.update({ where: { id }, data: { name: name.trim() } });
  revalidatePath("/admin/tags");
}

async function deleteTag(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.tag.delete({ where: { id } });
  revalidatePath("/admin/tags");
}

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">标签管理</h1>

      {/* Add form */}
      <form action={addTag} className="glass-card flex items-end gap-3 rounded-xl p-4">
        <div className="flex-1">
          <label htmlFor="name" className="block text-xs text-muted mb-1">
            新建标签
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg bg-bg-muted border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="标签名称"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors shrink-0"
        >
          添加
        </button>
      </form>

      {/* List */}
      <div className="glass-card overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                名称
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tags.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-12 text-center text-muted">
                  暂无标签
                </td>
              </tr>
            )}
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <form
                    action={updateTag}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="id" value={tag.id} />
                    <input
                      name="name"
                      defaultValue={tag.name}
                      className="flex-1 rounded-lg bg-bg-muted border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      type="submit"
                      className="rounded-md px-2 py-1 text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors shrink-0"
                    >
                      保存
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <form action={deleteTag}>
                      <input type="hidden" name="id" value={tag.id} />
                      <button
                        type="submit"
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        删除
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
