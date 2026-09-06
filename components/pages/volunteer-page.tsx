"use client";

import { useState } from "react";
import { CheckCircle, Heart, Users, Clock, Globe, Award, Star, Quote, Loader2 } from "lucide-react";
import { useCollection } from "@/lib/client/hooks";
import { img } from "@/lib/client/img";
import { api, ApiError } from "@/lib/client/api";
import { QueryBoundary } from "@/components/data-states";
import type { VolunteerRole, Testimonial } from "@/lib/types";

const benefits = [
  {
    icon: Heart,
    title: "Make Real Impact",
    desc: "Directly contribute to peacebuilding and youth leadership in communities across Somalia.",
  },
  {
    icon: Award,
    title: "Build Your Skills",
    desc: "Gain hands-on experience in facilitation, community engagement, advocacy, and research.",
  },
  {
    icon: Globe,
    title: "Expand Your Network",
    desc: "Connect with young changemakers, mentors, and partner organisations in Somalia and beyond.",
  },
  {
    icon: Clock,
    title: "Flexible Commitment",
    desc: "Choose from one-time events, part-time, or full-time volunteering options.",
  },
];

export default function VolunteerPage() {
  const {
    data: opportunities,
    loading,
    error,
    refetch,
  } = useCollection<VolunteerRole>("/volunteer-roles", { limit: 100 });
  const { data: stories } = useCollection<Testimonial>("/testimonials", { placement: "volunteer" });

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
      setFormError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
      );
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
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&h=700&fit=crop&auto=format"
            alt="Volunteers"
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
            {[
              { label: "Youth-led", sub: "Approach" },
              { label: "10+", sub: "Partners" },
              { label: "YPS", sub: "Our Focus" },
            ].map((s) => (
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
            <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">
              Why Volunteer
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">What You Gain by Giving</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="group text-center p-7 rounded-2xl border border-gray-100 hover:border-[#2D8FCE] hover:bg-[#D4E6F4] transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#D4E6F4] group-hover:bg-[#2D8FCE] flex items-center justify-center mx-auto mb-4 transition-colors">
                  <b.icon
                    size={24}
                    className="text-[#2D8FCE] group-hover:text-white transition-colors"
                  />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{b.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">
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
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#D4E6F4] flex items-center justify-center mb-3">
                    <Users size={18} className="text-[#2D8FCE]" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">{opp.role}</h3>
                  <div className="space-y-1.5 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-[#2D8FCE]" /> {opp.commitment}
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe size={13} className="text-[#2D8FCE]" /> {opp.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={13} className="text-[#2D8FCE]" /> {opp.skills}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setForm((f) => ({ ...f, role: opp.role }));
                      document
                        .getElementById("volunteer-form")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full py-2 text-sm font-semibold border border-[#2D8FCE] text-[#2D8FCE] rounded-xl hover:bg-[#D4E6F4] transition-colors"
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
      <section id="volunteer-form" className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#2D8FCE] text-sm font-semibold uppercase tracking-wider">
              Apply
            </span>
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
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    suppressHydrationWarning
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors"
                    placeholder="you@email.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    suppressHydrationWarning
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors"
                    placeholder="+252 61 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Preferred Role *
                  </label>
                  <select
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors bg-white"
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
                  Availability *
                </label>
                <select
                  required
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors bg-white"
                >
                  <option value="">Select availability</option>
                  <option>Weekdays</option>
                  <option>Weekends</option>
                  <option>Both</option>
                  <option>Flexible</option>
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
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors resize-none"
                  placeholder="Tell us what motivates you..."
                />
              </div>
              {formError && <p className="text-sm text-red-500">{formError}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Submit Application
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Volunteer Stories */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">From Our Volunteers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {stories.map((s) => (
              <div
                key={s._id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <Quote size={28} className="text-[#2D8FCE]/20 mb-3" />
                <p className="text-sm text-gray-600 leading-relaxed italic mb-5">"{s.text}"</p>
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
    </div>
  );
}
