/**
 * Resolve an image reference to a delivery URL. Values may be:
 *  - an ImageKit URL (ik.imagekit.io) → resize params are injected as `?tr=`
 *  - a full http(s) URL or a `data:` URL → returned as-is
 *  - a bare Unsplash photo id (e.g. "photo-1509062522246-…") → Unsplash CDN
 *
 * `params` uses the Unsplash query style ("w=600&h=400&fit=crop&auto=format");
 * width/height are translated to ImageKit's `tr` syntax for ImageKit URLs.
 * Returns `undefined` when there is no reference, so callers can pass the
 * result straight to `src` without an empty string.
 */
export function img(
  ref: string | undefined | null,
  params = "w=600&h=400&fit=crop&auto=format",
): string | undefined {
  if (!ref) return undefined;
  if (ref.startsWith("data:")) return ref;

  if (ref.includes("ik.imagekit.io")) {
    const w = params.match(/w=(\d+)/)?.[1];
    const h = params.match(/h=(\d+)/)?.[1];
    const tr = [w && `w-${w}`, h && `h-${h}`, (w || h) && "fo-auto"].filter(Boolean).join(",");
    if (!tr) return ref;
    return `${ref}${ref.includes("?") ? "&" : "?"}tr=${tr}`;
  }

  if (ref.startsWith("http://") || ref.startsWith("https://")) return ref;
  return `https://images.unsplash.com/${ref}?${params}`;
}
