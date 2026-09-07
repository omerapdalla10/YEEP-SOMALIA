"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6 py-16">
      <div className="w-full max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
          <RefreshCw size={24} className="text-red-500" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          An unexpected error occurred. Trying again often fixes it.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-gray-400">Reference: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => retry()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white font-semibold rounded-xl transition-colors"
          >
            <RefreshCw size={16} /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 hover:border-[#2D8FCE] hover:text-[#2D8FCE] font-semibold rounded-xl transition-colors"
          >
            <Home size={16} /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
