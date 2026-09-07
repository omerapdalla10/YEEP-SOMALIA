import { Suspense } from "react";
import type { Metadata } from "next";
import ResetPasswordPage from "@/components/pages/reset-password-page";

export const metadata: Metadata = { title: "Reset Password", robots: { index: false } };

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  );
}
