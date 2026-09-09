import type { Metadata } from "next";
import { appUrl } from "@/lib/env";
import GalleryPage from "@/components/pages/gallery-page";

const description =
  "Photos and video from the training, dialogues and milestones of YEEP Somalia's community.";

export const metadata: Metadata = {
  title: "Gallery",
  description,
  alternates: { canonical: `${appUrl}/gallery` },
  openGraph: { title: "Gallery — YEEP Somalia", description, url: `${appUrl}/gallery` },
};

export default function Page() {
  return <GalleryPage />;
}
