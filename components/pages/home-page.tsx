"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Users,
  BookOpen,
  Globe,
  Star,
  ChevronRight,
  ChevronDown,
  Play,
  CheckCircle,
  Quote,
  Calendar,
  MapPin,
  TrendingUp,
  Loader2,
  HeartHandshake,
  GraduationCap,
  Handshake,
  Newspaper,
} from "lucide-react";
import { useCollection, useResource } from "@/lib/client/hooks";
import { CountUp } from "@/components/count-up";
import { Reveal } from "@/components/reveal";
import { img } from "@/lib/client/img";
import { formatCountPlus, formatMoneyCompact, formatDate } from "@/lib/client/format";
import { api, ApiError } from "@/lib/client/api";
import { useT } from "@/lib/i18n/context";
import type {
  Program,
  EventItem,
  Testimonial,
  Partner,
  SiteStats,
  Article,
  GalleryItem,
  SiteContent,
} from "@/lib/types";

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="h-52 bg-gray-200 animate-pulse" />
      <div className="p-6 space-y-3">
        <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
}

function SectionHead({
  kicker,
  title,
  href,
  linkLabel,
}: {
  kicker: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
      <div>
        <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">
          {kicker}
        </span>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">{title}</h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="flex items-center gap-1.5 text-[#2D8FCE] font-semibold text-sm hover:gap-2.5 transition-all mt-4 sm:mt-0"
        >
          {linkLabel} <ArrowRight size={16} />
        </Link>
      )}
    </Reveal>
  );
}

/** A centered kicker + title + optional lead, revealed on scroll. */
function CenterHead({ kicker, title, lead }: { kicker: string; title: string; lead?: string }) {
  return (
    <Reveal className="text-center mb-12">
      <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">{kicker}</span>
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">{title}</h2>
      {lead && <p className="text-gray-500 mt-3 max-w-2xl mx-auto">{lead}</p>}
    </Reveal>
  );
}

