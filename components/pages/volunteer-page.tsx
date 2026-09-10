"use client";

import { useState } from "react";
import {
  CheckCircle,
  Heart,
  Users,
  Clock,
  Globe,
  Award,
  Star,
  Quote,
  ChevronDown,
  Loader2,
  Send,
  Search,
  MessageSquare,
  PartyPopper,
} from "lucide-react";
import { useCollection, useResource } from "@/lib/client/hooks";
import { img } from "@/lib/client/img";
import { api, ApiError } from "@/lib/client/api";
import { QueryBoundary } from "@/components/data-states";
import type { VolunteerRole, Testimonial, SiteStats, SiteContent } from "@/lib/types";

const benefits = [
  { icon: Heart, title: "Make Real Impact", desc: "Directly contribute to peacebuilding and youth leadership in communities across Somalia." },
  { icon: Award, title: "Build Your Skills", desc: "Gain hands-on experience in facilitation, community engagement, advocacy, and research." },
  { icon: Globe, title: "Expand Your Network", desc: "Connect with young changemakers, mentors, and partner organisations in Somalia and beyond." },
  { icon: Clock, title: "Flexible Commitment", desc: "Choose from one-time events, part-time, or ongoing volunteering — whatever fits your life." },
];

const steps = [
  { icon: Send, title: "Apply", desc: "Submit the form below — it takes about 5 minutes." },
  { icon: Search, title: "Review", desc: "Our team reviews your application within 3 business days." },
  { icon: MessageSquare, title: "Conversation", desc: "A short call to match you to the right role and team." },
  { icon: PartyPopper, title: "Onboard", desc: "Orientation, a first assignment, and you're part of the team." },
];

const faqs = [
  { q: "Do I need experience?", a: "No. Many of our volunteers start with no prior experience — we provide orientation and on-the-job training." },
  { q: "Is volunteering paid?", a: "Volunteering is unpaid, but we cover transport and meal costs for activities and provide certificates and references." },
  { q: "How much time does it take?", a: "It depends on the role — from one-time event support to a few hours a week. You choose your availability in the form." },
  { q: "Can I volunteer remotely?", a: "Some roles (research, communications, design) can be done remotely. Others are field-based in Mogadishu and partner regions." },
];

