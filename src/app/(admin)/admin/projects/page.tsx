import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteButton } from "../posts/DeleteButton";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">项目管理</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          新建项目
        </Link>
      </div>

      <div className="glass-card overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                标题
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                描述
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted uppercase tracking-wider">
                精选
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-muted">
                  暂无项目
                </td>
              </tr>
            )}
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 font-medium">{project.title}</td>
                <td className="px-4 py-3 text-muted max-w-xs truncate">
                  {project.description || "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  {project.featured ? (
                    <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      精选
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="rounded-md px-3 py-1.5 text-xs font-medium bg-bg-muted hover:bg-white/10 transition-colors"
                    >
                      编辑
                    </Link>
                    <DeleteButton slug={project.slug} endpoint={`/api/projects/${project.slug}`} />
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
