import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { markdownToHtml } from "@/lib/markdown";
import CommentSection from "@/components/ui/CommentSection";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug, published: true }, select: { title: true, excerpt: true, coverImage: true } });
  if (!post) return { title: "文章未找到" };
  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: post.coverImage ? { images: [post.coverImage] } : undefined,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, image: true } },
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      comments: { where: { approved: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!post || (!post.published)) notFound();

  // Get prev/next posts
  const [prevPost, nextPost] = await Promise.all([
    prisma.post.findFirst({
      where: { published: true, createdAt: { lt: post.createdAt } },
      orderBy: { createdAt: "desc" },
      select: { slug: true, title: true },
    }),
    prisma.post.findFirst({
      where: { published: true, createdAt: { gt: post.createdAt } },
      orderBy: { createdAt: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.categories.map((pc) => (
            <Link
              key={pc.categoryId}
              href={`/categories/${pc.category.slug}`}
              className="text-xs font-medium text-primary-light bg-primary/10 px-2.5 py-0.5 rounded-full hover:bg-primary/20 transition-colors"
            >
              {pc.category.name}
            </Link>
          ))}
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold leading-tight glow-text">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-lg text-muted leading-relaxed">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-4 mt-6 text-sm text-muted">
          <span>{post.author.name}</span>
          <span>·</span>
          <time dateTime={post.createdAt.toISOString()}>
            {new Date(post.createdAt).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.updatedAt > post.createdAt && (
            <>
              <span>·</span>
              <span>更新于 {new Date(post.updatedAt).toLocaleDateString("zh-CN")}</span>
            </>
          )}
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((pt) => (
              <Link
                key={pt.tagId}
                href={`/tags/${pt.tag.name}`}
                className="text-xs text-muted hover:text-primary-light transition-colors"
              >
                #{pt.tag.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Cover image */}
      {post.coverImage && (
        <div className="relative w-full aspect-video mb-10 rounded-xl overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: await markdownToHtml(post.content) }}
      />

      {/* Prev/Next navigation */}
      <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16 pt-8 border-t border-border">
        {prevPost ? (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="glass-card p-4 hover:border-primary/30 transition-all group"
          >
            <span className="text-xs text-muted">← 上一篇</span>
            <p className="text-sm font-medium mt-1 group-hover:text-primary-light transition-colors line-clamp-1">
              {prevPost.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="glass-card p-4 hover:border-primary/30 transition-all group text-right"
          >
            <span className="text-xs text-muted">下一篇 →</span>
            <p className="text-sm font-medium mt-1 group-hover:text-primary-light transition-colors line-clamp-1">
              {nextPost.title}
            </p>
          </Link>
        ) : (
          <div />
        )}
      </nav>

      {/* Comments */}
      <section className="mt-12 pt-8 border-t border-border">
        <CommentSection postSlug={post.slug} />
      </section>
    </article>
  );
}