export default function VolunteerPage() {
  const {
    data: opportunities,
    loading,
    error,
    refetch,
  } = useCollection<VolunteerRole>("/volunteer-roles", { limit: 100 });
  const { data: stories } = useCollection<Testimonial>("/testimonials", { placement: "volunteer" });
  const { data: stats } = useResource<SiteStats>("/stats");
  const { data: site } = useResource<SiteContent>("/site-content");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    availability: "",
    motivation: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const heroStats = [
    { label: stats ? `${stats.volunteers}+` : "—", sub: "Volunteers" },
    { label: stats ? `${stats.partners}+` : "—", sub: "Partners" },
    { label: "YPS", sub: "Our Focus" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await api.post("/volunteers/apply", {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        role: form.role,
        availability: form.availability || undefined,
        motivation: form.motivation || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={
              img(site?.volunteerImage, "w=1600&h=700&fit=crop&auto=format") ||
              "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&h=700&fit=crop&auto=format"
            }
            alt="YEEP Somalia volunteers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#2D8FCE]/85" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">
            Volunteer
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">Be the Change</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Join a growing network of young Somali volunteers giving their time and skills to
            peacebuilding and youth leadership.
          </p>
          <div className="flex justify-center gap-6">
            {heroStats.map((s) => (
              <div key={s.sub} className="text-center">
                <div className="text-2xl font-bold text-white">{s.label}</div>
                <div className="text-xs text-white/70">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#2D8FCE] text-sm font-semibold tracking-wide">
              Why Volunteer
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">What You Gain by Giving</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="group text-center p-7 rounded-xl border border-gray-100 hover:border-[#2D8FCE] hover:bg-[#D4E6F4] transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-[#D4E6F4] group-hover:bg-[#2D8FCE] flex items-center justify-center mx-auto mb-4 transition-colors">
                  <b.icon size={24} className="text-[#2D8FCE] group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{b.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#2D8FCE] text-sm font-semibold tracking-wide">
              The Process
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">What Happens Next</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="relative bg-white rounded-xl p-6 border border-gray-100">
                <div className="w-11 h-11 rounded-lg bg-[#D4E6F4] text-[#1F6BA0] flex items-center justify-center mb-4">
                  <s.icon size={20} />
                </div>
                <span className="absolute top-6 right-6 text-3xl font-bold text-gray-100">
                  {i + 1}
                </span>
                <h4 className="font-bold text-gray-900 mb-1.5">{s.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#2D8FCE] text-sm font-semibold tracking-wide">
              Opportunities
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Current Volunteer Roles</h2>
          </div>
          <QueryBoundary
            loading={loading}
            error={error}
            empty={opportunities.length === 0}
            onRetry={refetch}
            emptyLabel="No open volunteer roles right now — check back soon."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {opportunities.map((opp) => (
                <div
                  key={opp._id}
                  className="bg-[#f8fafc] rounded-xl p-6 border border-gray-200 transition-colors hover:border-gray-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#D4E6F4] flex items-center justify-center mb-3">
                    <Users size={18} className="text-[#2D8FCE]" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">{opp.role}</h3>
                  <div className="space-y-1.5 text-sm text-gray-500 mb-4">
                    {opp.commitment && (
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-[#2D8FCE]" /> {opp.commitment}
                      </div>
                    )}
                    {opp.location && (
                      <div className="flex items-center gap-2">
                        <Globe size={13} className="text-[#2D8FCE]" /> {opp.location}
                      </div>
                    )}
                    {opp.skills && (
                      <div className="flex items-center gap-2">
                        <CheckCircle size={13} className="text-[#2D8FCE]" /> {opp.skills}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setForm((f) => ({ ...f, role: opp.role }));
                      document.getElementById("volunteer-form")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full py-2 text-sm font-semibold border border-[#2D8FCE] text-[#2D8FCE] rounded-lg hover:bg-[#D4E6F4] transition-colors"
                  >
                    Apply for this Role
                  </button>
                </div>
              ))}
            </div>
          </QueryBoundary>
        </div>
      </section>

      {/* Application Form */}
      <section id="volunteer-form" className="py-20 bg-[#f8fafc]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#2D8FCE] text-sm font-semibold tracking-wide">Apply</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Volunteer Application</h2>
          </div>

          {submitted ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-[#D4E6F4] flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={36} className="text-[#2D8FCE]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Application Received!</h3>
              <p className="text-gray-500">
                Thank you for your interest in volunteering with YEEP Somalia. Our team will contact
                you within 3 business days.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl border border-gray-200 p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    suppressHydrationWarning
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors"
                    placeholder="you@email.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    suppressHydrationWarning
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors"
                    placeholder="+252 61 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Role *</label>
                  <select
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors bg-white"
                  >
                    <option value="">Select a role</option>
                    {opportunities.map((o) => (
                      <option key={o._id} value={o.role}>
                        {o.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Availability &amp; commitment *
                </label>
                <select
                  required
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors bg-white"
                >
                  <option value="">Select availability</option>
                  <option>One-time events</option>
                  <option>A few hours a week (weekdays)</option>
                  <option>A few hours a week (weekends)</option>
                  <option>Part-time (ongoing)</option>
                  <option>Full-time (ongoing)</option>
                  <option>Flexible / remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Why do you want to volunteer? *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.motivation}
                  onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors resize-none"
                  placeholder="Tell us what motivates you..."
                />
              </div>
              {formError && <p className="text-sm text-red-500">{formError}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white font-semibold rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Submit Application
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Volunteer FAQ</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={f.q} className="bg-[#f8fafc] rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-semibold text-gray-900 text-sm">{f.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[#2D8FCE] transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-5 -mt-1 text-sm text-gray-500 leading-relaxed">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Stories */}
      {stories.length > 0 && (
        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">From Our Volunteers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {stories.map((s) => (
                <div
                  key={s._id}
                  className="bg-white rounded-xl p-6 border border-gray-200 transition-colors hover:border-gray-300"
                >
                  <Quote size={28} className="text-[#2D8FCE]/20 mb-3" />
                  <p className="text-sm text-gray-600 leading-relaxed italic mb-5">
                    &ldquo;{s.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={img(s.image, "w=80&h=80&fit=crop&auto=format")}
                      alt={s.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{s.name}</div>
                      <div className="text-xs text-gray-400">{s.role}</div>
                    </div>
                    <div className="ml-auto flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className="fill-[#2D8FCE] text-[#2D8FCE]" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
