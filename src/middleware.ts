import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("authjs.session-token") || req.cookies.get("__Secure-authjs.session-token");
  const isAdmin = req.nextUrl.pathname.startsWith("/admin");
  const isLogin = req.nextUrl.pathname === "/admin/login";

  if (isAdmin && !isLogin && !token) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLogin && token) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
