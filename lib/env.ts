/**
 * Server-only environment access. Every value here is read from `process.env`
 * at call time (never bundled for the browser) and validated on first use so a
 * missing secret fails loudly instead of producing broken tokens.
 */

export const isProd = process.env.NODE_ENV === "production";

function required(name: string, devFallback?: string): string {
  const value = process.env[name];
  if (value && value.length > 0) return value;
  if (!isProd && devFallback !== undefined) return devFallback;
  throw new Error(`Missing required environment variable: ${name}`);
}

/** Public origin of the app, e.g. "http://localhost:3000". No trailing slash. */
export const appUrl = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const jwt = {
  get secret() {
    return required("JWT_SECRET", "dev-only-insecure-secret-change-me");
  },
  expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
};

export const google = {
  get clientId() {
    return required("GOOGLE_CLIENT_ID");
  },
  get clientSecret() {
    return required("GOOGLE_CLIENT_SECRET");
  },
  callbackUrl: process.env.GOOGLE_CALLBACK_URL ?? `${appUrl}/api/auth/google/callback`,
};

/** Where the browser lands after a successful Google sign-in. */
export const oauthSuccessRedirect = process.env.OAUTH_SUCCESS_REDIRECT ?? `${appUrl}/auth/callback`;

/** True only when both Google OAuth credentials are configured. */
export const googleOAuthEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

/** Name of the httpOnly cookie holding the session JWT. */
export const AUTH_COOKIE = "yeep_token";

export const smtp = {
  host: process.env.SMTP_HOST ?? "",
  port: Number(process.env.SMTP_PORT ?? 587),
  /** true for port 465 (implicit TLS); false uses STARTTLS. */
  secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
  user: process.env.SMTP_USER ?? "",
  pass: process.env.SMTP_PASS ?? "",
  /** RFC-5322 From header, e.g. `YEEP Somalia <noreply@yeep.org.so>`. */
  from: process.env.SMTP_FROM || "YEEP Somalia <no-reply@yeep.org.so>",
};

/** True only when the SMTP transport has the host + credentials it needs. */
export const emailEnabled = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
);
