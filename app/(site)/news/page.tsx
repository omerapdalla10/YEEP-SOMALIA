import type { Metadata } from "next";
import { appUrl } from "@/lib/env";
import NewsPage from "@/components/pages/news-page";

const description =
  "Impact stories, programme updates, partnership announcements and the voices of the YEEP Somalia community.";

export const metadata: Metadata = {
  title: "News & Stories",
  description,
  alternates: {
    canonical: `${appUrl}/news`,
    types: { "application/rss+xml": `${appUrl}/news/rss.xml` },
  },
  openGraph: { title: "News & Stories — YEEP Somalia", description, url: `${appUrl}/news` },
};

export default function Page() {
  return <NewsPage />;
}
