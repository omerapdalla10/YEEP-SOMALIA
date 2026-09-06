import jwt from "jsonwebtoken";
import { NextResponse, type NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { signToken } from "@/lib/api/token";
import { setAuthCookie } from "@/lib/api/auth";
import {
  exchangeCode,
  fetchProfile,
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_COOKIE_PATH,
  type GoogleProfile,
} from "@/lib/api/google";
import { appUrl, jwt as jwtConfig, oauthSuccessRedirect } from "@/lib/env";
import { User } from "@/models/User";

/**
 * GET /api/auth/google/callback — Google redirects here with `code` + `state`.
 * On success the browser is bounced to the frontend with a JWT in the URL hash
 * (and an httpOnly session cookie); on any failure it lands on `/login` with a
 * readable `?error=` message.
 */
export const GET = route(async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;

  const bounce = (reason: string) => {
    const url = new URL("/login", appUrl);
    url.searchParams.set("error", reason);
    const res = NextResponse.redirect(url);
    res.cookies.set(OAUTH_STATE_COOKIE, "", {
      path: OAUTH_STATE_COOKIE_PATH,
      maxAge: 0,
    });
    return res;
  };

  if (params.get("error")) return bounce("Google sign-in was cancelled.");

  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state) return bounce("Google sign-in failed. Please try again.");

  const cookieState = req.cookies.get(OAUTH_STATE_COOKIE)?.value;
  if (!cookieState || cookieState !== state) {
    return bounce("Your sign-in session expired. Please try again.");
  }
  try {
    jwt.verify(state, jwtConfig.secret);
  } catch {
    return bounce("Your sign-in session expired. Please try again.");
  }

  let profile: GoogleProfile;
  try {
    const accessToken = await exchangeCode(code);
    profile = await fetchProfile(accessToken);
  } catch (err) {
    console.error("[auth] google oauth error:", err);
    return bounce("Could not complete Google sign-in. Please try again.");
  }

  if (!profile.email) {
    return bounce("Your Google account did not share an email address.");
  }

  let user = await User.findOne({
    $or: [{ googleId: profile.sub }, { email: profile.email }],
  });

  if (!user) {
    user = await User.create({
      name: profile.name,
      email: profile.email,
      googleId: profile.sub,
      authProvider: "google",
      avatar: profile.picture,
    });
  } else if (!user.googleId) {
    // Existing local account with the same email — link it to Google.
    user.googleId = profile.sub;
    if (!user.avatar && profile.picture) user.avatar = profile.picture;
    await user.save();
  }

  if (!user.isActive) {
    return bounce("Your account has been disabled. Please contact an administrator.");
  }

  const token = signToken({ sub: user.id, role: user.role });

  const target = new URL(oauthSuccessRedirect);
  target.hash = `token=${encodeURIComponent(token)}`;
  const res = NextResponse.redirect(target);
  res.cookies.set(OAUTH_STATE_COOKIE, "", {
    path: OAUTH_STATE_COOKIE_PATH,
    maxAge: 0,
  });
  setAuthCookie(res, token);
  return res;
});