export default function HomePage() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { data: stats } = useResource<SiteStats>("/stats");
  const { data: site } = useResource<SiteContent>("/site-content");
  const { data: programs, loading: programsLoading } = useCollection<Program>("/programs", {
    featured: true,
    limit: 3,
  });
  const { data: events, loading: eventsLoading } = useCollection<EventItem>("/events", { limit: 3 });
  const { data: stories } = useCollection<Testimonial>("/testimonials", { placement: "home" });
  const { data: partners } = useCollection<Partner>("/partners");
  const { data: news, loading: newsLoading } = useCollection<Article>("/news", { limit: 3 });
  const { data: gallery } = useCollection<GalleryItem>("/gallery", { limit: 6 });

  const statCards = [
    {
      raw: stats?.youthEmpowered ?? 0,
      format: formatCountPlus,
      label: "Youth Empowered",
      icon: Users,
    },
    {
      raw: stats?.activePrograms ?? 0,
      format: (n: number) => String(n),
      label: "Active Programs",
      icon: BookOpen,
    },
    {
      raw: stats?.communitiesReached ?? 0,
      format: (n: number) => String(n),
      label: "Communities Reached",
      icon: Globe,
    },
    {
      raw: stats?.fundsRaised ?? 0,
      format: formatMoneyCompact,
      label: "Funds Raised",
      icon: TrendingUp,
    },
  ];

  const ways = [
    {
      icon: HeartHandshake,
      title: t("home.wayVolunteerTitle"),
      desc: t("home.wayVolunteerDesc"),
      href: "/volunteer",
    },
    {
      icon: GraduationCap,
      title: t("home.wayTrainTitle"),
      desc: t("home.wayTrainDesc"),
      href: "/programs",
    },
    {
      icon: Handshake,
      title: t("home.wayPartnerTitle"),
      desc: t("home.wayPartnerDesc"),
      href: "/contact",
    },
  ];

  const faqs = [
    { q: t("home.faq1Q"), a: t("home.faq1A") },
    { q: t("home.faq2Q"), a: t("home.faq2A") },
    { q: t("home.faq3Q"), a: t("home.faq3A") },
    { q: t("home.faq4Q"), a: t("home.faq4A") },
  ];

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    setSubError(null);
    try {
      await api.post("/newsletter", { email, source: "homepage" });
      setSubscribed(true);
    } catch (err) {
      setSubError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <div className="pt-16 lg:pt-20 pb-16 sm:pb-0">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={img(site?.heroImage, "w=1600&h=1000&fit=crop&auto=format") || "/hero.jpg"}
            alt="YEEP SOMALIA youth gathering"
            className="yeep-kenburns w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1f1e]/90 via-[#0d1f1e]/70 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <Reveal delay={80}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2D8FCE]/20 text-[#2D8FCE] text-xs font-semibold rounded-full mb-6 border border-[#2D8FCE]/30">
                <Star size={12} />
                {t("home.badge")}
              </span>
            </Reveal>
            <Reveal delay={180}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {t("home.heroLine1")}
                <span className="block text-[#D4E6F4]">{t("home.heroLine2")}</span>
              </h1>
            </Reveal>
            <Reveal delay={300}>
              <p className="text-lg text-gray-200 leading-relaxed mb-8 max-w-xl">
                {t("home.heroDesc")}
              </p>
            </Reveal>
            <Reveal delay={420} className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/volunteer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Heart size={18} />
                {t("common.getInvolved")}
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/30 backdrop-blur-sm"
              >
                {t("home.exploreProgram")}
                <ArrowRight size={18} />
              </Link>
            </Reveal>

            {/* Story pill */}
            <Reveal delay={540}>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
              >
                <div className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Play size={16} className="ml-0.5" />
                </div>
                <span className="text-sm font-medium">{t("home.watchStory")}</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 90}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D4E6F4] text-[#1F6BA0] flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={22} />
                </div>
                {stats ? (
                  <CountUp value={stat.raw} format={stat.format} />
                ) : (
                  <div className="h-9 w-20 bg-gray-200 rounded animate-pulse mx-auto mb-1" />
                )}
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Strip */}
      <section className="py-16 bg-[#2D8FCE]">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl lg:text-2xl text-white/90 font-medium leading-relaxed max-w-3xl mx-auto">
            &ldquo;{t("home.missionQuote")}&rdquo;
          </p>
          <div className="mt-4 text-[#D4E6F4] text-sm font-semibold">— YEEP Somalia</div>
        </Reveal>
      </section>

      {/* Featured Programs */}
      {(programsLoading || programs.length > 0) && (
        <section className="py-20 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              kicker={t("home.whatWeDo")}
              title={t("home.featuredPrograms")}
              href="/programs"
              linkLabel={t("home.viewAllPrograms")}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {programsLoading && programs.length === 0
                ? [0, 1, 2].map((i) => <CardSkeleton key={i} />)
                : programs.map((prog, i) => (
                    <Reveal
                      key={prog._id}
                      delay={i * 90}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative h-52 overflow-hidden bg-gray-100">
                        <img
                          src={img(prog.image, "w=600&h=400&fit=crop&auto=format")}
                          alt={prog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#2D8FCE] text-white text-xs font-semibold rounded-full">
                          {prog.category}
                        </span>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{prog.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
                          {prog.summary || prog.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Users size={12} />
                            {(prog.beneficiaries ?? 0).toLocaleString()} beneficiaries
                          </span>
                          <Link
                            href={`/programs/${prog.slug}`}
                            className="text-sm font-semibold text-[#2D8FCE] hover:text-[#1F6BA0] flex items-center gap-1 transition-colors"
                          >
                            {t("common.learnMore")} <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </Reveal>
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* Impact Visual */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <Reveal direction="right">
              <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">
                {t("home.ourImpact")}
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-5">
                Young People at the
                <br />
                Heart of Change
              </h2>
              <p className="text-gray-500 leading-relaxed mb-7">
                Our programs equip young Somalis with practical skills and opportunities to transform
                their communities — through leadership, civic education, economic empowerment and
                social impact initiatives.
              </p>
              <ul className="space-y-3">
                {[
                  "Leadership training and mentorship with professionals",
                  "Civic education, dialogue and community advocacy",
                  "Entrepreneurship, vocational skills and access to funding",
                  "Preventing violent extremism and psychosocial support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-[#2D8FCE] shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Learn About Us <ArrowRight size={16} />
              </Link>
            </Reveal>
            <Reveal direction="left" delay={120} className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                <img
                  src={
                    img(site?.homeImpactImage, "w=700&h=500&fit=crop&auto=format") ||
                    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&h=500&fit=crop&auto=format"
                  }
                  alt="Young people at a YEEP Somalia session"
                  className="w-full h-80 object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div className="yeep-float absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2D8FCE] flex items-center justify-center">
                  <TrendingUp size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {stats ? stats.activePrograms : "—"}
                  </div>
                  <div className="text-xs text-gray-400">Active Programs</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How to get involved */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CenterHead
            kicker={t("home.getStarted")}
            title={t("home.howTitle")}
            lead={t("home.howDesc")}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {ways.map((w, i) => (
              <Reveal key={w.title} delay={i * 90}>
              <Link
                href={w.href}
                className="group block h-full bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#D4E6F4] text-[#1F6BA0] flex items-center justify-center">
                    <w.icon size={22} />
                  </div>
                  <span className="text-4xl font-bold text-gray-100 group-hover:text-[#D4E6F4] transition-colors">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{w.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{w.desc}</p>
                <span className="text-sm font-semibold text-[#2D8FCE] flex items-center gap-1 group-hover:gap-2 transition-all">
                  {t("common.learnMore")} <ArrowRight size={14} />
                </span>
              </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {(eventsLoading || events.length > 0) && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              kicker={t("home.calendar")}
              title={t("home.upcomingEvents")}
              href="/events"
              linkLabel={t("home.allEvents")}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {events.map((ev, i) => (
                <Reveal
                  key={ev._id}
                  delay={i * 90}
                  className="bg-[#f8fafc] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <span className="text-xs font-semibold text-[#1F6BA0] bg-[#D4E6F4] px-2.5 py-1 rounded-full">
                    {ev.type}
                  </span>
                  <Link
                    href={`/events/${ev.slug}`}
                    className="block font-bold text-gray-900 mt-3 mb-2 hover:text-[#2D8FCE] transition-colors"
                  >
                    {ev.title}
                  </Link>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={13} className="text-[#2D8FCE]" />
                      {ev.dateLabel || formatDate(ev.startDate)}
                    </div>
                    {ev.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={13} className="text-[#2D8FCE]" />
                        {ev.location}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/events/${ev.slug}`}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-[#2D8FCE] text-[#2D8FCE] text-sm font-semibold rounded-xl hover:bg-[#D4E6F4] transition-colors"
                  >
                    {t("common.viewDetails")}
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      {(newsLoading || news.length > 0) && (
        <section className="py-20 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              kicker={t("home.newsKicker")}
              title={t("home.latestNews")}
              href="/news"
              linkLabel={t("home.allNews")}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {newsLoading && news.length === 0
                ? [0, 1, 2].map((i) => <CardSkeleton key={i} />)
                : news.map((article, i) => (
                    <Reveal key={article._id} delay={i * 90}>
                    <Link
                      href={`/news/${article.slug}`}
                      className="group block h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        {article.image ? (
                          <img
                            src={img(article.image, "w=600&h=400&fit=crop&auto=format")}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#2D8FCE]/30">
                            <Newspaper size={40} />
                          </div>
                        )}
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 text-[#1F6BA0] text-xs font-semibold rounded-full">
                          {article.category}
                        </span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                          <Calendar size={11} />
                          {formatDate(article.publishedAt)}
                          {article.readTime && <span>· {article.readTime}</span>}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#2D8FCE] transition-colors">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                    </Reveal>
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* Success Stories */}
      {stories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CenterHead kicker={t("home.testimonials")} title={t("home.successStories")} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {stories.map((story, i) => (
                <Reveal
                  key={story._id}
                  delay={i * 90}
                  className="bg-[#f8fafc] rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <Quote size={28} className="text-[#2D8FCE]/20 mb-3" />
                  <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">
                    &ldquo;{story.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={img(story.image, "w=80&h=80&fit=crop&auto=format")}
                      alt={story.name}
                      className="w-11 h-11 rounded-full object-cover bg-gray-200"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{story.name}</div>
                      <div className="text-xs text-gray-400">{story.role}</div>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {Array.from({ length: story.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-[#2D8FCE] text-[#2D8FCE]" />
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery strip */}
      {gallery.length > 0 && (
        <section className="py-20 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              kicker={t("home.galleryKicker")}
              title={t("home.galleryTitle")}
              href="/gallery"
              linkLabel={t("home.viewGallery")}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {gallery.map((g, i) => (
                <Reveal key={g._id} delay={i * 60}>
                  <Link
                    href="/gallery"
                    className="group relative block aspect-square rounded-xl overflow-hidden bg-gray-200"
                  >
                    <img
                      src={img(g.image, "w=300&h=300&fit=crop&auto=format")}
                      alt={g.caption || "Gallery photo"}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#0d1f1e]/0 group-hover:bg-[#0d1f1e]/20 transition-colors" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners */}
      {partners.length > 0 && (
        <section className="py-14 bg-white border-y border-gray-100">
          <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-400 font-medium mb-8 uppercase tracking-wider">
              {t("home.trustedBy")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {partners.map((p) => (
                <div
                  key={p._id}
                  className="px-6 py-3 bg-[#f8fafc] rounded-xl shadow-sm text-gray-400 font-bold text-sm hover:text-[#2D8FCE] hover:shadow-md transition-all"
                >
                  {p.name}
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CenterHead kicker={t("home.faqKicker")} title={t("home.faqTitle")} />
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <Reveal
                key={f.q}
                delay={i * 60}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-semibold text-gray-900 text-sm">{f.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[#2D8FCE] transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-5 -mt-1 text-sm text-gray-500 leading-relaxed">{f.a}</p>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Newsletter */}
      <section className="py-20 bg-gradient-to-br from-[#2D8FCE] to-[#1F6BA0]">
        <Reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {t("home.newsletterTitle")}
          </h2>
          <p className="text-white/80 mb-8">{t("home.newsletterDesc")}</p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl">
              <CheckCircle size={18} />
              {t("footer.thanks")}
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                suppressHydrationWarning
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("home.emailPlaceholder")}
                className="flex-1 px-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
                required
              />
              <button
                type="submit"
                disabled={subscribing}
                className="px-6 py-3 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white font-semibold rounded-xl transition-colors whitespace-nowrap disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {subscribing && <Loader2 size={15} className="animate-spin" />}
                {t("common.subscribe")}
              </button>
            </form>
          )}
          {subError && <p className="text-white/90 text-sm mt-3">{subError}</p>}

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/volunteer"
              className="px-7 py-3 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white font-semibold rounded-xl transition-all shadow-lg"
            >
              {t("home.volunteerToday")}
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/30"
            >
              {t("common.contactUs")}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 backdrop-blur border-t border-gray-200 px-3 py-2.5 flex gap-2">
        <Link
          href="/volunteer"
          className="flex-1 text-center py-2.5 bg-[#2D8FCE] text-white text-sm font-semibold rounded-xl"
        >
          {t("common.getInvolved")}
        </Link>
        <Link
          href="/contact"
          className="flex-1 text-center py-2.5 border border-[#2D8FCE] text-[#2D8FCE] text-sm font-semibold rounded-xl"
        >
          {t("common.contactUs")}
        </Link>
      </div>
    </div>
  );
}
