import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.comment.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.postCategory.deleteMany();
  await prisma.project.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: "邃思作者",
      email: "admin@example.com",
      role: "admin",
    },
  });

  // Create categories
  const cats = await Promise.all([
    prisma.category.create({ data: { name: "技术", slug: "tech" } }),
    prisma.category.create({ data: { name: "生活", slug: "life" } }),
    prisma.category.create({ data: { name: "项目", slug: "projects" } }),
    prisma.category.create({ data: { name: "随笔", slug: "essays" } }),
  ]);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "TypeScript" } }),
    prisma.tag.create({ data: { name: "React" } }),
    prisma.tag.create({ data: { name: "Next.js" } }),
    prisma.tag.create({ data: { name: "Rust" } }),
    prisma.tag.create({ data: { name: "AI" } }),
    prisma.tag.create({ data: { name: "读书" } }),
    prisma.tag.create({ data: { name: "摄影" } }),
    prisma.tag.create({ data: { name: "开源" } }),
  ]);

  // Sample posts
  const post1 = await prisma.post.create({
    data: {
      title: "欢迎来到邃思",
      slug: "welcome-to-suisithink",
      excerpt: "这是一篇欢迎文章，介绍邃思这个知识花园的缘起和愿景。",
      content: `## 你好，世界

欢迎来到 **邃思** — 我的个人知识花园。

这里是我分享技术探索、项目实践与生活心得的地方。

### 关于我

我是一名热爱技术的开发者和终身学习者。邃思这个名字，取意"深远的思考"，我希望它不止是一个博客，更是一个让思想沉淀和生长的空间。

### 在这里你会看到

- **技术文章**：深入探讨前端、后端、系统设计等领域
- **项目展示**：我参与或独立完成的各类项目
- **读书笔记**：读书过程中的思考与摘录
- **生活随笔**：技术之外的观察与感悟

### 为什么是现在

在快节奏的信息时代，我们每天消费着大量的碎片化内容。我越来越觉得，需要有一片属于自己的、安静的思考空间。邃思就是这样一次尝试。

> 学而不思则罔，思而不学则殆。—— 孔子

期待与你分享更多。`,
      published: true,
      featured: true,
      authorId: admin.id,
      categories: {
        create: [{ categoryId: cats[3].id }],
      },
      tags: {
        create: [{ tagId: tags[5].id }],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "用 Next.js 与 Prisma 构建全栈博客",
      slug: "building-fullstack-blog-nextjs-prisma",
      excerpt: "从零开始，使用 Next.js 14 App Router、Prisma ORM 和 PostgreSQL 构建一个完整的博客平台。",
      content: `## 引言

Next.js 已经成为构建现代 Web 应用的首选框架之一。配合 Prisma 这个类型安全的 ORM，我们可以快速搭建一个功能完善的全栈博客。

### 技术栈概览

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14+ (App Router) |
| 样式 | Tailwind CSS |
| ORM | Prisma |
| 数据库 | PostgreSQL |
| 认证 | NextAuth.js v5 |
| 内容 | MDX |

### 数据库设计

\`\`\`prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
\`\`\`

### 关键点

1. **App Router** 提供了更直观的路由组织方式
2. **Server Components** 默认在服务端渲染，减少客户端 JS
3. **Prisma** 的自动迁移让数据库变更安全可控

\`\`\`typescript
// API route example
export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(posts);
}
\`\`\`

希望这篇文章对你有帮助！`,
      published: true,
      featured: true,
      authorId: admin.id,
      categories: {
        create: [{ categoryId: cats[0].id }],
      },
      tags: {
        create: [{ tagId: tags[0].id }, { tagId: tags[2].id }],
      },
    },
  });

  // Related project
  await prisma.project.create({
    data: {
      title: "邃思博客平台",
      slug: "suisithink-blog",
      description: "一个使用 Next.js + Prisma + PostgreSQL 构建的全栈博客平台，支持 MDX 内容、深色主题、评论系统。",
      content: `## 邃思博客平台

### 技术栈
- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **ORM**: Prisma
- **数据库**: PostgreSQL
- **认证**: NextAuth.js v5
- **内容**: MDX

### 特性
- 深色主题 (OLED优化)
- MDX 内容渲染 + 代码高亮
- 访客评论系统 (带审核)
- 分类与标签系统
- 管理后台
- 响应式布局

### 待办
- [ ] RSS 订阅
- [ ] 邮件订阅
- [ ] 多语言支持`,
      demoUrl: "https://suisithink.vercel.app",
      repoUrl: "https://github.com/example/suisithink",
      featured: true,
      postId: post1.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: "Rust 学习笔记：所有权与借用",
      slug: "rust-ownership-borrowing-notes",
      excerpt: "Rust 最核心的概念之一：所有权系统。理解它，就理解了 Rust 的一半。",
      content: `## 所有权规则

Rust 的所有权系统有三条基本规则：

1. Rust 中每一个值都有一个被称为其 **所有者**（owner）的变量
2. 值在任一时刻有且只有一个所有者
3. 当所有者离开作用域，这个值将被丢弃

### 示例

\`\`\`rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 的所有权被移动到 s2

    // println!("{}", s1); // 编译错误！s1 已失效

    let s3 = s2.clone(); // 深拷贝
    println!("s2 = {}, s3 = {}", s2, s3);
}
\`\`\`

### 引用与借用

\`\`\`rust
fn calculate_length(s: &String) -> usize {
    s.len()
}

fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1); // 不可变引用（借用）
    println!("The length of '{}' is {}.", s1, len);
}
\`\`\`

> Rust 的所有权模型让你在编译期就能捕获内存错误，这正是它与 Go/C++ 等语言最大的不同。`,
      published: true,
      authorId: admin.id,
      categories: {
        create: [{ categoryId: cats[0].id }],
      },
      tags: {
        create: [{ tagId: tags[3].id }],
      },
    },
  });

  console.log("Seed completed!");
  console.log(`  Admin email: admin@example.com`);
  console.log(`  Posts: 3`);
  console.log(`  Categories: ${cats.length}`);
  console.log(`  Tags: ${tags.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
