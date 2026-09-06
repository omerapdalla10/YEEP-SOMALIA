"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/auth-context";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Our Work",
    children: [
      { label: "Programs", href: "/programs" },
      { label: "Projects", href: "/projects" },
      { label: "Events", href: "/events" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "News", href: "/news" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { user } = useAuth();
  const dashboardHref = user && user.role !== "volunteer" ? "/admin" : "/dashboard";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    // Close any open menu/dropdown when the route changes.
    /* eslint-disable react-hooks/set-state-in-effect */
    setOpen(false);
    setDropdown(null);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.svg"
              alt="YEEP Somalia"
              width={40}
              height={40}
              priority
              unoptimized
              className="w-10 h-10 object-contain"
            />
            <div>
              <div className="font-bold text-xl text-[#2D8FCE] leading-none">YEEP SOMALIA</div>
              <div className="text-[10px] text-gray-500 leading-none tracking-wide">
                Engage · Empower · Transform
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdown(link.label)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1F6BA0] transition-colors rounded-lg hover:bg-[#D4E6F4]">
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${dropdown === link.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {dropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#1F6BA0] hover:bg-[#D4E6F4] transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === link.href
                      ? "text-[#1F6BA0] bg-[#D4E6F4]"
                      : "text-gray-700 hover:text-[#1F6BA0] hover:bg-[#D4E6F4]"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          {/* CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#2D8FCE] hover:bg-[#1F6BA0] rounded-xl transition-colors"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-[#2D8FCE] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-[#1F6BA0] hover:bg-[#D4E6F4] transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {link.label}
                </div>
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block px-3 py-2 text-sm text-gray-700 hover:text-[#1F6BA0] hover:bg-[#D4E6F4] rounded-lg transition-colors ml-2"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href!}
                className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  pathname === link.href
                    ? "text-[#1F6BA0] bg-[#D4E6F4]"
                    : "text-gray-700 hover:text-[#1F6BA0] hover:bg-[#D4E6F4]"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
          <div className="pt-3 border-t border-gray-100">
            {user ? (
              <Link
                href={dashboardHref}
                className="block text-center py-2 text-sm font-semibold text-white bg-[#2D8FCE] rounded-xl hover:bg-[#1F6BA0] transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="block text-center py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:border-[#2D8FCE] hover:text-[#2D8FCE] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
