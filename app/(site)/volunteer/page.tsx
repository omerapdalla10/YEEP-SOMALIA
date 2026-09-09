import type { Metadata } from "next";
import { appUrl } from "@/lib/env";
import VolunteerPage from "@/components/pages/volunteer-page";

const description =
  "Join a network of young Somali volunteers giving their time and skills to peacebuilding and youth leadership.";

export const metadata: Metadata = {
  title: "Volunteer",
  description,
  alternates: { canonical: `${appUrl}/volunteer` },
  openGraph: { title: "Volunteer — YEEP Somalia", description, url: `${appUrl}/volunteer` },
};

export default function Page() {
  return <VolunteerPage />;
}
