import type { Metadata } from "next";
import { appUrl } from "@/lib/env";
import ContactPage from "@/components/pages/contact-page";

const description =
  "Get in touch with YEEP Somalia — questions, partnerships, media enquiries and volunteering.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: `${appUrl}/contact` },
  openGraph: { title: "Contact — YEEP Somalia", description, url: `${appUrl}/contact` },
};

export default function Page() {
  return <ContactPage />;
}
