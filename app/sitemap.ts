import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/env";
import { getCollection } from "@/lib/server/resource";
import type { Program, Project, Article, EventItem } from "@/lib/types";

// Rebuild the item list hourly at runtime (the API isn't up during `next build`).
export const revalidate = 3600;

const STATIC_PATHS = [
  "",
  "/about",
  "/programs",
  "/projects",
  "/events",
  "/gallery",
  "/news",
  "/volunteer",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const base: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${appUrl}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
  }));

  const [programs, projects, news, events] = await Promise.all([
    getCollection<Program>("/api/programs?limit=500"),
    getCollection<Project>("/api/projects?limit=500"),
    getCollection<Article>("/api/news?published=true&limit=500"),
    getCollection<EventItem>("/api/events?published=true&limit=500"),
  ]);

  return [
    ...base,
    ...programs.filter((p) => p.slug).map((p) => ({ url: `${appUrl}/programs/${p.slug}` })),
    ...projects.filter((p) => p.slug).map((p) => ({ url: `${appUrl}/projects/${p.slug}` })),
    ...news.filter((a) => a.slug).map((a) => ({ url: `${appUrl}/news/${a.slug}` })),
    ...events.filter((e) => e.slug).map((e) => ({ url: `${appUrl}/events/${e.slug}` })),
  ];
}
