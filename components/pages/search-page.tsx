"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ArrowRight, BookOpen, FolderOpen, Newspaper, Calendar } from "lucide-react";
import { useCollection } from "@/lib/client/hooks";
import { img } from "@/lib/client/img";
import { useT } from "@/lib/i18n/context";
import type { Program, Project, Article, EventItem } from "@/lib/types";

const LIMIT = 6;

export default function SearchPage() {
  const router = useRouter();
  const q = (useSearchParams().get("q") ?? "").trim();
  const [term, setTerm] = useState(q);
  const t = useT();

  const params = useMemo(() => (q ? { search: q, limit: LIMIT } : undefined), [q]);
  const newsParams = useMemo(
    () => (q ? { search: q, published: "true", limit: LIMIT } : undefined),
    [q],
  );

  const programs = useCollection<Program>(q ? "/programs" : null, params);
  const projects = useCollection<Project>(q ? "/projects" : null, params);
  const news = useCollection<Article>(q ? "/news" : null, newsParams);
  const events = useCollection<EventItem>(q ? "/events" : null, newsParams);

  const loading =
    q && (programs.loading || projects.loading || news.loading || events.loading);
  const totalCount =
    programs.data.length + projects.data.length + news.data.length + events.data.length;

  // Live search: push the term into the URL a beat after the user stops typing.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const id = setTimeout(() => {
      const v = term.trim();
      router.replace(v ? `/search?q=${encodeURIComponent(v)}` : "/search");
    }, 300);
    return () => clearTimeout(id);
  }, [term, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = term.trim();
    router.replace(v ? `/search?q=${encodeURIComponent(v)}` : "/search");
  };

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-[#f8fafc]">
      <section className="py-14 bg-gradient-to-br from-[#2D8FCE] to-[#1F6BA0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-5 text-center">
            {t("nav.search") /* falls back to "Search" */}
          </h1>
          <form onSubmit={submit} className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              autoFocus
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search programs, projects, news, events…"
              className="w-full pl-11 pr-24 py-3.5 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none text-sm shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {!q && (
            <p className="text-center text-gray-400 text-sm">
              Type something above to search the site.
            </p>
          )}
          {q && loading && (
            <p className="text-center text-gray-400 text-sm">Searching for “{q}”…</p>
          )}
          {q && !loading && totalCount === 0 && (
            <p className="text-center text-gray-500 text-sm">
              Nothing matched “{q}”. Try a different word.
            </p>
          )}

          <ResultGroup
            icon={BookOpen}
            label="Programs"
            href="/programs"
            items={programs.data.map((p) => ({
              id: p._id,
              title: p.title,
              sub: p.summary || p.description,
              image: p.image,
              href: `/programs/${p.slug}`,
            }))}
          />
          <ResultGroup
            icon={FolderOpen}
            label="Projects"
            href="/projects"
            items={projects.data.map((p) => ({
              id: p._id,
              title: p.title,
              sub: p.description,
              image: p.image,
              href: `/projects/${p.slug}`,
            }))}
          />
          <ResultGroup
            icon={Newspaper}
            label="News"
            href="/news"
            items={news.data.map((a) => ({
              id: a._id,
              title: a.title,
              sub: a.excerpt,
              image: a.image,
              href: `/news/${a.slug}`,
            }))}
          />
          <ResultGroup
            icon={Calendar}
            label="Events"
            href="/events"
            items={events.data.map((ev) => ({
              id: ev._id,
              title: ev.title,
              sub: [ev.dateLabel, ev.location].filter(Boolean).join(" · "),
              image: ev.image,
              href: `/events/${ev.slug}`,
            }))}
          />
        </div>
      </section>
    </div>
  );
}

interface Item {
  id: string;
  title: string;
  sub?: string;
  image?: string;
  href: string;
}

function ResultGroup({
  icon: Icon,
  label,
  href,
  items,
}: {
  icon: typeof BookOpen;
  label: string;
  href: string;
  items: Item[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#2D8FCE]">
          <Icon size={15} /> {label}
        </h2>
        <Link
          href={href}
          className="text-xs font-semibold text-gray-400 hover:text-[#2D8FCE] flex items-center gap-1"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((it) => (
          <Link
            key={it.id}
            href={it.href}
            className="flex gap-3 bg-white rounded-xl p-3 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <img
              src={img(it.image, "w=160&h=160&fit=crop&auto=format")}
              alt=""
              className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0"
            />
            <div className="min-w-0">
              <div className="font-semibold text-sm text-gray-900 line-clamp-2">{it.title}</div>
              {it.sub && <div className="text-xs text-gray-400 line-clamp-2 mt-0.5">{it.sub}</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
