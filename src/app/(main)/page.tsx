import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredPosts, recentPosts, featuredProjects] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, featured: true },
      include: { categories: { include: { category: true } }, tags: { include: { tag: true } }, author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.post.findMany({
      where: { published: true },
      include: { categories: { include: { category: true } }, author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.project.findMany({
      where: { featured: true },
      take: 3,
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      {/* Hero */}
      <section className="mb-16 lg:mb-24">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight glow-text">
          邃思
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-muted max-w-2xl">
          深度思考，技术与人文。分享项目、知识、与生活心得的个人知识花园。
        </p>
        <div className="flex gap-3 mt-6">
          <Link
            href="/blog"
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
          >
            阅读文章
          </Link>
          <Link
            href="/projects"
            className="px-5 py-2.5 border border-border hover:border-primary/50 rounded-lg text-sm font-medium transition-colors"
          >
            查看项目
          </Link>
        </div>
      </section>

      {/* Bento Grid: Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-heading font-semibold mb-6">精选文章</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredPosts[0] && (
              <Link
                href={`/blog/${featuredPosts[0].slug}`}
                className="md:col-span-2 md:row-span-2 glass-card p-6 hover:border-primary/30 transition-all group flex flex-col justify-end min-h-[320px] relative overflow-hidden"
              >
                {featuredPosts[0].coverImage && (
                  <Image
                    src={featuredPosts[0].coverImage}
                    alt={featuredPosts[0].title}
                    fill
                    className="object-cover -z-10 opacity-40 group-hover:opacity-50 transition-opacity"
                  />
                )}
                <div className="relative z-10 mt-auto">
                  {featuredPosts[0].categories[0] && (
                    <span className="text-xs font-medium text-primary-light bg-primary/10 px-2 py-0.5 rounded">
                      {featuredPosts[0].categories[0].category.name}
                    </span>
                  )}
                  <h3 className="text-2xl font-heading font-semibold mt-3 group-hover:text-primary-light transition-colors">
                    {featuredPosts[0].title}
                  </h3>
                  <p className="text-sm text-muted mt-2 line-clamp-2">{featuredPosts[0].excerpt}</p>
                </div>
              </Link>
            )}
            {featuredPosts.slice(1).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="glass-card p-5 hover:border-primary/30 transition-all group flex flex-col justify-end min-h-[150px] relative overflow-hidden"
              >
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover -z-10 opacity-30 group-hover:opacity-40 transition-opacity"
                  />
                )}
                <div className="relative z-10">
                  {post.categories[0] && (
                    <span className="text-xs font-medium text-primary-light bg-primary/10 px-2 py-0.5 rounded">
                      {post.categories[0].category.name}
                    </span>
                  )}
                  <h3 className="text-lg font-heading font-semibold mt-2 group-hover:text-primary-light transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted mt-1 line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold">最新文章</h2>
          <Link href="/blog" className="text-sm text-primary-light hover:underline">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="glass-card p-5 hover:border-primary/30 transition-all group"
            >
              {post.categories[0] && (
                <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded">
                  {post.categories[0].category.name}
                </span>
              )}
              <h3 className="text-base font-heading font-semibold mt-2 group-hover:text-primary-light transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-muted mt-2 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center gap-2 mt-4 text-xs text-muted">
                <span>{post.author.name}</span>
                <span>·</span>
                <span>{new Date(post.createdAt).toLocaleDateString("zh-CN")}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold">精选项目</h2>
            <Link href="/projects" className="text-sm text-primary-light hover:underline">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="glass-card p-5 hover:border-primary/30 transition-all group"
              >
                <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded">项目</span>
                <h3 className="text-base font-heading font-semibold mt-2 group-hover:text-primary-light transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-muted mt-2 line-clamp-2">{project.description}</p>
                {project.repoUrl && (
                  <div className="flex items-center gap-1 mt-3 text-xs text-muted">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    GitHub
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* About snippet */}
      <section className="glass-card p-8 text-center">
        <h2 className="text-xl font-heading font-semibold mb-3">关于邃思</h2>
        <p className="text-muted text-sm max-w-lg mx-auto leading-relaxed">
          邃思是一个关于深度思考与技术探索的个人知识花园。这里不追逐热点，只沉淀值得留下的内容。
        </p>
        <Link
          href="/about"
          className="inline-block mt-4 text-sm text-primary-light hover:underline"
        >
          了解更多 →
        </Link>
      </section>
    </div>
  );
}
