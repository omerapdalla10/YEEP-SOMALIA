import type { Metadata } from "next";
import NewsPage from "@/components/pages/news-page";

export const metadata: Metadata = { title: "News & Stories" };

export default function Page() {
  return <NewsPage />;
}
