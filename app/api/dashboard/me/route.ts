import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { requireUser } from "@/lib/api/auth";
import { Volunteer } from "@/models/Volunteer";
import { Event } from "@/models/Event";
import { EventRegistration } from "@/models/EventRegistration";

/** GET /api/dashboard/me — summary for the signed-in member's dashboard. */
export const GET = route(async (req: NextRequest) => {
  const user = await requireUser(req);

  const [applications, upcomingEvents, registrations] = await Promise.all([
    Volunteer.find({ user: user.id }).sort("-createdAt"),
    Event.find({ startDate: { $gte: new Date() } })
      .sort("startDate")
      .limit(5),
    EventRegistration.find({ user: user.id, status: "Registered" }).select("event"),
  ]);

  const approved = applications.filter((a) => a.status === "Approved").length;
  const pending = applications.filter(
    (a) => a.status === "Pending" || a.status === "Under Review",
  ).length;

  const registeredEventIds = registrations.map((r) => String(r.event));

  return ok({
    profile: user,
    applications,
    counts: {
      total: applications.length,
      approved,
      pending,
      programsJoined: approved,
    },
    upcomingEvents,
    registeredEventIds,
  });
});
