"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  BookOpen,
  FolderOpen,
  Newspaper,
  Calendar,
  CornerDownLeft,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/client/api";
import { img } from "@/lib/client/img";
import { useT } from "@/lib/i18n/context";

interface Hit {
  type: "program" | "project" | "news" | "event";
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  href: string;
}

const TYPE_ICON = { program: BookOpen, project: FolderOpen, news: Newspaper, event: Calendar };
const TYPE_LABEL = { program: "Program", project: "Project", news: "News", event: "Event" };

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const t = useT();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced typeahead.
  useEffect(() => {
    const term = q.trim();
    /* eslint-disable react-hooks/set-state-in-effect */
    if (term.length < 2) {
      setHits([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    let alive = true;
    const timer = setTimeout(() => {
      api
        .get<{ results: Hit[] }>("/search", { q: term, limit: 4 })
        .then((res) => {
          if (!alive) return;
          setHits(res.data.results);
          setSel(0);
        })
        .catch(() => alive && setHits([]))
        .finally(() => alive && setLoading(false));
    }, 220);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [q]);

  const go = (href: string) => {
    router.push(href);
    onClose();
  };

  const seeAll = () => {
    router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
    onClose();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (hits[sel]) go(hits[sel].href);
      else seeAll();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#141d1a] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-[#26332f]">
        <div className="flex items-center gap-3 px-4 border-b border-gray-100 dark:border-[#26332f]">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search programs, projects, news, events…"
            className="flex-1 py-4 bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
          />
          {loading && <Loader2 size={15} className="animate-spin text-gray-400 shrink-0" />}
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {q.trim().length >= 2 && !loading && hits.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-gray-400">
              Nothing matched “{q.trim()}”.
            </p>
          )}
          {q.trim().length < 2 && (
            <p className="px-3 py-6 text-center text-sm text-gray-400">
              Type at least 2 letters to search.
            </p>
          )}
          {hits.map((hit, i) => {
            const Icon = TYPE_ICON[hit.type];
            return (
              <button
                key={hit.id}
                onMouseMove={() => setSel(i)}
                onClick={() => go(hit.href)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  i === sel ? "bg-[#D4E6F4] dark:bg-[#1e2f3a]" : ""
                }`}
              >
                {hit.image ? (
                  <img
                    src={img(hit.image, "w=80&h=80&fit=crop&auto=format")}
                    alt=""
                    className="h-9 w-9 rounded-md object-cover bg-gray-100 shrink-0"
                  />
                ) : (
                  <span className="h-9 w-9 rounded-md bg-[#D4E6F4] text-[#1F6BA0] flex items-center justify-center shrink-0">
                    <Icon size={15} />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {hit.title}
                  </span>
                  <span className="block text-xs text-gray-400 truncate">
                    {TYPE_LABEL[hit.type]}
                    {hit.subtitle ? ` · ${hit.subtitle}` : ""}
                  </span>
                </span>
                {i === sel && <CornerDownLeft size={13} className="text-gray-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        <button
          onClick={seeAll}
          className="w-full border-t border-gray-100 dark:border-[#26332f] px-4 py-3 text-left text-xs font-semibold text-[#2D8FCE] hover:bg-gray-50 dark:hover:bg-white/5"
        >
          {t("nav.search")}
          {q.trim() ? ` for “${q.trim()}”` : ""} →
        </button>
      </div>
    </div>
  );
}
