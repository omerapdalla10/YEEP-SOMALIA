import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { listQuery } from "@/lib/api/list-query";
import { ok, done } from "@/lib/api/response";
import { requireRole } from "@/lib/api/auth";
import { rateLimit } from "@/lib/api/rate-limit";
import { newsletterSchema } from "@/lib/validators";
import { Subscriber } from "@/models/Subscriber";

/** POST /api/newsletter — public subscription (idempotent). */
export const POST = route(async (req: NextRequest) => {
  rateLimit(req, "newsletter", { limit: 5, windowMs: 10 * 60 * 1000 });
  const { email, source } = await parseBody(req, newsletterSchema);

  const existing = await Subscriber.findOne({ email });
  if (existing) {
    if (!existing.active) {
      existing.active = true;
      await existing.save();
    }
    return done("You are subscribed");
  }

  await Subscriber.create({ email, source });
  return done("Subscribed", 201);
});

/** GET /api/newsletter — staff list of subscribers. */
export const GET = route(async (req: NextRequest) => {
  await requireRole(req, "staff");
  const { data, pagination } = await listQuery(Subscriber, req.nextUrl.searchParams, {
    defaultLimit: 50,
  });
  return ok(data, { pagination });
});
