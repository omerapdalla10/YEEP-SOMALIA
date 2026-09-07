import Script from "next/script";

/**
 * Privacy-friendly, cookieless analytics. Renders whichever provider is
 * configured via env, or nothing at all.
 *
 *  Plausible: NEXT_PUBLIC_PLAUSIBLE_DOMAIN  (+ optional NEXT_PUBLIC_PLAUSIBLE_SRC)
 *  Umami:     NEXT_PUBLIC_UMAMI_WEBSITE_ID  (+ optional NEXT_PUBLIC_UMAMI_SRC)
 */
export default function Analytics() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (plausibleDomain) {
    const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";
    return <Script defer data-domain={plausibleDomain} src={src} strategy="afterInteractive" />;
  }

  if (umamiId) {
    const src = process.env.NEXT_PUBLIC_UMAMI_SRC || "https://cloud.umami.is/script.js";
    return <Script defer data-website-id={umamiId} src={src} strategy="afterInteractive" />;
  }

  return null;
}
