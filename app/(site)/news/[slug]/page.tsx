import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Clock, Tag } from "lucide-react";
import { getResource, getCollection } from "@/lib/server/resource";
import { img } from "@/lib/client/img";
import { formatDate } from "@/lib/client/format";
import Prose from "@/components/prose";
import ShareButtons from "@/components/share-buttons";
import type { Article } from "@/lib/types";

type Params = Promise<{ slug: string }>;

async function load(slug: string) {
  const article = await getResource<Article>(`/api/news/${encodeURIComponent(slug)}`);
  if (!article || article.published === false) return null;
  return article;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = await load(slug);
  if (!article) return { title: "Article not found" };
  const image = img(article.image, "w=1200&h=630&fit=crop&auto=format");
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: "article",
      images: image ? [{ url: image }] : undefined,
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await load(slug);
  if (!article) notFound();

  const related = (await getCollection<Article>(`/api/news?category=${encodeURIComponent(article.category)}&limit=4`))
    .filter((a) => a._id !== article._id && a.published !== false)
    .slice(0, 3);

  return (
    <div className="pt-16 lg:pt-20">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#2D8FCE] transition-colors mb-8"
        >
          <ArrowLeft size={14} /> All news
        </Link>

        <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-[#D4E6F4] text-[#1F6BA0] mb-4">
          {article.category}
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-8">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} /> {formatDate(article.publishedAt)}
          </span>
          {article.author && (
            <span className="flex items-center gap-1.5">
              <User size={12} /> {article.author}
            </span>
          )}
          {article.readTime && (
            <span className="flex items-center gap-1.5">
              <Clock size={12} /> {article.readTime} read
            </span>
          )}
        </div>

        {article.image && (
          <div className="rounded-xl overflow-hidden bg-gray-100 mb-8">
            <img
              src={img(article.image, "w=1000&h=560&fit=crop&auto=format")}
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {article.content?.trim() ? (
          <Prose text={article.content} />
        ) : (
          <p className="text-[15px] leading-relaxed text-gray-600">{article.excerpt}</p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10 pt-6 border-t border-gray-100">
          {Array.isArray(article.tags) && article.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-gray-500 bg-gray-100 rounded-full"
                >
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>
          ) : (
            <span />
          )}
          <ShareButtons title={article.title} path={`/news/${article.slug}`} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-[#f8fafc] py-14 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">More from {article.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((a) => (
                <Link
                  key={a._id}
                  href={`/news/${a.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-200 transition-colors hover:border-gray-300"
                >
                  <div className="h-36 bg-gray-100 overflow-hidden">
                    <img
                      src={img(a.image, "w=500&h=300&fit=crop&auto=format")}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{a.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(a.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
