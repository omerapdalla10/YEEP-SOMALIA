"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Users, ArrowRight, Landmark } from "lucide-react";
import { useCollection } from "@/lib/client/hooks";
import { img } from "@/lib/client/img";
import { QueryBoundary } from "@/components/data-states";
import type { Project } from "@/lib/types";

const statuses = ["All", "Ongoing", "Completed", "Planned"];

export default function ProjectsPage() {
  const [status, setStatus] = useState("All");
  const [region, setRegion] = useState("All");
  const {
    data: projects,
    loading,
    error,
    refetch,
  } = useCollection<Project>("/projects", { limit: 100 });

  const regions = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.region).filter(Boolean) as string[]))],
    [projects],
  );

  const statusColor: Record<string, string> = {
    Ongoing: "bg-blue-100 text-blue-700",
    Completed: "bg-[#D4E6F4] text-[#1F6BA0]",
    Planned: "bg-amber-100 text-amber-700",
  };

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (status === "All" || p.status === status) && (region === "All" || p.region === region),
      ),
    [projects, status, region],
  );

  const counts = {
    Total: projects.length,
    Ongoing: projects.filter((p) => p.status === "Ongoing").length,
    Completed: projects.filter((p) => p.status === "Completed").length,
    Beneficiaries: projects.reduce((s, p) => s + (p.beneficiaries ?? 0), 0),
  };

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="py-20 bg-[#1F6BA0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">
            Projects
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">Our Projects</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            From leadership academies to community dialogues — every project is a step toward
            lasting peace.
          </p>
        </div>
      </section>

      {/* Stats + filters */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between">
            <div className="flex gap-6">
              {[
                { label: "Total", value: counts.Total },
                { label: "Ongoing", value: counts.Ongoing },
                { label: "Completed", value: counts.Completed },
                { label: "Beneficiaries", value: counts.Beneficiaries.toLocaleString() },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xl font-bold text-[#2D8FCE]">{s.value}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    status === s
                      ? "bg-[#2D8FCE] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-[#D4E6F4] hover:text-[#1F6BA0]"
                  }`}
                >
                  {s}
                </button>
              ))}
              {regions.length > 2 && (
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="ml-1 px-3 py-2 rounded-lg text-sm border border-gray-200 bg-white text-gray-600 focus:outline-none focus:border-[#2D8FCE]"
                >
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r === "All" ? "All regions" : r}
                    </option>
                  ))}
                </select>
              )}
            </div>
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
            emptyLabel="No projects match this filter yet."
            loadingLabel="Loading projects…"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((proj) => (
                  <div
                    key={proj._id}
                    className="group bg-white rounded-xl overflow-hidden border border-gray-200 transition-colors hover:border-gray-300 flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={img(proj.image, "w=600&h=400&fit=crop&auto=format")}
                        alt={proj.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      <span
                        className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full ${statusColor[proj.status]}`}
                      >
                        {proj.status}
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{proj.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-3">
                        {proj.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {proj.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users size={11} /> {(proj.beneficiaries ?? 0).toLocaleString()}
                        </span>
                        {proj.fundedBy && (
                          <span className="flex items-center gap-1">
                            <Landmark size={11} /> {proj.fundedBy}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-3">
                        {proj.description}
                      </p>

                      <Link
                        href={`/projects/${proj.slug}`}
                        className="flex items-center justify-center gap-2 py-2.5 border border-[#2D8FCE] text-[#2D8FCE] text-sm font-semibold rounded-lg hover:bg-[#D4E6F4] transition-colors"
                      >
                        Read More <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
              ))}
            </div>
          </QueryBoundary>
        </div>
      </section>
    </div>
  );
}
