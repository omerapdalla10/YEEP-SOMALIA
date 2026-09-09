import { appUrl } from "@/lib/env";
import { getCollection } from "@/lib/server/resource";
import type { Article } from "@/lib/types";

export const revalidate = 3600;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const articles = (await getCollection<Article>("/api/news?published=true&limit=50"))
    .filter((a) => a.slug)
    .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime());

  const items = articles
    .map((a) => {
      const url = `${appUrl}/news/${a.slug}`;
      const date = a.publishedAt ? new Date(a.publishedAt).toUTCString() : "";
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${date ? `<pubDate>${date}</pubDate>` : ""}
      ${a.category ? `<category>${esc(a.category)}</category>` : ""}
      <description>${esc(a.excerpt ?? "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>YEEP Somalia — News &amp; Stories</title>
    <link>${appUrl}/news</link>
    <description>Impact stories, program updates and announcements from YEEP Somalia.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
