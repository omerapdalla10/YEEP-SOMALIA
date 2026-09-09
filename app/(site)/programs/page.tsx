import type { Metadata } from "next";
import { appUrl } from "@/lib/env";
import ProgramsPage from "@/components/pages/programs-page";

const description =
  "Youth-led programmes in leadership, peacebuilding, civic engagement and community resilience across Somalia.";

export const metadata: Metadata = {
  title: "Programs",
  description,
  alternates: { canonical: `${appUrl}/programs` },
  openGraph: { title: "Programs — YEEP Somalia", description, url: `${appUrl}/programs` },
};

export default function Page() {
  return <ProgramsPage />;
}
