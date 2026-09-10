"use client";

import { useState } from "react";
import { Mail, Phone, Globe, MapPin, Clock, MessageCircle, CheckCircle, Loader2 } from "lucide-react";
import { XIcon, FacebookIcon, InstagramIcon, LinkedinIcon } from "@/components/brand-icons";
import { useResource } from "@/lib/client/hooks";
import { api, ApiError } from "@/lib/client/api";
import type { SiteContent } from "@/lib/types";

const FALLBACK = {
  email: "info@yeep.org.so",
  phone: "+252 611 676 253",
  address: "Mogadishu, Somalia",
  hours: "Sat – Thu: 8:00 AM – 4:00 PM\nFriday: Closed",
  website: "yeep.org.so",
  map: "https://www.openstreetmap.org/export/embed.html?bbox=45.28%2C2.01%2C45.39%2C2.09&layer=mapnik&marker=2.0469%2C45.3182",
};

const departments = [
  { label: "Partnerships", note: "Collaborations with government & civil society" },
  { label: "Media & Press", note: "Interviews, quotes, press kit" },
  { label: "Volunteering", note: "Roles, applications, onboarding" },
];

export default function ContactPage() {
  const { data: site } = useResource<SiteContent>("/site-content");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [company, setCompany] = useState(""); // honeypot
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = site?.contactEmail || FALLBACK.email;
  const phone = site?.contactPhone || FALLBACK.phone;
  const whatsapp = site?.contactWhatsapp;
  const address = site?.officeAddress || FALLBACK.address;
  const hours = site?.officeHours || FALLBACK.hours;
  const mapSrc = site?.mapEmbedSrc || FALLBACK.map;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (company) {
      // Bot filled the hidden field — pretend success, send nothing.
      setSent(true);
      return;
    }
    setSending(true);
    setError(null);
    try {
      await api.post("/contact", form);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const infoCards = [
    { icon: MapPin, title: "Our Office", content: address },
    { icon: Mail, title: "Email", content: email, href: `mailto:${email}` },
    ...(phone ? [{ icon: Phone, title: "Phone", content: phone, href: `tel:${phone.replace(/\s+/g, "")}` }] : []),
    ...(whatsapp
      ? [{ icon: MessageCircle, title: "WhatsApp", content: "Chat with us", href: `https://wa.me/${whatsapp}` }]
      : []),
    { icon: Clock, title: "Office Hours", content: hours },
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#2D8FCE] to-[#1F6BA0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">
            Contact
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">Get In Touch</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Have a question, idea, or partnership in mind? We usually reply within 24–48 hours.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-5">
              {infoCards.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#D4E6F4] flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-[#2D8FCE]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-xs text-[#2D8FCE] hover:underline whitespace-pre-line break-all"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-xs text-gray-500 whitespace-pre-line">{item.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Departments */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Who to contact</h4>
                <ul className="space-y-2">
                  {departments.map((d) => (
                    <li key={d.label} className="text-xs">
                      <span className="font-semibold text-gray-700">{d.label}</span>
                      <span className="text-gray-400"> — {d.note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Follow Us</h4>
                <div className="flex gap-2">
                  {[
                    { icon: FacebookIcon, href: "https://www.facebook.com/profile.php?id=61565617627973", label: "Facebook" },
                    { icon: InstagramIcon, href: "https://instagram.com/yeepsomalia", label: "Instagram" },
                    { icon: XIcon, href: "https://x.com/yeepsomalia", label: "X (Twitter)" },
                    { icon: LinkedinIcon, href: "https://www.linkedin.com/search/results/all/?keywords=YEEP%20Somalia", label: "LinkedIn" },
                    { icon: Globe, href: `https://${FALLBACK.website}`, label: "Website" },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-[#2D8FCE] flex items-center justify-center transition-colors group"
                    >
                      <Icon size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {sent ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#D4E6F4] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={36} className="text-[#2D8FCE]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500">
                    Thank you for reaching out. Our team will respond within 24–48 hours.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-5"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Send a Message</h2>

                  {/* Honeypot — hidden from humans */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2D8FCE]"
                        placeholder="Your name"
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
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2D8FCE]"
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2D8FCE] bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option>General Inquiry</option>
                      <option>Partnership</option>
                      <option>Volunteer</option>
                      <option>Media &amp; Press</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2D8FCE] resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {sending && <Loader2 size={16} className="animate-spin" />}
                    Send Message
                  </button>
                </form>
              )}

              {/* Map */}
              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-64">
                <iframe
                  title="YEEP Somalia office location"
                  src={mapSrc}
                  loading="lazy"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
