import type { Metadata } from "next";
import AboutPage from "@/components/pages/about-page";

export const metadata: Metadata = { title: "About" };

export default function Page() {
  return <AboutPage />;
}
