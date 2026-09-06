"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "yeep_admin_theme";
export type AdminTheme = "light" | "dark";

/** Light/dark preference for the admin console, persisted per browser. */
export function useAdminTheme() {
  const [theme, setTheme] = useState<AdminTheme>("light");

  useEffect(() => {
    // Hydrate the preference from storage after mount.
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "dark" || saved === "light") setTheme(saved);
      else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) setTheme("dark");
    } catch {
      /* storage unavailable — keep the light default */
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
