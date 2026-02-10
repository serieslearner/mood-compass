import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname === "/mood" ||
    req.nextUrl.pathname === "/journal" ||
    req.nextUrl.pathname === "/medications" ||
    req.nextUrl.pathname === "/insights" ||
    req.nextUrl.pathname === "/settings";

  if (isOnDashboard && !isLoggedIn) {
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
