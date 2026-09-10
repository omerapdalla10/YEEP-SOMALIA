import { img } from "@/lib/client/img";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Round photo with an initials fallback when no image is set — so real people
 * never appear next to a random stock face.
 */
export function Avatar({
  src,
  name,
  size = 96,
  params = "w=200&h=200&fit=crop&auto=format",
  className = "",
}: {
  src?: string | null;
  name: string;
  size?: number;
  params?: string;
  className?: string;
}) {
  const url = img(src || undefined, params);
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        loading="lazy"
        style={{ width: size, height: size }}
        className={`rounded-full object-cover bg-gray-100 ${className}`}
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      className={`rounded-full flex items-center justify-center font-bold text-[#1F6BA0] bg-[#D4E6F4] select-none ${className}`}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}
