import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { route } from "@/lib/api/route";
import { ApiError } from "@/lib/api/errors";
import { buildAuthUrl, OAUTH_STATE_COOKIE, OAUTH_STATE_COOKIE_PATH } from "@/lib/api/google";
import { googleOAuthEnabled, isProd, jwt as jwtConfig } from "@/lib/env";

/**
 * GET /api/auth/google — starts the redirect flow. Signs a short-lived state
 * token, drops it in an httpOnly cookie, and sends the browser to Google's
 * consent screen.
 */
export const GET = route(async () => {
  if (!googleOAuthEnabled) {
    throw ApiError.badRequest("Google sign-in is not configured on this server.");
  }

  const state = jwt.sign({ purpose: "google-oauth", nonce: randomUUID() }, jwtConfig.secret, {
    expiresIn: "10m",
  });

  const res = NextResponse.redirect(buildAuthUrl(state));
  res.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: 10 * 60,
    path: OAUTH_STATE_COOKIE_PATH,
  });
  return res;
});
