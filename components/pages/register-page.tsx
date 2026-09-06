"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { errorMessage, fieldErrors } from "@/lib/client/errors";
import { FormAlert, FieldError } from "@/components/data-states";
import GoogleButton from "@/components/google-button";

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFields({});
    if (form.name.trim().length < 2) {
      setFields({ name: "Please enter your full name." });
      return;
    }
    if (form.password.length < 8) {
      setFields({ password: "Use at least 8 characters." });
      return;
    }
    if (form.password !== form.confirm) {
      setFields({ confirm: "Passwords don't match." });
      return;
    }
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      });
      router.replace("/dashboard");
    } catch (err) {
      setError(errorMessage(err, "Unable to create account. Please try again."));
      setFields(fieldErrors(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left visual */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&h=1200&fit=crop&auto=format"
          alt="Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0f766e]/85 flex flex-col items-center justify-center p-12">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg">
              <span className="text-[#0f766e] font-black text-xl">Y</span>
            </div>
            <div>
              <div className="text-white font-bold text-2xl">YEEP Somalia</div>
              <div className="text-white/70 text-xs tracking-wide">
                Engage · Empower · Transform
              </div>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-white text-center mb-4">Join the Movement</h2>
          <p className="text-white/70 text-center max-w-xs leading-relaxed">
            Create your account and start making an impact — volunteer or apply for programs.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-xs">
            {[
              { label: "Youth-led", sub: "NGO" },
              { label: "10+", sub: "Partners" },
            ].map((s) => (
              <div key={s.sub} className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-white">{s.label}</div>
                <div className="text-xs text-white/70">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-[#0f766e] flex items-center justify-center">
              <span className="text-white font-bold">Y</span>
            </div>
            <span className="font-bold text-[#0f766e] text-lg">YEEP Somalia</span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
          <p className="text-gray-400 text-sm mb-6">
            Already have one?{" "}
            <Link href="/login" className="text-[#0f766e] font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          <GoogleButton label="Sign up with Google" />

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or with your email</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e]"
                  placeholder="Your full name"
                />
              </div>
              <FieldError message={fields.name} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  suppressHydrationWarning
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e]"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  suppressHydrationWarning
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e]"
                  placeholder="+252 61 000 0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e]"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  required
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0f766e]"
                  placeholder="Repeat your password"
                />
              </div>
            </div>

            <FormAlert error={error} />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#0f766e] hover:bg-[#0d9488] text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-400 text-center">
            By registering, you agree to our{" "}
            <a href="#" className="text-[#0f766e] hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#0f766e] hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
