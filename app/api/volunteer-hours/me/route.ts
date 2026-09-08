import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { requireUser } from "@/lib/api/auth";
import { VolunteerHours } from "@/models/VolunteerHours";
import { Event } from "@/models/Event";

/** GET /api/volunteer-hours/me — the current member's own time log + totals. */
export const GET = route(async (req: NextRequest) => {
  const user = await requireUser(req);

  const entries = await VolunteerHours.find({ user: user.id })
    .sort("-date")
    .populate({ path: "event", select: "title", model: Event });

  const approved = entries
    .filter((e) => e.status === "Approved")
    .reduce((sum, e) => sum + e.hours, 0);
  const pending = entries
    .filter((e) => e.status === "Pending")
    .reduce((sum, e) => sum + e.hours, 0);

  return ok({ entries, totals: { approved, pending } });
});
