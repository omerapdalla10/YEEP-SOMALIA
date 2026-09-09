import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { ok } from "@/lib/api/response";
import { requireRole } from "@/lib/api/auth";
import { siteContentSchema } from "@/lib/validators";
import { SiteContent, SITE_CONTENT_KEY } from "@/models/SiteContent";

/** GET /api/site-content — the editable site images (public). */
export const GET = route(async () => {
  const doc = await SiteContent.findOneAndUpdate(
    { key: SITE_CONTENT_KEY },
    { $setOnInsert: { key: SITE_CONTENT_KEY } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return ok(doc);
});

/** PATCH /api/site-content — staff updates one or more images. */
export const PATCH = route(async (req: NextRequest) => {
  await requireRole(req, "staff");
  const body = await parseBody(req, siteContentSchema.partial());
  const doc = await SiteContent.findOneAndUpdate(
    { key: SITE_CONTENT_KEY },
    { $set: body },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return ok(doc);
});
