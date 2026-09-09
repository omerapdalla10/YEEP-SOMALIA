"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { XIcon, FacebookIcon, LinkedinIcon, WhatsappIcon } from "@/components/brand-icons";

export default function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
  const t = encodeURIComponent(title);
  const u = encodeURIComponent(url);

  const links = [
    { label: "Share on X", href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`, Icon: XIcon },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: FacebookIcon },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: LinkedinIcon },
    { label: "Share on WhatsApp", href: `https://wa.me/?text=${t}%20${u}`, Icon: WhatsappIcon },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-gray-400 mr-1">Share</span>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-[#2D8FCE] hover:text-white text-gray-500 flex items-center justify-center transition-colors"
        >
          <Icon size={15} />
        </a>
      ))}
      <button
        onClick={copy}
        aria-label="Copy link"
        className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-[#2D8FCE] hover:text-white text-gray-500 flex items-center justify-center transition-colors"
      >
        {copied ? <Check size={15} /> : <Link2 size={15} />}
      </button>
    </div>
  );
}
