import type { Metadata } from "next";
import GalleryPage from "@/components/pages/gallery-page";

export const metadata: Metadata = { title: "Gallery" };

export default function Page() {
  return <GalleryPage />;
}
