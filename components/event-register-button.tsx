"use client";

import { useState } from "react";
import { Info, CheckCircle2, Mail, Check, Loader2, ArrowLeft } from "lucide-react";
import { api, ApiError } from "@/lib/client/api";
import type { EventItem } from "@/lib/types";

const EDUCATION_LEVELS = [
  "Primary",
  "Secondary",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Other",
];

const BANAADIR_DISTRICTS = [
  "Abdiaziz",
  "Bondhere",
  "Daynile",
  "Dharkenley",
  "Hamar Jajab",
  "Hamar Weyne",
  "Hawl Wadag",
  "Heliwaa",
  "Hodan",
  "Kaxda",
  "Karan",
  "Shangani",
  "Shibis",
  "Waberi",
  "Wadajir",
  "Warta Nabada",
  "Yaqshid",
];

const emptyForm = {
  name: "",
  email: "",
  whatsapp: "",
  gender: "",
  educationLevel: "",
  organization: "",
  position: "",
  district: "",
  confirmAvailability: "",
  wantsUpdates: true,
};

const inputCls =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2D8FCE] bg-white text-gray-800 placeholder-gray-400";
const labelCls = "block text-xs font-medium text-gray-600 mb-1.5";

/** Public, two-step RSVP form for one event — no account required. */
export default function EventRegisterButton({
  event,
  className = "",
}: {
  event: EventItem;
  className?: string;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now] = useState(() => Date.now());

  const spots = event.capacity || 0;
  const full = spots > 0 && (event.registered || 0) >= spots;
  const closed =
    new Date(event.startDate).getTime() <= now ||
    (!!event.registrationDeadline && new Date(event.registrationDeadline).getTime() < now);

  const step1Valid =
    form.name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.whatsapp.trim().length > 5 &&
    form.gender &&
    form.educationLevel &&
    form.organization.trim() &&
    form.position.trim() &&
    form.district &&
    form.confirmAvailability;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    setBusy(true);
    setError(null);
    try {
      await api.post(`/events/${event._id}/register`, {
        ...form,
        confirmAvailability: form.confirmAvailability === "Yes",
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (closed) {
    return (
      <span
        className={`inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed ${className}`}
      >
        Registration closed
      </span>
    );
  }
  if (full) {
    return (
      <span
        className={`inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed ${className}`}
      >
        Event full
      </span>
    );
  }
  if (submitted) {
    return (
      <div
        className={`flex items-start gap-2.5 px-4 py-3.5 rounded-lg bg-[#D4E6F4] text-[#1F6BA0] text-sm ${className}`}
      >
        <Check size={17} className="shrink-0 mt-0.5" />
        <span>
          <strong className="font-semibold">You&apos;re registered.</strong> Check your email for
          confirmation.
        </span>
      </div>
    );
  }

  const when = [event.dateLabel, event.timeLabel].filter(Boolean).join(", ");

  return (
    <div className={`bg-white ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-gray-900">Register Now</h3>
        <span className="text-xs text-gray-400">Step {step} of 2</span>
      </div>
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-[#2D8FCE] rounded-full transition-all duration-300"
          style={{ width: step === 1 ? "50%" : "100%" }}
        />
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <Info size={13} className="text-[#2D8FCE]" />
            Personal &amp; Professional Info
          </div>

          <div>
            <label className={labelCls}>Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Enter your full name"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  suppressHydrationWarning
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="your@email.com"
                  className={`${inputCls} pr-9`}
                />
                <Mail
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>WhatsApp Number *</label>
              <input
                type="tel"
                suppressHydrationWarning
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
                placeholder="+252 …"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Gender *</label>
              <select
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
                className={inputCls}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Educational Level *</label>
              <select
                value={form.educationLevel}
                onChange={(e) => set("educationLevel", e.target.value)}
                className={inputCls}
              >
                <option value="">Select Level</option>
                {EDUCATION_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Organization Name *</label>
              <input
                type="text"
                value={form.organization}
                onChange={(e) => set("organization", e.target.value)}
                placeholder="Organization/Company"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Position / Title *</label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
                placeholder="e.g. Director, Manager"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>District (Banaadir) *</label>
            <select
              value={form.district}
              onChange={(e) => set("district", e.target.value)}
              className={inputCls}
            >
              <option value="">Select District</option>
              {BANAADIR_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg bg-[#D4E6F4]/60 border border-[#D4E6F4] p-3.5">
            <p className="text-xs text-[#1F6BA0] leading-relaxed mb-2">
              Could you kindly confirm your availability for this event
              {when ? ` scheduled on ${when}` : ""}
              {event.location ? ` at ${event.location}` : ""}? *
            </p>
            <div className="flex gap-4">
              {["Yes", "No"].map((opt) => (
                <label key={opt} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="confirmAvailability"
                    checked={form.confirmAvailability === opt}
                    onChange={() => set("confirmAvailability", opt)}
                    className="accent-[#2D8FCE]"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={form.wantsUpdates}
              onChange={(e) => set("wantsUpdates", e.target.checked)}
              className="mt-0.5 accent-[#2D8FCE]"
            />
            Would you like to receive updates about future events?
          </label>

          <button
            type="button"
            disabled={!step1Valid}
            onClick={() => setStep(2)}
            className="w-full py-3 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <CheckCircle2 size={13} className="text-[#2D8FCE]" />
            Review &amp; Agreement
          </div>

          <div className="rounded-lg bg-[#f8fafc] border border-gray-200 p-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-gray-400">Attendee</span>
              <span className="font-semibold text-gray-900 text-right">{form.name}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-400">Organization</span>
              <span className="font-semibold text-gray-900 text-right">{form.organization}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-400">Availability</span>
              <span className="font-semibold text-gray-900 text-right">
                {form.confirmAvailability}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3.5 text-xs text-emerald-800 leading-relaxed">
            By clicking &ldquo;Register Now&rdquo;, you agree to our{" "}
            <a href="/terms" target="_blank" className="underline font-medium">
              Terms &amp; Conditions
            </a>{" "}
            and{" "}
            <a href="/privacy" target="_blank" className="underline font-medium">
              Privacy Policy
            </a>
            .
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {busy && <Loader2 size={14} className="animate-spin" />}
            Register Now
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={12} /> Back
          </button>
        </div>
      )}
    </div>
  );
}
