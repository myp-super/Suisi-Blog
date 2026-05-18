import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: "libsql://suisi-myp-super.aws-ap-northeast-1.turso.io",
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS User (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, image TEXT, role TEXT NOT NULL DEFAULT 'author', createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`;
  console.log("User ✓");
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS Post (id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, content TEXT NOT NULL, excerpt TEXT, coverImage TEXT, published BOOLEAN NOT NULL DEFAULT false, featured BOOLEAN NOT NULL DEFAULT false, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, authorId TEXT NOT NULL REFERENCES User(id))`;
  console.log("Post ✓");
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS Category (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE)`;
  console.log("Category ✓");
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS Tag (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE)`;
  console.log("Tag ✓");
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS PostCategory (postId TEXT NOT NULL REFERENCES Post(id) ON DELETE CASCADE, categoryId TEXT NOT NULL REFERENCES Category(id) ON DELETE CASCADE, PRIMARY KEY (postId, categoryId))`;
  console.log("PostCategory ✓");
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS PostTag (postId TEXT NOT NULL REFERENCES Post(id) ON DELETE CASCADE, tagId TEXT NOT NULL REFERENCES Tag(id) ON DELETE CASCADE, PRIMARY KEY (postId, tagId))`;
  console.log("PostTag ✓");
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS Comment (id TEXT PRIMARY KEY, authorName TEXT NOT NULL, content TEXT NOT NULL, approved BOOLEAN NOT NULL DEFAULT false, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, postId TEXT NOT NULL REFERENCES Post(id) ON DELETE CASCADE)`;
  console.log("Comment ✓");
  await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS Project (id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, description TEXT NOT NULL, content TEXT NOT NULL, demoUrl TEXT, repoUrl TEXT, coverImage TEXT, featured BOOLEAN NOT NULL DEFAULT false, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, postId TEXT UNIQUE REFERENCES Post(id) ON DELETE SET NULL)`;
  console.log("Project ✓");
  console.log("All tables created on Turso!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
