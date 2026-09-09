import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Users, Calendar, Handshake } from "lucide-react";
import { getResource, getCollection } from "@/lib/server/resource";
import { img } from "@/lib/client/img";
import { formatDate, formatMoneyCompact } from "@/lib/client/format";
import Prose from "@/components/prose";
import type { Project } from "@/lib/types";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getResource<Project>(`/api/projects/${encodeURIComponent(slug)}`);
  if (!p) return { title: "Project not found" };
  const image = img(p.image, "w=1200&h=630&fit=crop&auto=format");
  return {
    title: p.title,
    description: p.description ?? undefined,
    openGraph: {
      title: p.title,
      description: p.description ?? undefined,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getResource<Project>(`/api/projects/${encodeURIComponent(slug)}`);
  if (!p) notFound();

  const related = (await getCollection<Project>(`/api/projects?limit=6`))
    .filter((x) => x._id !== p._id)
    .slice(0, 3);

  const fundingPct = p.budget > 0 ? Math.min(100, Math.round((p.raised / p.budget) * 100)) : 0;
  const dates = [p.startDate, p.endDate].filter(Boolean).map((d) => formatDate(d)).join(" – ");

  return (
    <div className="pt-16 lg:pt-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#2D8FCE] transition-colors mb-8"
        >
          <ArrowLeft size={14} /> All projects
        </Link>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-1 bg-[#2D8FCE] text-white text-xs font-semibold rounded-full">
            {p.status}
          </span>
          {p.category && (
            <span className="px-2.5 py-1 bg-[#D4E6F4] text-[#1F6BA0] text-xs font-semibold rounded-full">
              {p.category}
            </span>
          )}
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {p.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-8">
          {(p.location || p.region) && (
            <span className="flex items-center gap-1.5">
              <MapPin size={12} /> {[p.location, p.region].filter(Boolean).join(", ")}
            </span>
          )}
          {dates && (
            <span className="flex items-center gap-1.5">
              <Calendar size={12} /> {dates}
            </span>
          )}
          {p.beneficiaries > 0 && (
            <span className="flex items-center gap-1.5">
              <Users size={12} /> {p.beneficiaries.toLocaleString()} beneficiaries
            </span>
          )}
        </div>

        {p.image && (
          <div className="rounded-2xl overflow-hidden bg-gray-100 mb-8">
            <img
              src={img(p.image, "w=1000&h=520&fit=crop&auto=format")}
              alt={p.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {p.budget > 0 && (
          <div className="rounded-2xl border border-gray-100 p-5 mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Funding</span>
              <span className="font-semibold text-gray-900">
                {formatMoneyCompact(p.raised)} of {formatMoneyCompact(p.budget)}
              </span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2D8FCE] rounded-full" style={{ width: `${fundingPct}%` }} />
            </div>
          </div>
        )}

        <Prose text={p.description} />

        {(p.fundedBy || p.partners) && (
          <div className="mt-10 pt-6 border-t border-gray-100 space-y-2 text-sm text-gray-500">
            {p.fundedBy && (
              <p className="flex items-center gap-2">
                <Handshake size={14} className="text-[#2D8FCE]" /> Funded by{" "}
                <span className="font-medium text-gray-700">{p.fundedBy}</span>
              </p>
            )}
            {p.partners && (
              <p className="flex items-center gap-2">
                <Handshake size={14} className="text-[#2D8FCE]" /> Partners:{" "}
                <span className="font-medium text-gray-700">{p.partners}</span>
              </p>
            )}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="bg-[#f8fafc] py-14 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">More projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((x) => (
                <Link
                  key={x._id}
                  href={`/projects/${x.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-36 bg-gray-100 overflow-hidden">
                    <img
                      src={img(x.image, "w=500&h=300&fit=crop&auto=format")}
                      alt={x.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{x.title}</h3>
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
