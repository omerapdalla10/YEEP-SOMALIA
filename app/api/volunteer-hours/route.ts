import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { listQuery } from "@/lib/api/list-query";
import { ok, created } from "@/lib/api/response";
import { requireRole, requireUser } from "@/lib/api/auth";
import { volunteerHoursSchema } from "@/lib/validators";
import { VolunteerHours } from "@/models/VolunteerHours";
import { User } from "@/models/User";
import { Event } from "@/models/Event";

/** POST /api/volunteer-hours — a member logs volunteer time (goes to Pending). */
export const POST = route(async (req: NextRequest) => {
  const user = await requireUser(req);
  const body = await parseBody(req, volunteerHoursSchema);

  const entry = await VolunteerHours.create({
    user: user.id,
    activity: body.activity,
    hours: body.hours,
    date: body.date,
    event: body.event || undefined,
  });
  return created(entry);
});

/** GET /api/volunteer-hours — staff review list (filter by ?status= / ?user=). */
export const GET = route(async (req: NextRequest) => {
  await requireRole(req, "staff");
  const { data, pagination } = await listQuery(VolunteerHours, req.nextUrl.searchParams, {
    filterable: ["status", "user"],
    defaultSort: "-createdAt",
    transform: (q) =>
      q
        .populate({ path: "user", select: "name email avatar", model: User })
        .populate({ path: "event", select: "title", model: Event }),
  });
  return ok(data, { pagination });
});
