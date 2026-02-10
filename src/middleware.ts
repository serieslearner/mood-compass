import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/mood",
  "/journal",
  "/medications",
  "/insights",
  "/settings",
];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtected = protectedPaths.some(
    (path) =>
      req.nextUrl.pathname === path ||
      req.nextUrl.pathname.startsWith(`${path}/`)
  );

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/mood/:path*",
    "/journal/:path*",
    "/medications/:path*",
    "/insights/:path*",
    "/settings/:path*",
  ],
};
