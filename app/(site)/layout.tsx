import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import WhatsAppButton from "@/components/whatsapp-button";
import ScrollToTop from "@/components/scroll-to-top";
import ScrollReveal from "@/components/scroll-reveal";

/** Chrome for the public marketing site: fixed navbar + footer. The
 *  `site-root` class scopes the public dark theme (see styles/globals.css).
 *  The pre-paint script that hides sections for the scroll-reveal lives in the
 *  root layout (app/layout.tsx). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-root min-h-screen flex flex-col">
      <ScrollToTop />
      <ScrollReveal />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
