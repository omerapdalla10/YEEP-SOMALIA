import type { Metadata } from "next";
import RegisterPage from "@/components/pages/register-page";

export const metadata: Metadata = { title: "Create Account" };

export default function Page() {
  return <RegisterPage />;
}
