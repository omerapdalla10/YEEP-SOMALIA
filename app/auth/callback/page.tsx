import { Suspense } from "react";
import type { Metadata } from "next";
import AuthCallbackPage from "@/components/pages/auth-callback-page";

export const metadata: Metadata = { title: "Signing in…", robots: { index: false } };

export default function Page() {
  return (
    <Suspense>
      <AuthCallbackPage />
    </Suspense>
  );
}
