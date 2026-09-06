import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { listQuery } from "@/lib/api/list-query";
import { ok } from "@/lib/api/response";
import { requireRole } from "@/lib/api/auth";
import { Volunteer } from "@/models/Volunteer";

/** GET /api/volunteers — staff list of volunteer applications. */
export const GET = route(async (req: NextRequest) => {
  await requireRole(req, "staff");
  const { data, pagination } = await listQuery(Volunteer, req.nextUrl.searchParams, {
    filterable: ["status"],
    transform: (q) => q.populate("user", "name email avatar"),
  });
  return ok(data, { pagination });
});
