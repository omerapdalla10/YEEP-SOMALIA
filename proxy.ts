import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/env";
import { verifyToken } from "@/lib/api/token";

/**
 * Page-level route protection. Runs before the matched page renders (Node
 * runtime) and bounces signed-out visitors to `/login`. This is a coarse gate:
 * role checks and any data authorisation still happen in the page/Route Handler
 * itself — never rely on the proxy alone (see Next.js "Data Security" guide).
 */

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  if (!isProtected(pathname)) return NextResponse.next();

  const token = request.cookies.get(AUTH_COOKIE)?.value;

  let valid = false;
  if (token) {
    try {
      verifyToken(token);
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (valid) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  const res = NextResponse.redirect(loginUrl);
  // Drop a stale/invalid cookie so the client isn't stuck in a redirect loop.
  if (token) res.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
