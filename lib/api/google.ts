import { google } from "@/lib/env";

/** httpOnly cookie holding the signed OAuth `state` token between start + callback. */
export const OAUTH_STATE_COOKIE = "yeep_oauth_state";
export const OAUTH_STATE_COOKIE_PATH = "/api/auth";

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const USERINFO_ENDPOINT = "https://openidconnect.googleapis.com/v1/userinfo";

export interface GoogleProfile {
  /** Google's stable account id (`sub` claim). */
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string;
  picture?: string;
}

/** Build the Google consent-screen URL the browser is redirected to. */
export function buildAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: google.clientId,
    redirect_uri: google.callbackUrl,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  });
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

/** Exchange the one-time `code` from the callback for a Google access token. */
export async function exchangeCode(code: string): Promise<string> {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: google.clientId,
      client_secret: google.clientSecret,
      redirect_uri: google.callbackUrl,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error(`Google token exchange failed (${res.status})`);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) {
    throw new Error("Google token exchange returned no access token");
  }
  return json.access_token;
}

/** Fetch the signed-in user's profile from Google's OpenID userinfo endpoint. */
export async function fetchProfile(accessToken: string): Promise<GoogleProfile> {
  const res = await fetch(USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Google userinfo request failed (${res.status})`);
  const json = (await res.json()) as {
    sub: string;
    email: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
  };
  return {
    sub: json.sub,
    email: json.email,
    emailVerified: Boolean(json.email_verified),
    name: json.name?.trim() || json.email.split("@")[0],
    picture: json.picture,
  };
}
