import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug 只能包含小写字母、数字和连字符"),
  content: z.string().min(1, "内容不能为空"),
  excerpt: z.string().max(500).optional().nullable(),
  coverImage: z.string().optional().nullable(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
});

export const projectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1).max(500),
  content: z.string().min(1),
  demoUrl: z.string().url().optional().nullable().or(z.literal("")),
  repoUrl: z.string().url().optional().nullable().or(z.literal("")),
  coverImage: z.string().optional().nullable(),
  featured: z.boolean().default(false),
});

export const categorySchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
});

export const tagSchema = z.object({
  name: z.string().min(1).max(50),
});

export const commentSchema = z.object({
  postSlug: z.string().min(1),
  authorName: z.string().min(1, "请输入昵称").max(50),
  content: z.string().min(1, "请输入评论内容").max(2000),
});
