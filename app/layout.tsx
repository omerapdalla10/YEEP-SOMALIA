import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/components/auth-context";
import GoogleSignInPrompt from "@/components/google-sign-in-prompt";
import Analytics from "@/components/analytics";
import { LocaleProvider } from "@/lib/i18n/context";
import { ThemeProvider, themeInitScript } from "@/lib/theme/context";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: {
    default: "YEEP Somalia — Youth Engagement and Empowerment Programme",
    template: "%s | YEEP Somalia",
  },
  description:
    "YEEP Somalia is a youth-led NGO in Mogadishu advancing Youth, Peace and Security (YPS), youth leadership, civic engagement, and community resilience across Somalia.",
  openGraph: {
    title: "YEEP Somalia",
    description:
      "A youth-led NGO advancing Youth, Peace and Security, leadership, and community resilience across Somalia.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the theme script below toggles `.dark` on
    // <html> before React hydrates; also covers <body> attributes injected
    // by browser extensions (ColorZilla, Grammarly, …).
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white text-[#1f2937]" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <LocaleProvider>
            <AuthProvider>
              <GoogleSignInPrompt />
              {children}
            </AuthProvider>
          </LocaleProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
