"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Jump to the top of the page on every route change. Next's default scroll
 * handling misses some cases (navigating from deep in a long page, repeated
 * clicks on the current section), so we do it explicitly. Skipped when the
 * URL carries a `#hash` so in-page anchors still work.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
