import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { Program } from "@/models/Program";
import { Project } from "@/models/Project";
import { Article } from "@/models/Article";
import { Event } from "@/models/Event";

export interface SearchHit {
  type: "program" | "project" | "news" | "event";
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  href: string;
}

function rx(term: string) {
  return new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
}

/**
 * GET /api/search?q=term&limit=5 — combined public typeahead across
 * programs, projects, news and events.
 */
export const GET = route(async (req: NextRequest) => {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  const perType = Math.min(8, Math.max(1, Number(req.nextUrl.searchParams.get("limit")) || 4));

  if (q.length < 2) return ok({ results: [] as SearchHit[] });
  const r = rx(q);

  const [programs, projects, news, events] = await Promise.all([
    Program.find({ $or: [{ title: r }, { summary: r }, { description: r }] })
      .select("title summary image slug")
      .limit(perType),
    Project.find({ $or: [{ title: r }, { description: r }, { location: r }] })
      .select("title description image slug")
      .limit(perType),
    Article.find({ published: true, $or: [{ title: r }, { excerpt: r }, { content: r }] })
      .select("title excerpt image slug")
      .limit(perType),
    Event.find({ published: true, $or: [{ title: r }, { description: r }, { location: r }] })
      .select("title dateLabel location image slug")
      .sort("startDate")
      .limit(perType),
  ]);

  const results: SearchHit[] = [
    ...programs.map((p) => ({
      type: "program" as const,
      id: String(p._id),
      title: p.title,
      subtitle: p.summary || p.description || undefined,
      image: p.image || undefined,
      href: `/programs/${p.slug}`,
    })),
    ...projects.map((p) => ({
      type: "project" as const,
      id: String(p._id),
      title: p.title,
      subtitle: p.description || undefined,
      image: p.image || undefined,
      href: `/projects/${p.slug}`,
    })),
    ...news.map((a) => ({
      type: "news" as const,
      id: String(a._id),
      title: a.title,
      subtitle: a.excerpt || undefined,
      image: a.image || undefined,
      href: `/news/${a.slug}`,
    })),
    ...events.map((e) => ({
      type: "event" as const,
      id: String(e._id),
      title: e.title,
      subtitle: [e.dateLabel, e.location].filter(Boolean).join(" · ") || undefined,
      image: e.image || undefined,
      href: `/events/${e.slug}`,
    })),
  ];

  return ok({ results });
});
