"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme/context";

/** Sun / moon toggle for the public site's light/dark theme. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light mode" : "Dark mode"}
      className={`relative h-8 w-8 shrink-0 rounded-lg border border-gray-200 text-gray-500 transition-colors hover:text-[#2D8FCE] dark:border-[#26332f] dark:text-gray-300 ${className}`}
    >
      <Sun
        size={15}
        className={`absolute inset-0 m-auto transition-all ${
          dark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <Moon
        size={15}
        className={`absolute inset-0 m-auto transition-all ${
          dark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}
