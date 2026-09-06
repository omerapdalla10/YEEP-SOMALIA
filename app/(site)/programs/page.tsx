import type { Metadata } from "next";
import ProgramsPage from "@/components/pages/programs-page";

export const metadata: Metadata = { title: "Programs" };

export default function Page() {
  return <ProgramsPage />;
}
