import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function addCategory(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  if (!name?.trim()) return;
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w一-鿿-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  await prisma.category.create({ data: { name: name.trim(), slug } });
  revalidatePath("/admin/categories");
}

async function updateCategory(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  if (!id || !name?.trim()) return;
  await prisma.category.update({ where: { id }, data: { name: name.trim() } });
  revalidatePath("/admin/categories");
}

async function deleteCategory(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">分类管理</h1>

      {/* Add form */}
      <form action={addCategory} className="glass-card flex items-end gap-3 rounded-xl p-4">
        <div className="flex-1">
          <label htmlFor="name" className="block text-xs text-muted mb-1">
            新建分类
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg bg-bg-muted border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="分类名称"
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
              <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Slug
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-muted">
                  暂无分类
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <form
                    action={updateCategory}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="id" value={cat.id} />
                    <input
                      name="name"
                      defaultValue={cat.name}
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
                <td className="px-4 py-3 font-mono text-xs text-muted">{cat.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end">
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={cat.id} />
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
