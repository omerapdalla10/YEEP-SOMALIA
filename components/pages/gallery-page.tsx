"use client";

import { useCallback, useEffect, useState } from "react";
import { X, ZoomIn, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useCollection } from "@/lib/client/hooks";
import { img } from "@/lib/client/img";
import { QueryBoundary } from "@/components/data-states";
import type { GalleryItem } from "@/lib/types";

const categories = ["All", "Programs", "Events", "Community", "Volunteers"];

// DB stores loose span hints; map them to classes that exist in this file so
// Tailwind actually generates them.
const SPAN: Record<string, string> = {
  "col-span-2": "sm:col-span-2",
  "row-span-2": "sm:row-span-2",
  "col-span-2 row-span-2": "sm:col-span-2 sm:row-span-2",
};

function videoEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const {
    data: items,
    loading,
    error,
    refetch,
  } = useCollection<GalleryItem>("/gallery", { limit: 100 });

  const filtered =
    activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory);

  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((i) => {
        if (i === null) return i;
        const n = i + dir;
        return n < 0 || n >= filtered.length ? i : n;
      }),
    [filtered.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, step]);

  const current = lightbox !== null ? filtered[lightbox] : null;
  const embed = current?.type === "video" && current.videoUrl ? videoEmbed(current.videoUrl) : null;

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="py-20 bg-[#1F6BA0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">
            Gallery
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">Photo &amp; Video Gallery</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            A visual journey through the training, dialogues, and milestones of YEEP Somalia&apos;s
            community.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === c
                    ? "bg-[#2D8FCE] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-[#D4E6F4] hover:text-[#1F6BA0]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QueryBoundary
            loading={loading}
            error={error}
            empty={filtered.length === 0}
            onRetry={refetch}
            emptyLabel="No media in this category yet."
            loadingLabel="Loading gallery…"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
              {filtered.map((item, i) => (
                <button
                  key={item._id}
                  type="button"
                  aria-label={item.caption || "Open media"}
                  className={`relative group overflow-hidden rounded-xl bg-gray-200 ${SPAN[(item.span ?? "").trim()] ?? ""}`}
                  onClick={() => setLightbox(i)}
                >
                  <img
                    src={img(item.image, "w=600&h=600&fit=crop&auto=format")}
                    alt={item.caption || ""}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                    {item.type === "video" ? (
                      <Play size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    {item.caption && (
                      <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity px-3 text-center">
                        {item.caption}
                      </p>
                    )}
                  </div>
                  {item.type === "video" && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Play size={9} /> VIDEO
                    </div>
                  )}
                </button>
              ))}
            </div>
          </QueryBoundary>
        </div>
      </section>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Close"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X size={20} />
          </button>
          {lightbox !== null && lightbox > 0 && (
            <button
              aria-label="Previous"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              className="absolute left-3 sm:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
          )}
          {lightbox !== null && lightbox < filtered.length - 1 && (
            <button
              aria-label="Next"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              className="absolute right-3 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight size={22} />
            </button>
          )}
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {embed ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
                <iframe
                  src={embed}
                  title={current.caption || "Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            ) : current.type === "video" && current.videoUrl ? (
              <video src={current.videoUrl} controls className="w-full rounded-xl shadow-md" />
            ) : (
              <img
                src={img(current.image, "w=1200&h=800&fit=clip&auto=format")}
                alt={current.caption || ""}
                className="w-full rounded-xl shadow-md"
              />
            )}
            {current.caption && (
              <p className="text-white/80 text-sm text-center mt-4">{current.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
