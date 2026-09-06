import { Suspense } from "react";
import type { Metadata } from "next";
import LoginPage from "@/components/pages/login-page";

export const metadata: Metadata = { title: "Sign In" };

export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
