import type { Metadata } from "next";
import ForgotPasswordPage from "@/components/pages/forgot-password-page";

export const metadata: Metadata = { title: "Forgot Password", robots: { index: false } };

export default function Page() {
  return <ForgotPasswordPage />;
}
