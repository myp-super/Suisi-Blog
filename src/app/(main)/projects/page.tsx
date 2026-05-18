import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <h1 className="text-3xl font-heading font-bold mb-2">项目</h1>
      <p className="text-muted text-sm mb-8">我的开源项目与作品</p>

      {projects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-muted">暂无项目</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="glass-card p-6 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                {project.featured && (
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded">精选</span>
                )}
                <span className="text-xs text-muted">项目</span>
              </div>
              <h2 className="text-lg font-heading font-semibold group-hover:text-primary-light transition-colors">
                {project.title}
              </h2>
              <p className="text-sm text-muted mt-2 line-clamp-2">{project.description}</p>
              <div className="flex items-center gap-4 mt-4 text-xs text-muted">
                {project.demoUrl && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    演示
                  </span>
                )}
                {project.repoUrl && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                    代码
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
