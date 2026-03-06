/**
 * admin-auth.ts
 *
 * Simple shared-password auth for the /admin UI.
 * Password is stored in ADMIN_PASSWORD env var.
 */

export const ADMIN_COOKIE_NAME = "mysha-admin-auth";
export const ADMIN_COOKIE_VALUE = "authenticated";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24, // 24 hours
};

export function validateAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}
