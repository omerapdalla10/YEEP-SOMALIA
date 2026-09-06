import { Inter, Manrope } from "next/font/google";
import "@/styles/admin.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

/** Loads the shared console design system + typefaces for the member
 *  dashboard; the dashboard itself lives in the `.adm` root rendered by
 *  the page. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${inter.variable} ${manrope.variable}`}>{children}</div>;
}
