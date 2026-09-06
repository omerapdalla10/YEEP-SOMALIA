import type { Metadata } from "next";
import VolunteerPage from "@/components/pages/volunteer-page";

export const metadata: Metadata = { title: "Volunteer" };

export default function Page() {
  return <VolunteerPage />;
}
