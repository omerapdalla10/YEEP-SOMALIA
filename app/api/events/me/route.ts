import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { requireUser } from "@/lib/api/auth";
import { EventRegistration } from "@/models/EventRegistration";

/**
 * GET /api/events/me — the events the signed-in member has RSVP'd to,
 * newest registration first, each with the event populated.
 */
export const GET = route(async (req: NextRequest) => {
  const user = await requireUser(req);

  const registrations = await EventRegistration.find({ user: user.id, status: "Registered" })
    .sort("-updatedAt")
    .populate("event");

  return ok(registrations.filter((r) => r.event));
});
