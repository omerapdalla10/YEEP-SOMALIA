"use client";

import { useState } from "react";
import { Users, ArrowRight, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCollection } from "@/lib/client/hooks";
import { img } from "@/lib/client/img";
import { QueryBoundary } from "@/components/data-states";
import type { Program } from "@/lib/types";

const categories = [
  "All",
  "Leadership",
  "Skills",
  "Digital Literacy",
  "Entrepreneurship",
  "Education",
];

export default function ProgramsPage() {
  const [active, setActive] = useState("All");
  const {
    data: programs,
    loading,
    error,
    refetch,
  } = useCollection<Program>("/programs", { limit: 100 });

  const filtered = active === "All" ? programs : programs.filter((p) => p.category === active);

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#2D8FCE] to-[#1F6BA0] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">
            Programs
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">Our Programs</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Youth-led programmes in leadership, peacebuilding, civic engagement, and resilience
            across Somalia.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active === cat
                    ? "bg-[#2D8FCE] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-[#D4E6F4] hover:text-[#1F6BA0]"
                }`}
              >
                {cat}
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
            emptyLabel="No programs in this category yet."
            loadingLabel="Loading programs…"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((prog) => (
                <div
                  key={prog._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={img(prog.image, "w=600&h=400&fit=crop&auto=format")}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 bg-[#2D8FCE] text-white text-xs font-semibold rounded-full">
                        {prog.category}
                      </span>
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          prog.status === "Active"
                            ? "bg-[#D4E6F4] text-[#1F6BA0]"
                            : "bg-[#D4E6F4] text-[#1F6BA0]"
                        }`}
                      >
                        {prog.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{prog.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">
                      {prog.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span>Program Completion</span>
                        <span className="font-semibold text-[#2D8FCE]">{prog.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#2D8FCE] to-[#2D8FCE] rounded-full transition-all"
                          style={{ width: `${prog.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Users size={12} /> {(prog.beneficiaries ?? 0).toLocaleString()}{" "}
                        beneficiaries
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {prog.duration}
                      </span>
                    </div>

                    <Link
                      href={`/programs/${prog.slug}`}
                      className="flex items-center justify-center gap-2 py-2.5 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      Learn More <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </QueryBoundary>
        </div>
      </section>

      {/* Apply CTA */}
      <section className="py-16 bg-[#2D8FCE]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join a Programme?</h2>
          <p className="text-white/80 mb-8">
            Applications are open to young Somalis ready to lead. Take the first step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-7 py-3 bg-[#2D8FCE] text-white font-semibold rounded-xl hover:bg-[#1F6BA0] transition-colors"
            >
              Apply Now <ArrowRight className="inline ml-1" size={16} />
            </Link>
            <Link
              href="/volunteer"
              className="px-7 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              Volunteer as Mentor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
