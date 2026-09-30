import type { NextRequest } from "next/server";
import { ApiError } from "./errors";

/**
 * In-process, per-IP sliding-window rate limiter for public write endpoints
 * (login, contact, volunteer apply, event RSVP, newsletter). Throws
 * `ApiError.tooManyRequests()` once the caller exceeds `limit` requests
 * inside `windowMs`.
 *
 * Caveat: state lives in memory, per Node process. That's enough to blunt a
 * single abusive client on a long-running server (Docker/VPS), but on
 * serverless (Vercel) each cold instance starts its own empty counter, so
 * this is best-effort defence-in-depth — not a substitute for a shared store
 * (e.g. Upstash Redis) or the platform's own edge rate limiting if the
 * site sees real abuse.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

// Keep the map from growing unbounded — sweep expired entries occasionally.
let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, entry] of buckets) {
    if (entry.resetAt < now) buckets.delete(key);
  }
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Enforce `limit` requests per `windowMs` per client IP, scoped to `bucket`
 * (a short name for the endpoint, e.g. "login"). Call at the top of a route
 * handler before doing any work.
 */
export function rateLimit(
  req: NextRequest,
  bucket: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): void {
  const now = Date.now();
  sweep(now);

  const key = `${bucket}:${clientIp(req)}`;
  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  entry.count += 1;
  if (entry.count > limit) {
    throw ApiError.tooManyRequests();
  }
}
