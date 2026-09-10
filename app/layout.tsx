import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/components/auth-context";
import GoogleSignInPrompt from "@/components/google-sign-in-prompt";
import Analytics from "@/components/analytics";
import { LocaleProvider } from "@/lib/i18n/context";
import { ThemeProvider, themeInitScript } from "@/lib/theme/context";

/** Hides public-site sections before first paint so the scroll-reveal has no
 *  flash of content. Home ("/") and reduced-motion are left untouched. See
 *  components/scroll-reveal.tsx and the `sr-on` rules in styles/globals.css. */
const revealInitScript = `try{var p=location.pathname;if(p!=="/"&&p.indexOf("/admin")!==0&&p.indexOf("/dashboard")!==0&&!matchMedia("(prefers-reduced-motion:reduce)").matches)document.documentElement.classList.add("sr-on")}catch(e){}`;

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: {
    default: "YEEP Somalia — Youth Engagement and Empowerment Platform",
    template: "%s | YEEP Somalia",
  },
  description:
    "YEEP Somalia is a registered, youth-led NGO empowering Somali youth to lead, innovate, and build peaceful, inclusive and resilient communities.",
  openGraph: {
    title: "YEEP Somalia",
    description:
      "A registered, youth-led NGO empowering Somali youth to lead, innovate, and build peaceful, inclusive and resilient communities.",
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
        <script dangerouslySetInnerHTML={{ __html: revealInitScript }} />
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
