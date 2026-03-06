import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from "@/lib/admin-auth";

export function middleware(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME);

  if (cookie?.value !== ADMIN_COOKIE_VALUE) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only protect /admin (not /admin/login)
  matcher: ["/admin"],
};
