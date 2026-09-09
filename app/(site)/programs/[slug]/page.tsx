import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Users, Clock, MapPin, TrendingUp } from "lucide-react";
import { getResource, getCollection } from "@/lib/server/resource";
import { img } from "@/lib/client/img";
import Prose from "@/components/prose";
import type { Program } from "@/lib/types";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getResource<Program>(`/api/programs/${encodeURIComponent(slug)}`);
  if (!p) return { title: "Programme not found" };
  const image = img(p.image, "w=1200&h=630&fit=crop&auto=format");
  return {
    title: p.title,
    description: p.summary || p.description || undefined,
    openGraph: {
      title: p.title,
      description: p.summary || p.description || undefined,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProgramPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getResource<Program>(`/api/programs/${encodeURIComponent(slug)}`);
  if (!p) notFound();

  const related = (await getCollection<Program>(`/api/programs?category=${encodeURIComponent(p.category)}&limit=4`))
    .filter((x) => x._id !== p._id)
    .slice(0, 3);

  const stats = [
    { icon: Users, label: "Beneficiaries", value: (p.beneficiaries ?? 0).toLocaleString() },
    { icon: TrendingUp, label: "Completion", value: `${p.progress ?? 0}%` },
    p.duration ? { icon: Clock, label: "Duration", value: p.duration } : null,
    p.region ? { icon: MapPin, label: "Region", value: p.region } : null,
  ].filter(Boolean) as { icon: typeof Users; label: string; value: string }[];

  return (
    <div className="pt-16 lg:pt-20">
      <section className="relative bg-[#0d1f1e]">
        {p.image && (
          <img
            src={img(p.image, "w=1600&h=600&fit=crop&auto=format")}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/programs"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={14} /> All programmes
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2.5 py-1 bg-[#2D8FCE] text-white text-xs font-semibold rounded-full">
              {p.category}
            </span>
            <span className="px-2.5 py-1 bg-white/15 text-white text-xs font-semibold rounded-full">
              {p.status}
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">{p.title}</h1>
          {p.summary && <p className="text-lg text-white/70 mt-4 max-w-2xl">{p.summary}</p>}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-[#f8fafc] p-4 text-center">
                <s.icon size={18} className="text-[#2D8FCE] mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {typeof p.progress === "number" && p.progress > 0 && (
          <div className="mb-10">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Programme completion</span>
              <span className="font-semibold text-[#2D8FCE]">{p.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2D8FCE] rounded-full" style={{ width: `${p.progress}%` }} />
            </div>
          </div>
        )}

        <Prose text={p.description} />

        <div className="mt-12 rounded-2xl bg-[#D4E6F4] p-8 text-center">
          <h2 className="text-xl font-bold text-[#1F6BA0] mb-2">Want to be part of this?</h2>
          <p className="text-sm text-[#1F6BA0]/80 mb-5">
            Apply to join, or volunteer your skills as a mentor.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/volunteer"
              className="px-6 py-3 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Get involved <ArrowRight size={14} className="inline ml-1" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-[#1F6BA0] text-sm font-semibold rounded-xl hover:bg-white/80 transition-colors"
            >
              Ask a question
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-[#f8fafc] py-14 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Other {p.category} programmes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((x) => (
                <Link
                  key={x._id}
                  href={`/programs/${x.slug}`}
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
