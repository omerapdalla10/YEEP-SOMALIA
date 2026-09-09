import type { Metadata } from "next";
import { appUrl } from "@/lib/env";
import AboutPage from "@/components/pages/about-page";

const description =
  "YEEP Somalia is a youth-led NGO in Mogadishu strengthening youth leadership in peacebuilding and preventing violent extremism across Somalia.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: `${appUrl}/about` },
  openGraph: {
    title: "About YEEP Somalia",
    description,
    url: `${appUrl}/about`,
    type: "website",
    images: [{ url: `${appUrl}/hero.jpg`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "About YEEP Somalia", description },
};

export default function Page() {
  return <AboutPage />;
}
