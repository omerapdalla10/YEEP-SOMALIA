import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

/** Chrome for the public marketing site: fixed navbar + footer. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
