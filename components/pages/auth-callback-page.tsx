"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { takePostLoginRedirect } from "@/components/google-button";

const SIGN_IN_FAILED = "/login?error=" + encodeURIComponent("Sign-in failed. Please try again.");

/** Read a param from the URL hash first (where the API puts the token), then the query string. */
function readParam(key: string): string | null {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return hash.get(key) ?? new URLSearchParams(window.location.search).get(key);
}

/**
 * Landing route for the Google OAuth redirect flow (`/auth/callback`).
 * The API redirects here with `#token=<jwt>` on success, or `?error=<message>`
 * on failure. We store the token, load the profile, and forward the user on.
 */
export default function AuthCallbackPage() {
  const { loginWithToken } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("Signing you in…");
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = readParam("token");
    const error = readParam("error");
    // Drop the token from the address bar / history straight away.
    window.history.replaceState(null, "", "/auth/callback");

    if (error) {
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }
    if (!token) {
      router.replace(SIGN_IN_FAILED);
      return;
    }

    loginWithToken(token)
      .then((user) => {
        const dest =
          takePostLoginRedirect() ?? (user.role !== "volunteer" ? "/admin" : "/dashboard");
        router.replace(dest);
      })
      .catch(() => {
        setMessage("We could not complete your sign-in. Redirecting…");
        setTimeout(() => router.replace(SIGN_IN_FAILED), 1500);
      });
  }, [loginWithToken, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f8fafc] px-6 text-center">
      <Loader2 size={28} className="animate-spin text-[#0f766e]" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
