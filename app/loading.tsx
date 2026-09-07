import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <Loader2 size={30} className="animate-spin text-[#2D8FCE]" />
    </div>
  );
}
