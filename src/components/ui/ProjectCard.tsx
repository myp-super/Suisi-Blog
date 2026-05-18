import Link from "next/link";
import Image from "next/image";

interface ProjectCardProps {
  project: {
    slug: string;
    title: string;
    description: string;
    coverImage?: string | null;
    demoUrl?: string | null;
    repoUrl?: string | null;
    featured?: boolean;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { slug, title, description, coverImage, demoUrl, repoUrl, featured } =
    project;

  const handleExternalClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Link href={`/projects/${slug}`} className="group block">
      <article className="glass-card overflow-hidden transition-colors hover:border-primary/30">
        {/* Cover image */}
        {coverImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
            <Image
              src={coverImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-3 p-5">
          {/* Project label + Featured */}
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary-light">
              项目
            </span>
            {featured && (
              <span className="inline-block rounded bg-accent/20 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-accent">
                精选
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-heading text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary-light">
            {title}
          </h3>

          {/* Description */}
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">
            {description}
          </p>

          {/* External links */}
          {(demoUrl || repoUrl) && (
            <div className="flex items-center gap-3 pt-1">
              {demoUrl && (
                <a
                  href={demoUrl}
                  onClick={(e) => handleExternalClick(e, demoUrl)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary/40 hover:text-primary-light"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" x2="21" y1="14" y2="3" />
                  </svg>
                  演示
                </a>
              )}
              {repoUrl && (
                <a
                  href={repoUrl}
                  onClick={(e) => handleExternalClick(e, repoUrl)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary/40 hover:text-primary-light"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  源码
                </a>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
