"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, Search } from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { useT } from "@/lib/i18n/context";
import LanguageToggle from "@/components/language-toggle";
import ThemeToggle from "@/components/theme-toggle";
import SearchModal from "@/components/search-modal";
import { img } from "@/lib/client/img";
import { roleLabel } from "@/lib/roles";

function initials(name?: string): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Avatar image with an initials fallback if the src is missing or fails. */
function Avatar({ src, name, size }: { src?: string; name?: string; size: number }) {
  const [broken, setBroken] = useState(false);
  const fallback = (
    <span
      className="rounded-lg bg-[#2D8FCE] text-white font-semibold flex items-center justify-center shrink-0"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {initials(name)}
    </span>
  );
  if (!src || broken) return fallback;
  return (
    <img
      src={img(src, "w=96&h=96&fit=crop&auto=format")}
      alt=""
      referrerPolicy="no-referrer"
      onError={() => setBroken(true)}
      className="rounded-lg object-cover bg-[#D4E6F4] shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

const navLinks = [
  { key: "nav.about", href: "/about" },
  {
    key: "nav.ourWork",
    children: [
      { key: "nav.programs", href: "/programs" },
      { key: "nav.projects", href: "/projects" },
      { key: "nav.events", href: "/events" },
    ],
  },
  { key: "nav.gallery", href: "/gallery" },
  { key: "nav.news", href: "/news" },
  { key: "nav.volunteer", href: "/volunteer" },
  { key: "nav.contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const t = useT();
  const isStaff = Boolean(user && user.role !== "volunteer");
  const dashboardHref = isStaff ? "/admin" : "/dashboard";
  const dashboardLabel = isStaff ? t("nav.adminConsole") : t("nav.myDashboard");

  const handleLogout = () => {
    setAccountOpen(false);
    setOpen(false);
    logout();
    router.push("/");
  };

  // Jump to top even when the link points at the page we're already on.
  const scrollTop = () => window.scrollTo(0, 0);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    // Close any open menu/dropdown when the route changes.
    /* eslint-disable react-hooks/set-state-in-effect */
    setOpen(false);
    setDropdown(null);
    setAccountOpen(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-white border-gray-200 dark:bg-[#141d1a] dark:border-[#26332f]"
          : "bg-white/95 backdrop-blur-sm border-transparent dark:bg-[#141d1a]/92 dark:border-[#20302b]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" onClick={scrollTop} className="flex items-center gap-2.5 group">
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
                <div key={link.key} className="relative">
                  <button
                    onClick={() => setDropdown((d) => (d === link.key ? null : link.key))}
                    aria-expanded={dropdown === link.key}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1F6BA0] transition-colors rounded-lg hover:bg-[#D4E6F4]"
                  >
                    {t(link.key)}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${dropdown === link.key ? "rotate-180" : ""}`}
                    />
                  </button>
                  {dropdown === link.key && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setDropdown(null)} />
                      <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-lg border border-gray-200 shadow-sm py-1 overflow-hidden z-50">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => {
                              setDropdown(null);
                              scrollTop();
                            }}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#1F6BA0] hover:bg-[#D4E6F4] transition-colors"
                          >
                            {t(child.key)}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  onClick={scrollTop}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === link.href
                      ? "text-[#1F6BA0] bg-[#D4E6F4]"
                      : "text-gray-700 hover:text-[#1F6BA0] hover:bg-[#D4E6F4]"
                  }`}
                >
                  {t(link.key)}
                </Link>
              ),
            )}
          </nav>

          {/* CTA buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label={t("nav.search")}
              className="h-8 flex items-center gap-2 rounded-lg border border-gray-200 px-2.5 text-xs text-gray-400 hover:text-[#2D8FCE] hover:border-[#2D8FCE] transition-colors dark:border-[#26332f] dark:text-gray-400"
            >
              <Search size={14} />
              <span className="hidden xl:inline">{t("nav.search")}</span>
              <kbd className="hidden xl:inline rounded bg-gray-100 px-1 text-[10px] font-semibold text-gray-400 dark:bg-white/10">
                ⌘K
              </kbd>
            </button>
            <ThemeToggle />
            <LanguageToggle />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setDropdown(null);
                    setAccountOpen((o) => !o);
                  }}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-[#D4E6F4] transition-colors"
                >
                  <Avatar src={user.avatar} name={user.name} size={30} />
                  <span className="text-sm font-semibold text-gray-800 max-w-[130px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${accountOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {accountOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAccountOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-lg border border-gray-200 shadow-sm py-1.5 overflow-hidden z-50">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <div className="text-sm font-semibold text-gray-800 truncate">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-400 truncate">{user.email}</div>
                        <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#1F6BA0]">
                          {roleLabel(user.role)}
                        </div>
                      </div>
                      <Link
                        href={dashboardHref}
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#D4E6F4] hover:text-[#1F6BA0] transition-colors"
                      >
                        <LayoutDashboard size={15} />
                        {dashboardLabel}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} />
                        {t("nav.signOut")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-[#2D8FCE] transition-colors"
                >
                  {t("nav.signIn")}
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-[#2D8FCE] hover:bg-[#1F6BA0] rounded-lg transition-colors"
                >
                  {t("nav.signUp")}
                </Link>
              </>
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
        <div className="lg:hidden bg-white dark:bg-[#0e1512] border-t border-gray-100 px-4 py-4 space-y-1">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.key}>
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 tracking-wide">
                  {t(link.key)}
                </div>
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={scrollTop}
                    className="block px-3 py-2 text-sm text-gray-700 hover:text-[#1F6BA0] hover:bg-[#D4E6F4] rounded-lg transition-colors ml-2"
                  >
                    {t(child.key)}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href!}
                onClick={scrollTop}
                className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  pathname === link.href
                    ? "text-[#1F6BA0] bg-[#D4E6F4]"
                    : "text-gray-700 hover:text-[#1F6BA0] hover:bg-[#D4E6F4]"
                }`}
              >
                {t(link.key)}
              </Link>
            ),
          )}
          <button
            onClick={() => {
              setOpen(false);
              setSearchOpen(true);
            }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-[#D4E6F4] transition-colors"
          >
            <Search size={16} /> {t("nav.search")}
          </button>
          <div className="pt-3 flex justify-center items-center gap-3 border-t border-gray-100">
            <ThemeToggle />
            <LanguageToggle />
          </div>
          <div className="pt-3 border-t border-gray-100">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 px-3 py-2">
                  <Avatar src={user.avatar} name={user.name} size={38} />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-400 truncate">{user.email}</div>
                  </div>
                </div>
                <Link
                  href={dashboardHref}
                  className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-white bg-[#2D8FCE] rounded-lg hover:bg-[#1F6BA0] transition-colors"
                >
                  <LayoutDashboard size={15} />
                  {dashboardLabel}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} />
                  {t("nav.signOut")}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/register"
                  className="block text-center py-2 text-sm font-semibold text-white bg-[#2D8FCE] rounded-lg hover:bg-[#1F6BA0] transition-colors"
                >
                  {t("nav.signUp")}
                </Link>
                <Link
                  href="/login"
                  className="block text-center py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-[#2D8FCE] hover:text-[#2D8FCE] transition-colors"
                >
                  {t("nav.signIn")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
