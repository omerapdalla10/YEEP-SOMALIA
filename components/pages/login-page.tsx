"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { errorMessage } from "@/lib/client/errors";
import { FormAlert } from "@/components/data-states";
import GoogleButton from "@/components/google-button";

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      router.replace(from ?? (user.role !== "volunteer" ? "/admin" : "/dashboard"));
    } catch (err) {
      setError(errorMessage(err, "Unable to sign in. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left visual */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&h=1200&fit=crop&auto=format"
          alt="Youth community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#2D8FCE]/85 flex flex-col items-center justify-center p-12">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg">
              <span className="text-[#2D8FCE] font-black text-xl">Y</span>
            </div>
            <div>
              <div className="text-white font-bold text-2xl">YEEP Somalia</div>
              <div className="text-white/70 text-xs tracking-wide">
                Engage · Empower · Transform
              </div>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-white text-center mb-4">Welcome Back</h2>
          <p className="text-white/70 text-center max-w-xs leading-relaxed">
            Sign in to manage your volunteer activities and program applications.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-[#2D8FCE] flex items-center justify-center">
              <span className="text-white font-bold">Y</span>
            </div>
            <span className="font-bold text-[#2D8FCE] text-lg">YEEP Somalia</span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h1>
          <p className="text-gray-400 text-sm mb-8">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#2D8FCE] font-semibold hover:underline">
              Create one
            </Link>
          </p>

          <GoogleButton from={from} />

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or continue with email</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  suppressHydrationWarning
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#2D8FCE]"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[#2D8FCE] font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <FormAlert error={error} />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              By signing in, you agree to our{" "}
              <a href="#" className="text-[#2D8FCE] hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#2D8FCE] hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/admin"
              className="text-xs text-gray-400 hover:text-[#2D8FCE] transition-colors underline"
            >
              Admin Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
