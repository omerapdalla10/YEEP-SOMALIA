"use client";

import { useState } from "react";
import {
  Mail,
  Globe,
  MapPin,
  Clock,
  Share2,
  Image,
  MessageCircle,
  Briefcase,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { api, ApiError } from "@/lib/client/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#0f766e] to-[#115e59]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-4">
            Contact
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5">Get In Touch</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Have a question, idea, or partnership in mind? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-5">
              {[
                { icon: MapPin, title: "Our Office", content: "Mogadishu, Somalia" },
                { icon: Mail, title: "Email", content: "yeepsomalia@gmail.com" },
                { icon: Globe, title: "Website", content: "yeep.org.so" },
                {
                  icon: Clock,
                  title: "Office Hours",
                  content: "Sat – Thu: 8:00 AM – 4:00 PM\nFriday: Closed",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-[#0f766e]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 whitespace-pre-line">{item.content}</p>
                  </div>
                </div>
              ))}

              {/* Social */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Follow Us</h4>
                <div className="flex gap-2">
                  {[
                    {
                      icon: Share2,
                      href: "https://www.facebook.com/profile.php?id=61565617627973",
                      label: "Facebook",
                    },
                    { icon: Image, href: "https://instagram.com/yeepsomalia", label: "Instagram" },
                    {
                      icon: MessageCircle,
                      href: "https://x.com/yeepsomalia",
                      label: "X (Twitter)",
                    },
                    {
                      icon: Briefcase,
                      href: "https://www.linkedin.com/search/results/all/?keywords=YEEP%20Somalia",
                      label: "LinkedIn",
                    },
                  ].map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-[#0f766e] flex items-center justify-center transition-colors group"
                    >
                      <Icon
                        size={16}
                        className="text-gray-500 group-hover:text-white transition-colors"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {sent ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={36} className="text-[#16a34a]" />
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
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e]"
                        placeholder="Your name"
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
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e]"
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Subject *
                    </label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e] bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option>General Inquiry</option>
                      <option>Partnership</option>
                      <option>Volunteer</option>
                      <option>Media & Press</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e] resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 bg-[#0f766e] hover:bg-[#0d9488] text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {sending && <Loader2 size={16} className="animate-spin" />}
                    Send Message
                  </button>
                </form>
              )}

              {/* Map placeholder */}
              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-64 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-green-50 flex flex-col items-center justify-center">
                  <MapPin size={36} className="text-[#0f766e] mb-2" />
                  <p className="font-semibold text-gray-700">Mogadishu, Somalia</p>
                  <p className="text-sm text-gray-400">YEEP Somalia</p>
                  <a
                    href="https://www.google.com/maps/search/Mogadishu,+Somalia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 px-4 py-2 bg-[#0f766e] text-white text-xs font-semibold rounded-xl hover:bg-[#0d9488] transition-colors"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
