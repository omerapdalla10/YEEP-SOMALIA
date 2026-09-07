"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/client/api";
import { errorMessage } from "@/lib/client/errors";
import { FormAlert } from "@/components/data-states";

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token") ?? "";
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password: form.password });
      setDone(true);
    } catch (err) {
      setError(errorMessage(err, "Could not reset the password. Please request a new link."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-[#2D8FCE] flex items-center justify-center">
            <span className="text-white font-bold">Y</span>
          </div>
          <span className="font-bold text-[#2D8FCE] text-lg">YEEP Somalia</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {done ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#D4E6F4] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={22} className="text-[#1F6BA0]" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Password updated</h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                You can now sign in with your new password.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white font-semibold rounded-xl transition-colors"
              >
                Go to sign in <ArrowRight size={16} />
              </Link>
            </div>
          ) : !token ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={22} className="text-red-500" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid link</h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                This reset link is missing its token. Please request a new one.
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-1.5 text-sm text-[#2D8FCE] font-semibold hover:underline"
              >
                Request a new link <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Choose a new password</h1>
              <p className="text-gray-400 text-sm mb-6">
                Pick something you don&apos;t use anywhere else.
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    New password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showPwd ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors"
                      placeholder="At least 8 characters"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showPwd ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={form.confirm}
                      onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2D8FCE] transition-colors"
                      placeholder="Repeat the password"
                    />
                  </div>
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
                      Reset password <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
