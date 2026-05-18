import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { markdownToHtml } from "@/lib/markdown";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug }, select: { title: true, description: true } });
  if (!project) return { title: "项目未找到" };
  return { title: project.title, description: project.description };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { post: { select: { slug: true, title: true } } },
  });

  if (!project) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      <header className="mb-10">
        {project.featured && (
          <span className="inline-block text-xs font-medium text-accent bg-accent/10 px-2.5 py-0.5 rounded-full mb-4">
            精选项目
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl font-heading font-bold leading-tight glow-text">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">{project.description}</p>

        <div className="flex items-center gap-4 mt-6">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              在线演示
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border hover:border-primary/50 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              源代码
            </a>
          )}
        </div>

        {project.coverImage && (
          <div className="relative w-full aspect-video mt-8 rounded-xl overflow-hidden">
            <img src={project.coverImage} alt={project.title} className="object-cover w-full h-full" />
          </div>
        )}
      </header>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: await markdownToHtml(project.content) }}
      />

      {project.post && (
        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href={`/blog/${project.post.slug}`}
            className="glass-card p-4 hover:border-primary/30 transition-all group inline-flex items-center gap-3"
          >
            <span className="text-xs text-muted">相关文章</span>
            <span className="text-sm font-medium group-hover:text-primary-light transition-colors">
              {project.post.title}
            </span>
            <span className="text-xs text-muted">→</span>
          </Link>
        </div>
      )}
    </article>
  );
}
