import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import "./auth-types";
import { prisma } from "@/lib/prisma";

const hasSmtp = !!process.env.EMAIL_SERVER_HOST;

const emailProvider = hasSmtp
  ? [
      Email({
        server: {
          host: process.env.EMAIL_SERVER_HOST!,
          port: Number(process.env.EMAIL_SERVER_PORT),
          auth: {
            user: process.env.EMAIL_SERVER_USER!,
            pass: process.env.EMAIL_SERVER_PASSWORD!,
          },
        },
        from: process.env.AUTH_EMAIL_FROM!,
      }),
    ]
  : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        const devPassword = process.env.DEV_PASSWORD || "suisi2024";
        console.log("[auth] DEV_PASSWORD exists:", !!process.env.DEV_PASSWORD);
        console.log("[auth] password match:", credentials.password === devPassword);
        if (credentials.password !== devPassword) return null;
        try {
          const { prisma } = await import("@/lib/prisma");
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });
          console.log("[auth] user found:", !!user, user?.role);
          if (!user) return null;
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        } catch (e) {
          console.error("[auth] DB error:", (e as Error).message);
          return null;
        }
      },
    }),
    ...emailProvider,
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "author";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
