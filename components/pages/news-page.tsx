"use client";

import { useState } from "react";
import { Search, Calendar, User, ArrowRight, Tag } from "lucide-react";
import { useCollection } from "@/lib/client/hooks";
import { img } from "@/lib/client/img";
import { formatDate } from "@/lib/client/format";
import { QueryBoundary } from "@/components/data-states";
import type { Article } from "@/lib/types";

const categories = ["All", "Education", "Impact", "Events", "Partnerships", "Stories"];

export default function NewsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const {
    data: articles,
    loading,
    error,
    refetch,
  } = useCollection<Article>("/news", { limit: 100 });

  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => a._id !== featured?._id);

  const filtered = rest.filter((a) => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.excerpt ?? "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const catColors: Record<string, string> = {
    Events: "bg-blue-100 text-blue-700",
    Partnerships: "bg-purple-100 text-purple-700",
    Stories: "bg-pink-100 text-pink-700",
    Impact: "bg-green-100 text-green-700",
    Education: "bg-teal-100 text-teal-700",
  };

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#0f766e] to-[#115e59]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">
            News & Blog
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">Latest News & Stories</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Stories of impact, program updates, partnership announcements, and the voices of our
            community.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === c
                      ? "bg-[#0f766e] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-[#0f766e]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#0f766e] w-56"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QueryBoundary
            loading={loading}
            error={error}
            empty={articles.length === 0}
            onRetry={refetch}
            emptyLabel="No articles published yet."
            loadingLabel="Loading articles…"
          >
            {/* Featured */}
            {featured && (
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all mb-10 flex flex-col lg:flex-row">
                <div className="relative lg:w-1/2 h-64 lg:h-auto overflow-hidden bg-gray-100">
                  <img
                    src={img(featured.image, "w=800&h=500&fit=crop&auto=format")}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#f59e0b] text-white text-xs font-bold rounded-full">
                    Featured
                  </span>
                </div>
                <div className="p-8 lg:w-1/2 flex flex-col justify-center">
                  <span
                    className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full mb-3 ${catColors[featured.category]}`}
                  >
                    {featured.category}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{featured.title}</h2>
                  <p className="text-gray-500 leading-relaxed mb-5">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {formatDate(featured.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={11} /> {featured.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag size={11} /> {featured.readTime} read
                    </span>
                  </div>
                  <button className="self-start flex items-center gap-2 px-5 py-2.5 bg-[#0f766e] text-white text-sm font-semibold rounded-xl hover:bg-[#0d9488] transition-colors">
                    Read Article <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((article) => (
                <div
                  key={article._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img
                      src={img(article.image, "w=600&h=400&fit=crop&auto=format")}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full ${catColors[article.category]}`}
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
                      <span className="flex items-center gap-1">
                        <Tag size={10} /> {article.readTime}
                      </span>
                    </div>
                    <button className="flex items-center gap-1.5 text-sm font-semibold text-[#0f766e] hover:text-[#0d9488] transition-colors">
                      Read More <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              {[1, 2, 3, "...", 8].map((p, i) => (
                <button
                  key={i}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                    p === 1
                      ? "bg-[#0f766e] text-white"
                      : "bg-white text-gray-500 hover:bg-teal-50 hover:text-[#0f766e] border border-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </QueryBoundary>
        </div>
      </section>
    </div>
  );
}
