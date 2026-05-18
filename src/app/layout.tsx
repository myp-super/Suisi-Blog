import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "邃思 — 深度思考，技术与人",
    template: "%s | 邃思",
  },
  description: "分享技术、项目与生活心得的个人知识花园。",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "邃思",
    title: "邃思 — 深度思考，技术与人",
    description: "分享技术、项目与生活心得的个人知识花园。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${playfairDisplay.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-screen flex flex-col bg-bg text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
