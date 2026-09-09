import { appUrl } from "@/lib/env";

/**
 * Fetch one API resource from a Server Component. Returns `null` on any
 * non-2xx (so pages can call `notFound()`), and never caches — content is
 * edited in the admin and should reflect immediately.
 */
export async function getResource<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${appUrl}${path.startsWith("/") ? "" : "/"}${path}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { success?: boolean; data?: T };
    return body?.success ? (body.data ?? null) : null;
  } catch {
    return null;
  }
}

/** Fetch a list resource; returns `[]` on failure. */
export async function getCollection<T>(path: string): Promise<T[]> {
  const data = await getResource<T[]>(path);
  return Array.isArray(data) ? data : [];
}
