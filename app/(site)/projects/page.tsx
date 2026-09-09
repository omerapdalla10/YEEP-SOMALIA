import type { Metadata } from "next";
import { appUrl } from "@/lib/env";
import ProjectsPage from "@/components/pages/projects-page";

const description =
  "From leadership academies to community dialogues — the projects delivering YEEP Somalia's mission on the ground.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: `${appUrl}/projects` },
  openGraph: { title: "Projects — YEEP Somalia", description, url: `${appUrl}/projects` },
};

export default function Page() {
  return <ProjectsPage />;
}
