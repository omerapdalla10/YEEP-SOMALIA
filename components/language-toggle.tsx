"use client";

import { useLocale } from "@/lib/i18n/context";
import { LOCALES } from "@/lib/i18n/messages";

/** Compact EN / SO switch. */
export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-gray-200 p-0.5 text-xs font-semibold ${className}`}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`px-2 py-1 rounded-md transition-colors ${
            locale === l ? "bg-[#2D8FCE] text-white" : "text-gray-500 hover:text-[#2D8FCE]"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
