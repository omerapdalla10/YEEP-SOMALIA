import type { NextRequest, NextResponse } from "next/server";
import { User, type UserDocument } from "@/models/User";
import { roleAtLeast, type Role } from "@/lib/roles";
import { AUTH_COOKIE, isProd, jwt as jwtConfig } from "@/lib/env";
import { ApiError } from "./errors";
import { verifyToken } from "./token";

/** JWT lifetime in seconds, parsed from `JWT_EXPIRES_IN` (`"7d"`, `"3600"`, …). */
function cookieMaxAge(): number {
  const raw = jwtConfig.expiresIn;
  const m = /^(\d+)\s*([smhd])?$/.exec(raw.trim());
  if (!m) return 7 * 24 * 60 * 60;
  const n = Number(m[1]);
  const unit = m[2] ?? "s";
  const mult = { s: 1, m: 60, h: 3600, d: 86400 }[unit] ?? 1;
  return n * mult;
}

function extractToken(req: NextRequest): string | null {
  const cookie = req.cookies.get(AUTH_COOKIE)?.value;
  if (cookie) return cookie;
  const header = req.headers.get("authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7).trim() || null;
  return null;
}

/**
 * Resolve the signed-in user from the session cookie or `Authorization` header.
 * Returns `null` for anonymous requests. Throws `403` when the account exists
 * but has been disabled.
 */
export async function getSessionUser(req: NextRequest): Promise<UserDocument | null> {
  const token = extractToken(req);
  if (!token) return null;

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return null;
  }

  const user = await User.findById(payload.sub);
  if (!user) return null;
  if (!user.isActive) {
    throw ApiError.forbidden("Your account has been disabled. Please contact an administrator.");
  }
  return user;
}

/** Like {@link getSessionUser} but never throws — used for optionally-auth routes. */
export async function optionalUser(req: NextRequest): Promise<UserDocument | null> {
  try {
    return await getSessionUser(req);
  } catch {
    return null;
  }
}

/** Require a signed-in user or throw `401`. */
export async function requireUser(req: NextRequest): Promise<UserDocument> {
  const user = await getSessionUser(req);
  if (!user) throw ApiError.unauthorized("Please sign in to continue.");
  return user;
}

/**
 * Require a signed-in user whose role is at least `minRole`. Ranks are
 * inherited, so `requireRole(req, "staff")` also admits an admin.
 */
export async function requireRole(req: NextRequest, minRole: Role): Promise<UserDocument> {
  const user = await requireUser(req);
  if (!roleAtLeast(user.role, minRole)) {
    throw ApiError.forbidden("You don't have permission to do that.");
  }
  return user;
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: isProd,
  path: "/",
} as const;

/** Attach the session JWT to a response as an httpOnly cookie. */
export function setAuthCookie(res: NextResponse, token: string): void {
  res.cookies.set(AUTH_COOKIE, token, {
    ...cookieOptions,
    maxAge: cookieMaxAge(),
  });
}

/** Clear the session cookie (sign-out). */
export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set(AUTH_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}
