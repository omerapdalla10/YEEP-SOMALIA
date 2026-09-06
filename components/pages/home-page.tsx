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
  Play,
  CheckCircle,
  Quote,
  Calendar,
  MapPin,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useCollection, useResource } from "@/lib/client/hooks";
import { img } from "@/lib/client/img";
import { formatCountPlus, formatMoneyCompact } from "@/lib/client/format";
import { api, ApiError } from "@/lib/client/api";
import type { Program, EventItem, Testimonial, Partner, SiteStats } from "@/lib/types";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);

  const { data: stats } = useResource<SiteStats>("/stats");
  const { data: programs } = useCollection<Program>("/programs", { featured: true, limit: 3 });
  const { data: events } = useCollection<EventItem>("/events", { limit: 3 });
  const { data: stories } = useCollection<Testimonial>("/testimonials", { placement: "home" });
  const { data: partners } = useCollection<Partner>("/partners");

  const statCards = [
    {
      value: stats ? formatCountPlus(stats.youthEmpowered) : "—",
      label: "Youth Empowered",
      icon: Users,
      color: "bg-teal-50 text-[#0f766e]",
    },
    {
      value: stats ? String(stats.activePrograms) : "—",
      label: "Active Programs",
      icon: BookOpen,
      color: "bg-green-50 text-[#16a34a]",
    },
    {
      value: stats ? String(stats.communitiesReached) : "—",
      label: "Communities Reached",
      icon: Globe,
      color: "bg-amber-50 text-[#f59e0b]",
    },
    {
      value: stats ? formatMoneyCompact(stats.fundsRaised) : "—",
      label: "Funds Raised",
      icon: TrendingUp,
      color: "bg-teal-50 text-[#0f766e]",
    },
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
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&h=900&fit=crop&auto=format"
            alt="Youth in community program"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1f1e]/90 via-[#0d1f1e]/70 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f59e0b]/20 text-[#f59e0b] text-xs font-semibold rounded-full mb-6 border border-[#f59e0b]/30">
              <Star size={12} />
              Youth, Peace &amp; Security — led by young Somalis
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Engage. Empower.
              <span className="block text-[#34d399]">Transform.</span>
            </h1>
            <p className="text-lg text-gray-200 leading-relaxed mb-8 max-w-xl">
              YEEP Somalia is a youth-led NGO advancing Youth, Peace and Security (YPS), youth
              leadership, civic engagement, and community resilience across Somalia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/volunteer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#f59e0b] hover:bg-amber-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Heart size={18} />
                Get Involved
              </Link>
              <Link
                href="/volunteer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/30 backdrop-blur-sm"
              >
                Become a Volunteer
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Video pill */}
            <button className="mt-8 flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
              <div className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Play size={16} className="ml-0.5" />
              </div>
              <span className="text-sm font-medium">Watch Our Story</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3`}
                >
                  <stat.icon size={22} />
                </div>
                <div className="text-3xl font-bold text-[#0f766e] mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Strip */}
      <section className="py-16 bg-[#0f766e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl lg:text-2xl text-white/90 font-medium leading-relaxed max-w-3xl mx-auto">
            "YEEP Somalia is a national initiative designed to strengthen youth leadership in
            peacebuilding and prevent violent extremism."
          </p>
          <div className="mt-4 text-[#34d399] text-sm font-semibold">— YEEP Somalia</div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-[#0f766e] text-sm font-semibold uppercase tracking-wider">
                What We Do
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
                Featured Programs
              </h2>
            </div>
            <Link
              href="/programs"
              className="flex items-center gap-1.5 text-[#0f766e] font-semibold text-sm hover:gap-2.5 transition-all mt-4 sm:mt-0"
            >
              View All Programs <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {programs.map((prog) => (
              <div
                key={prog._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img
                    src={img(prog.image, "w=600&h=400&fit=crop&auto=format")}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#0f766e] text-white text-xs font-semibold rounded-full">
                    {prog.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{prog.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {prog.summary || prog.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Users size={12} />
                      {(prog.beneficiaries ?? 0).toLocaleString()} beneficiaries
                    </span>
                    <Link
                      href="/programs"
                      className="text-sm font-semibold text-[#0f766e] hover:text-[#0d9488] flex items-center gap-1 transition-colors"
                    >
                      Learn More <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Visual */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-[#0f766e] text-sm font-semibold uppercase tracking-wider">
                Our Impact
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-5">
                Young People at the
                <br />
                Centre of Peace
              </h2>
              <p className="text-gray-500 leading-relaxed mb-7">
                Our youth-led approach tackles the drivers of conflict and exclusion — combining
                leadership training, community engagement, and policy advocacy so young people help
                build lasting peace.
              </p>
              <ul className="space-y-3">
                {[
                  "Youth-led approach to Youth, Peace and Security (YPS)",
                  "Leadership and peacebuilding training for young Somalis",
                  "Community dialogues that surface and address local drivers of conflict",
                  "10+ partner organisations across government and civil society",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-[#16a34a] shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#0f766e] hover:bg-[#0d9488] text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Learn About Us <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&h=500&fit=crop&auto=format"
                  alt="Students in class"
                  className="w-full h-80 object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0f766e] flex items-center justify-center">
                  <TrendingUp size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">10+</div>
                  <div className="text-xs text-gray-400">Partner Orgs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-[#0f766e] text-sm font-semibold uppercase tracking-wider">
                Calendar
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Upcoming Events</h2>
            </div>
            <Link
              href="/events"
              className="flex items-center gap-1.5 text-[#0f766e] font-semibold text-sm hover:gap-2.5 transition-all mt-4 sm:mt-0"
            >
              All Events <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {events.map((ev) => (
              <div
                key={ev._id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <span className="text-xs font-semibold text-[#f59e0b] bg-amber-50 px-2.5 py-1 rounded-full">
                  {ev.type}
                </span>
                <h3 className="font-bold text-gray-900 mt-3 mb-2">{ev.title}</h3>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={13} className="text-[#0f766e]" />
                    {ev.dateLabel}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={13} className="text-[#0f766e]" />
                    {ev.location}
                  </div>
                </div>
                <Link
                  href="/events"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-[#0f766e] text-[#0f766e] text-sm font-semibold rounded-xl hover:bg-teal-50 transition-colors"
                >
                  Register Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#0f766e] text-sm font-semibold uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Success Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {stories.map((story) => (
              <div
                key={story._id}
                className="bg-[#f8fafc] rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <Quote size={28} className="text-[#0f766e]/20 mb-3" />
                <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">"{story.text}"</p>
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
                      <Star key={i} size={12} className="fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-14 bg-[#f8fafc] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400 font-medium mb-8 uppercase tracking-wider">
            Trusted by Leading Organizations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partners.map((p) => (
              <div
                key={p._id}
                className="px-6 py-3 bg-white rounded-xl shadow-sm text-gray-400 font-bold text-sm hover:text-[#0f766e] hover:shadow-md transition-all"
              >
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Newsletter */}
      <section className="py-20 bg-gradient-to-br from-[#0f766e] to-[#0d9488]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Stay Connected with YEEP Somalia
          </h2>
          <p className="text-white/80 mb-8">
            Get the latest news, program updates, and impact stories delivered to your inbox.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl">
              <CheckCircle size={18} />
              Thank you for subscribing!
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
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
                required
              />
              <button
                type="submit"
                disabled={subscribing}
                className="px-6 py-3 bg-[#f59e0b] hover:bg-amber-500 text-white font-semibold rounded-xl transition-colors whitespace-nowrap disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {subscribing && <Loader2 size={15} className="animate-spin" />}
                Subscribe
              </button>
            </form>
          )}
          {subError && <p className="text-white/90 text-sm mt-3">{subError}</p>}

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/volunteer"
              className="px-7 py-3 bg-[#f59e0b] hover:bg-amber-500 text-white font-semibold rounded-xl transition-all shadow-lg"
            >
              Volunteer Today
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/30"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
