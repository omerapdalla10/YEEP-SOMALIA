"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { api } from "@/lib/client/api";
import { errorMessage } from "@/lib/client/errors";

type State = "verifying" | "ok" | "error" | "notoken";

export default function VerifyEmailPage() {
  const token = useSearchParams().get("token") ?? "";
  const [state, setState] = useState<State>(token ? "verifying" : "notoken");
  const [message, setMessage] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true;
    api
      .post<null>("/auth/verify-email", { token })
      .then((res) => {
        setState("ok");
        setMessage(res.message ?? "Your email address is confirmed.");
      })
      .catch((err) => {
        setState("error");
        setMessage(errorMessage(err, "That confirmation link is invalid or has expired."));
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-[#2D8FCE] flex items-center justify-center">
            <span className="text-white font-bold">Y</span>
          </div>
          <span className="font-bold text-[#2D8FCE] text-lg">YEEP Somalia</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          {state === "verifying" && (
            <>
              <Loader2 size={26} className="animate-spin text-[#2D8FCE] mx-auto" />
              <p className="mt-4 text-sm text-gray-500">Confirming your email…</p>
            </>
          )}

          {state === "ok" && (
            <>
              <div className="w-12 h-12 rounded-full bg-[#D4E6F4] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={22} className="text-[#1F6BA0]" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Email confirmed</h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{message}</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white font-semibold rounded-xl transition-colors"
              >
                Go to my dashboard <ArrowRight size={16} />
              </Link>
            </>
          )}

          {(state === "error" || state === "notoken") && (
            <>
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={22} className="text-red-500" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {state === "notoken" ? "Missing link" : "Link not valid"}
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                {state === "notoken"
                  ? "This page needs a confirmation token. Use the link from your email."
                  : message}
              </p>
              <p className="text-xs text-gray-400">
                Signed in? Open your{" "}
                <Link href="/dashboard" className="text-[#2D8FCE] font-medium">
                  dashboard
                </Link>{" "}
                to send a fresh link.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
