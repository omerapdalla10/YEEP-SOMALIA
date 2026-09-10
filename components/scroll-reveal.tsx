"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide scroll reveal: every <section> in the public site softly rises into
 * view the first time it is scrolled to. The home page opts out (it has its own
 * per-element <Reveal> choreography). Fully skipped under prefers-reduced-motion.
 *
 * First paint is handled by an inline script in the site layout that adds
 * `sr-on` to <html> before sections render, so there is no flash of hidden
 * content. This component takes over on route changes and drives the observer.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (pathname === "/" || reduce) {
      html.classList.remove("sr-on");
      return;
    }
    html.classList.add("sr-on");

    const root = document.querySelector(".site-root main");
    if (!root) return;
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("section, :scope > * > article"),
    );
    if (!sections.length) return;

    // Gentle cascade for whatever is already on screen at load.
    const vh = window.innerHeight;
    let onscreen = 0;
    for (const s of sections) {
      if (s.getBoundingClientRect().top < vh * 0.9) {
        s.style.transitionDelay = `${Math.min(onscreen, 4) * 90}ms`;
        onscreen += 1;
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("sr-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
    );
    sections.forEach((s) => io.observe(s));

    // Failsafe — never leave content hidden if something goes wrong.
    const t = window.setTimeout(() => {
      sections.forEach((s) => s.classList.add("sr-in"));
    }, 2600);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
      sections.forEach((s) => {
        s.style.transitionDelay = "";
      });
    };
  }, [pathname]);

  return null;
}
