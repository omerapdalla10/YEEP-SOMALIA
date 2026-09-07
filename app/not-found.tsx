import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6 py-16">
      <div className="w-full max-w-md text-center">
        <div className="text-[100px] font-black leading-none text-[#2D8FCE]/15 select-none">
          404
        </div>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2D8FCE] hover:bg-[#1F6BA0] text-white font-semibold rounded-xl transition-colors"
          >
            <Home size={16} /> Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 hover:border-[#2D8FCE] hover:text-[#2D8FCE] font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft size={16} /> Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
