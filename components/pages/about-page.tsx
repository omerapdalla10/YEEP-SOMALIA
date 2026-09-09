"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  Target,
  Eye,
  Users,
  Users2,
  ShieldCheck,
  Scale,
  HeartHandshake,
  Handshake,
  GraduationCap,
  Megaphone,
  Sprout,
  Building2,
  MapPin,
  Quote,
  Download,
  FileText,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCollection, useResource } from "@/lib/client/hooks";
import { img } from "@/lib/client/img";
import { CountUp } from "@/components/count-up";
import { QueryBoundary } from "@/components/data-states";
import { useT } from "@/lib/i18n/context";
import type { TeamMember, Milestone, SiteStats, Partner, Report, SiteContent } from "@/lib/types";

const REGIONS = [
  "Banadir",
  "South West",
  "Jubaland",
  "Galmudug",
  "Hirshabelle",
  "Puntland",
];

export default function AboutPage() {
  const t = useT();
  const team = useCollection<TeamMember>("/team", { limit: 100 });
  const timeline = useCollection<Milestone>("/milestones", { limit: 100 });
  const partners = useCollection<Partner>("/partners", { limit: 100 });
  const reports = useCollection<Report>("/reports", { published: true, limit: 100 });
  const { data: stats } = useResource<SiteStats>("/stats");
  const { data: site } = useResource<SiteContent>("/site-content");
  const [bio, setBio] = useState<TeamMember | null>(null);

  useEffect(() => {
    if (!bio) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBio(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bio]);

  const values = [
    { icon: Users, title: "Youth Leadership & Ownership", desc: "Young people lead the work — as decision-makers, facilitators, and advocates, not just beneficiaries." },
    { icon: ShieldCheck, title: "Peacebuilding & P/CVE", desc: "We work non-violently to reduce conflict and to prevent and counter violent extremism." },
    { icon: Scale, title: "Gender Inclusion", desc: "We invest in young women leaders and make space for voices too often left out of peace and security." },
    { icon: HeartHandshake, title: "Community Resilience & Dialogue", desc: "We bring youth, elders, women, and authorities together to build trust and solve problems locally." },
    { icon: Handshake, title: "Partnership & Collaboration", desc: "We work with government, civil society, and international partners to reach further together." },
  ];

  const approach = [
    { icon: GraduationCap, title: t("about.approach1Title"), desc: t("about.approach1Desc") },
    { icon: Users, title: t("about.approach2Title"), desc: t("about.approach2Desc") },
    { icon: Megaphone, title: t("about.approach3Title"), desc: t("about.approach3Desc") },
    { icon: Sprout, title: t("about.approach4Title"), desc: t("about.approach4Desc") },
  ];

  const governance = [
    { icon: Building2, title: t("about.govBoardTitle"), desc: t("about.govBoardDesc") },
    { icon: Users2, title: t("about.govStaffTitle"), desc: t("about.govStaffDesc") },
    { icon: ShieldCheck, title: t("about.govAccountTitle"), desc: t("about.govAccountDesc") },
  ];

  const facts = [
    { label: t("about.statFounded"), value: stats?.foundedYear ? String(stats.foundedYear) : "2024" },
    { label: t("about.statBase"), value: "Mogadishu" },
    { label: t("about.statFocus"), value: "YPS" },
    {
      label: t("about.statPartners"),
      value: `${partners.data.length || stats?.partners || 10}+`,
    },
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-24 bg-[#2D8FCE] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white -translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">
            {t("about.badge")}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">{t("about.heroTitle")}</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">{t("about.heroDesc")}</p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">
                {t("about.whoKicker")}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-5">{t("about.whoTitle")}</h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                YEEP Somalia — the Youth Engagement and Empowerment Programme — was founded in 2024
                by young Somali peacebuilders in Mogadishu. It began as a national initiative to
                strengthen youth leadership in peacebuilding and to prevent violent extremism,
                giving young people a real seat at the table on the issues that shape their
                communities.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                Today we work across Banadir and several federal member states on Youth, Peace and
                Security (YPS), youth leadership, civic engagement, and community resilience —
                alongside more than ten partner organisations in government and civil society. Our
                work is shaped by the young people we serve: their priorities, their resilience, and
                their determination drive everything we do.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {facts.map((s) => (
                  <div key={s.label} className="bg-[#f8fafc] rounded-xl p-4">
                    <div className="text-2xl font-bold text-[#2D8FCE]">{s.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-100">
              <img
                src={
                  img(site?.aboutImage, "w=700&h=500&fit=crop&auto=format") ||
                  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&h=500&fit=crop&auto=format"
                }
                alt="YEEP Somalia team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact numbers */}
      <section className="py-16 bg-[#0d1f1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { raw: stats?.youthEmpowered ?? 0, suffix: "+", label: "Youth Empowered" },
              { raw: stats?.activePrograms ?? 0, suffix: "", label: "Active Programs" },
              { raw: stats?.communitiesReached ?? 0, suffix: "", label: "Communities Reached" },
              { raw: stats?.volunteers ?? 0, suffix: "+", label: "Volunteers" },
            ].map((s) => (
              <div key={s.label}>
                {stats ? (
                  <CountUp
                    value={s.raw}
                    format={(n) => `${n.toLocaleString()}${s.suffix}`}
                    className="text-3xl lg:text-4xl font-bold text-white mb-1"
                  />
                ) : (
                  <div className="h-9 w-20 bg-white/10 rounded animate-pulse mx-auto mb-1" />
                )}
                <div className="text-sm text-white/50 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Mission */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-[#2D8FCE] flex items-center justify-center mb-4">
                <Eye size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t("about.visionTitle")}</h3>
              <p className="text-gray-500 leading-relaxed">
                &ldquo;Youth are not just beneficiaries of change — we are the leaders of change.
                Youth are not the leaders of tomorrow — we are the leaders of today.&rdquo;
              </p>
            </div>
            <div className="bg-[#2D8FCE] rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <Target size={22} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t("about.missionTitle")}</h3>
              <p className="text-white/80 leading-relaxed">
                To equip young leaders with the skills, knowledge, and opportunities to drive
                positive change, counter violent extremism, and build resilient communities.
              </p>
            </div>
          </div>

          {/* Objectives */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-7 text-center">
              {t("about.objectivesTitle")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Build the leadership and peacebuilding capacity of young Somalis",
                "Create safe spaces for youth to address community challenges",
                "Advance the Youth, Peace and Security (YPS) agenda nationally",
                "Support youth-led initiatives that prevent violent extremism",
                "Integrate youth voices into peace and security policy",
                "Strengthen partnerships across government and civil society",
              ].map((obj) => (
                <div key={obj} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                  <CheckCircle size={18} className="text-[#2D8FCE] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">
              {t("about.approachKicker")}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t("about.approachTitle")}</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">{t("about.approachDesc")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {approach.map((a, i) => (
              <div key={a.title} className="relative bg-[#f8fafc] rounded-2xl p-6 border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-[#D4E6F4] text-[#1F6BA0] flex items-center justify-center mb-4">
                  <a.icon size={22} />
                </div>
                <div className="absolute top-6 right-6 text-3xl font-bold text-gray-200">
                  {i + 1}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{a.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">
              {t("about.valuesKicker")}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t("about.valuesTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="group text-center p-7 rounded-2xl bg-white hover:bg-[#2D8FCE] transition-all duration-300 border border-gray-100 hover:border-[#2D8FCE] hover:shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#D4E6F4] group-hover:bg-white/20 flex items-center justify-center mx-auto mb-4 transition-colors">
                  <v.icon size={24} className="text-[#2D8FCE] group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-bold text-gray-900 group-hover:text-white mb-2 transition-colors">
                  {v.title}
                </h4>
                <p className="text-sm text-gray-500 group-hover:text-white/80 leading-relaxed transition-colors">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where We Work */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">
            {t("about.whereKicker")}
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{t("about.whereTitle")}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8">{t("about.whereDesc")}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {REGIONS.map((r) => (
              <span
                key={r}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#f8fafc] border border-gray-100 rounded-full text-sm font-medium text-gray-600"
              >
                <MapPin size={13} className="text-[#2D8FCE]" />
                {r}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">
              {t("about.timelineKicker")}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t("about.timelineTitle")}</h2>
          </div>
          <QueryBoundary
            loading={timeline.loading}
            error={timeline.error}
            empty={timeline.data.length === 0}
            onRetry={timeline.refetch}
          >
            <div className="relative">
              <div className="absolute left-[7px] sm:left-1/2 sm:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-6 sm:space-y-8">
                {timeline.data.map((item, i) => (
                  <div
                    key={item._id}
                    className={`flex gap-5 sm:gap-8 items-center ${
                      i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                    }`}
                  >
                    <div className={`flex-1 ${i % 2 === 0 ? "sm:text-right" : "sm:text-left"}`}>
                      <div className="bg-white rounded-xl p-5 shadow-sm inline-block sm:max-w-xs">
                        <div className="text-[#2D8FCE] font-bold mb-1">{item.year}</div>
                        <p className="text-sm text-gray-600">{item.event}</p>
                      </div>
                    </div>
                    <div className="relative z-10 w-4 h-4 rounded-full bg-[#2D8FCE] border-4 border-white shadow-md shrink-0" />
                    <div className="hidden sm:block flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </QueryBoundary>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">
              {t("about.teamKicker")}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t("about.teamTitle")}</h2>
          </div>
          <QueryBoundary
            loading={team.loading}
            error={team.error}
            empty={team.data.length === 0}
            onRetry={team.refetch}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {team.data.map((member) => {
                const hasBio = Boolean(member.bio);
                return (
                  <button
                    key={member._id}
                    type="button"
                    onClick={() => hasBio && setBio(member)}
                    className={`group text-center ${hasBio ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white ring-offset-2 group-hover:ring-[#2D8FCE] transition-all shadow-md">
                      <img
                        src={img(member.image, "w=200&h=200&fit=crop&auto=format")}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">{member.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{member.role}</p>
                    {hasBio && (
                      <span className="text-[11px] font-semibold text-[#2D8FCE] opacity-0 group-hover:opacity-100 transition-opacity">
                        {t("about.readBio")}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </QueryBoundary>
        </div>
      </section>

      {/* Governance */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">
              {t("about.governanceKicker")}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t("about.governanceTitle")}</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">{t("about.governanceDesc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {governance.map((g) => (
              <div key={g.title} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-[#D4E6F4] text-[#1F6BA0] flex items-center justify-center mb-4">
                  <g.icon size={22} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{g.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports & Resources */}
      {reports.data.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">
                {t("about.reportsKicker")}
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">{t("about.reportsTitle")}</h2>
              <p className="text-gray-500 mt-3 max-w-2xl mx-auto">{t("about.reportsDesc")}</p>
            </div>
            <div className="space-y-3">
              {reports.data.map((r) => (
                <a
                  key={r._id}
                  href={r.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 bg-[#f8fafc] hover:bg-white border border-gray-100 hover:border-[#2D8FCE] hover:shadow-md rounded-2xl p-5 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#D4E6F4] text-[#1F6BA0] flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-[#2D8FCE] transition-colors">
                      {r.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {[r.kind, r.year, r.fileSize].filter(Boolean).join(" · ")}
                    </div>
                    {r.summary && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{r.summary}</p>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D8FCE] shrink-0">
                    <Download size={15} />
                    <span className="hidden sm:inline">{t("about.download")}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners */}
      {partners.data.length > 0 && (
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">
                {t("about.partnersKicker")}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mt-2">{t("about.partnersTitle")}</h2>
              <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">
                {t("about.partnersDesc")}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {partners.data.map((p) =>
                p.logo ? (
                  <a
                    key={p._id}
                    href={p.website || undefined}
                    target={p.website ? "_blank" : undefined}
                    rel="noreferrer"
                    className="h-12 flex items-center opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <img
                      src={img(p.logo, "h=96&fit=clip&auto=format")}
                      alt={p.name}
                      className="max-h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                    />
                  </a>
                ) : (
                  <span
                    key={p._id}
                    className="px-5 py-2.5 bg-[#f8fafc] rounded-xl text-gray-400 font-bold text-sm"
                  >
                    {p.name}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* Leadership message */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f8fafc] rounded-2xl p-8 lg:p-12 border border-gray-100">
            <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">
              {t("about.letterKicker")}
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2 mb-5">
              {t("about.letterTitle")}
            </h2>
            <Quote size={28} className="text-[#2D8FCE]/25 mb-3" />
            <p className="text-gray-600 leading-relaxed mb-4">{t("about.letterP1")}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{t("about.letterP2")}</p>
            <div className="text-sm font-semibold text-gray-900">{t("about.letterSign")}</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#2D8FCE]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t("about.ctaTitle")}</h2>
          <p className="text-white/80 mb-8">{t("about.ctaDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/volunteer"
              className="px-7 py-3 bg-white text-[#2D8FCE] font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              {t("home.volunteerToday")}
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors border border-white/30"
            >
              {t("about.ctaPartner")}
            </Link>
          </div>
        </div>
      </section>

      {/* Bio modal */}
      {bio && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setBio(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setBio(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={img(bio.image, "w=160&h=160&fit=crop&auto=format")}
                alt={bio.name}
                className="w-16 h-16 rounded-full object-cover bg-gray-100"
              />
              <div>
                <h3 className="font-bold text-gray-900">{bio.name}</h3>
                <p className="text-sm text-[#2D8FCE]">{bio.role}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{bio.bio}</p>
          </div>
        </div>
      )}
    </div>
  );
}
