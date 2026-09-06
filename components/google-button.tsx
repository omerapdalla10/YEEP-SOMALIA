"use client";

import { API_BASE_URL } from "@/lib/client/api";

const REDIRECT_KEY = "yeep_post_login_redirect";

/** Remember where to send the user once they finish signing in with Google. */
export function rememberPostLoginRedirect(path: string) {
  try {
    sessionStorage.setItem(REDIRECT_KEY, path);
  } catch {
    /* storage unavailable — fall back to the default landing route */
  }
}

/** Read and clear the remembered post-login destination. */
export function takePostLoginRedirect(): string | null {
  try {
    const value = sessionStorage.getItem(REDIRECT_KEY);
    sessionStorage.removeItem(REDIRECT_KEY);
    return value && value.startsWith("/") ? value : null;
  } catch {
    return null;
  }
}

/** URL that starts the server-side Google OAuth redirect flow. */
export function googleAuthUrl(): string {
  return `${API_BASE_URL}/auth/google`;
}

/** Google's four-colour "G" mark. */
export function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.94H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.06l3.01-2.34z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}

/**
 * "Continue with Google" — a full-page link (not a client route) to the API's
 * OAuth start endpoint. Pass `from` to return the user to a specific route
 * after sign-in.
 */
export default function GoogleButton({
  label = "Continue with Google",
  from,
  onClick,
  className = "",
}: {
  label?: string;
  from?: string | null;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <a
      href={googleAuthUrl()}
      onClick={() => {
        if (from) rememberPostLoginRedirect(from);
        onClick?.();
      }}
      className={
        "w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors " +
        className
      }
    >
      <GoogleIcon />
      {label}
    </a>
  );
}
