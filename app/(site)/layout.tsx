import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import WhatsAppButton from "@/components/whatsapp-button";

/** Chrome for the public marketing site: fixed navbar + footer. The
 *  `site-root` class scopes the public dark theme (see styles/globals.css). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-root min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
