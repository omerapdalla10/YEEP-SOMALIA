import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { requireUser } from "@/lib/api/auth";
import { Volunteer } from "@/models/Volunteer";

/** GET /api/volunteers/me — the current user's own applications. */
export const GET = route(async (req: NextRequest) => {
  const user = await requireUser(req);
  const items = await Volunteer.find({ user: user.id }).sort("-createdAt");
  return ok(items);
});
