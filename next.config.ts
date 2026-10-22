import type { NextConfig } from "next";

// Every external host this app actually talks to from the browser — keep this
// in sync with components/analytics.tsx, the gallery video embeds, and the
// contact page map. If you self-host analytics on another domain (via
// NEXT_PUBLIC_PLAUSIBLE_SRC / NEXT_PUBLIC_UMAMI_SRC), add that host here too.
// React's dev mode uses eval() to reconstruct component stacks; it never does
// in production, so only relax the policy for that under `next dev`.
const scriptSrc = [
  "script-src 'self' 'unsafe-inline' https://plausible.io https://cloud.umami.is",
  process.env.NODE_ENV !== "production" ? "'unsafe-eval'" : "",
]
  .filter(Boolean)
  .join(" ");

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "img-src 'self' data: https://images.unsplash.com https://ik.imagekit.io",
  "font-src 'self' data:",
  // Next.js injects its own bootstrap/theme scripts inline; a strict nonce-based
  // policy is a larger refactor, so this stays 'unsafe-inline' for now.
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://plausible.io https://cloud.umami.is",
  "frame-src https://www.youtube.com https://player.vimeo.com https://www.openstreetmap.org",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

// The panic in the build log comes from Next's native (Rust/tokio) runtime,
// which starts one thread per CPU in every build worker. On a host that reports
// 63 CPUs but limits threads per container, that exhausts the thread quota.
// Build workers are forked after this file loads, so they inherit the cap.
process.env.TOKIO_WORKER_THREADS ??= "4";

const nextConfig: NextConfig = {
  // These ship CJS/dynamic requires — keep them out of the bundler.
  serverExternalPackages: ["mongoose", "nodemailer", "imagekit"],

  // The build host reports 63 CPUs but caps threads per process, so the
  // default one-worker-per-CPU "Collecting page data" step aborts with
  // "OS can't spawn worker thread". Keep the worker pool small.
  experimental: {
    cpus: 2,
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
    ],
  },

  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
