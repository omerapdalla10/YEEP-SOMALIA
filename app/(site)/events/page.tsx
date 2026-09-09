import type { Metadata } from "next";
import { appUrl } from "@/lib/env";
import EventsPage from "@/components/pages/events-page";

const description =
  "Forums, workshops, dialogues and roundtables — upcoming and past events from YEEP Somalia.";

export const metadata: Metadata = {
  title: "Events",
  description,
  alternates: { canonical: `${appUrl}/events` },
  openGraph: { title: "Events — YEEP Somalia", description, url: `${appUrl}/events` },
};

export default function Page() {
  return <EventsPage />;
}
