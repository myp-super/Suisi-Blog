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
        if (credentials.password !== devPassword) return null;
        const { prisma } = await import("@/lib/prisma");
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
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
