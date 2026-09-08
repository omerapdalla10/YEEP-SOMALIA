import { Suspense } from "react";
import type { Metadata } from "next";
import VerifyEmailPage from "@/components/pages/verify-email-page";

export const metadata: Metadata = { title: "Confirm your email", robots: { index: false } };

export default function Page() {
  return (
    <Suspense>
      <VerifyEmailPage />
    </Suspense>
  );
}
