"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Calendar, User, ArrowRight, Tag } from "lucide-react";
import { useCollection } from "@/lib/client/hooks";
import { img } from "@/lib/client/img";
import { formatDate } from "@/lib/client/format";
import { QueryBoundary } from "@/components/data-states";
import type { Article } from "@/lib/types";

const PAGE = 9;

const catColors: Record<string, string> = {
  Events: "bg-blue-100 text-blue-700",
  Partnerships: "bg-purple-100 text-purple-700",
  Stories: "bg-pink-100 text-pink-700",
  Impact: "bg-[#D4E6F4] text-[#1F6BA0]",
  Education: "bg-[#D4E6F4] text-[#1F6BA0]",
};
const catColor = (c: string) => catColors[c] || "bg-gray-100 text-gray-600";

export default function NewsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE);

  // Debounce the search box, then let the API do the matching.
  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const params = useMemo(
    () => (search ? { search, limit: 100 } : { limit: 100 }),
    [search],
  );
  const { data: articles, loading, error, refetch } = useCollection<Article>("/news", params);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))],
    [articles],
  );
  const tags = useMemo(
    () => Array.from(new Set(articles.flatMap((a) => a.tags ?? []))).slice(0, 12),
    [articles],
  );

  const showFeatured = !search && activeCategory === "All" && !activeTag;
  const featured = showFeatured
    ? [...articles].sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime(),
      )[0]
    : undefined;
  const featuredIsFeatured = featured?.featured;

  const rest = articles.filter((a) => a._id !== (featuredIsFeatured ? featured?._id : undefined));
  const filtered = rest.filter((a) => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchTag = !activeTag || (a.tags ?? []).includes(activeTag);
    return matchCat && matchTag;
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(PAGE);
  }, [search, activeCategory, activeTag]);

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#2D8FCE] to-[#1F6BA0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">
            News &amp; Blog
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">Latest News &amp; Stories</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Stories of impact, program updates, partnership announcements, and the voices of our
            community.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === c
                      ? "bg-[#2D8FCE] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-[#D4E6F4] hover:text-[#1F6BA0]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#2D8FCE] w-56"
                />
              </div>
              <a
                href="/news/rss.xml"
                className="text-xs font-semibold text-[#2D8FCE] hover:underline whitespace-nowrap"
              >
                RSS
              </a>
            </div>
          </div>
          {tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  !activeTag ? "bg-[#1F6BA0] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                All tags
              </button>
              {tags.map((tg) => (
                <button
                  key={tg}
                  onClick={() => setActiveTag(activeTag === tg ? null : tg)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    activeTag === tg
                      ? "bg-[#1F6BA0] text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  #{tg}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QueryBoundary
            loading={loading}
            error={error}
            empty={articles.length === 0}
            onRetry={refetch}
            emptyLabel={search ? `No articles match “${search}”.` : "No articles published yet."}
            loadingLabel="Loading articles…"
          >
            {featuredIsFeatured && featured && (
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all mb-10 flex flex-col lg:flex-row">
                <div className="relative lg:w-1/2 h-64 lg:h-auto overflow-hidden bg-gray-100">
                  <img
                    src={img(featured.image, "w=800&h=500&fit=crop&auto=format")}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#2D8FCE] text-white text-xs font-bold rounded-full">
                    Featured
                  </span>
                </div>
                <div className="p-8 lg:w-1/2 flex flex-col justify-center">
                  <span
                    className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full mb-3 self-start ${catColor(featured.category)}`}
                  >
                    {featured.category}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{featured.title}</h2>
                  <p className="text-gray-500 leading-relaxed mb-5 line-clamp-3">{featured.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-5">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {formatDate(featured.publishedAt)}
                    </span>
                    {featured.author && (
                      <span className="flex items-center gap-1">
                        <User size={11} /> {featured.author}
                      </span>
                    )}
                    {featured.readTime && (
                      <span className="flex items-center gap-1">
                        <Tag size={11} /> {featured.readTime} read
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/news/${featured.slug}`}
                    className="self-start flex items-center gap-2 px-5 py-2.5 bg-[#2D8FCE] text-white text-sm font-semibold rounded-xl hover:bg-[#1F6BA0] transition-colors"
                  >
                    Read Article <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.slice(0, visible).map((article) => (
                <Link
                  key={article._id}
                  href={`/news/${article.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img
                      src={img(article.image, "w=600&h=400&fit=crop&auto=format")}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full ${catColor(article.category)}`}
                    >
                      {article.category}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} /> {formatDate(article.publishedAt)}
                      </span>
                      {article.readTime && (
                        <span className="flex items-center gap-1">
                          <Tag size={10} /> {article.readTime}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-[#2D8FCE] group-hover:text-[#1F6BA0] transition-colors">
                      Read More <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {visible < filtered.length && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisible((v) => v + PAGE)}
                  className="px-6 py-3 bg-white border border-[#2D8FCE] text-[#2D8FCE] font-semibold rounded-xl hover:bg-[#D4E6F4] transition-colors"
                >
                  Load more articles
                </button>
              </div>
            )}
          </QueryBoundary>
        </div>
      </section>
    </div>
  );
}
