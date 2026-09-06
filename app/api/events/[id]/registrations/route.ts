import { route, type IdContext } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { requireRole } from "@/lib/api/auth";
import { Event } from "@/models/Event";
import { EventRegistration } from "@/models/EventRegistration";

/**
 * GET /api/events/:id/registrations — staff view of everyone registered for
 * an event, newest first, each with the member's name/email/phone/avatar.
 */
export const GET = route<IdContext>(async (req, ctx) => {
  await requireRole(req, "staff");
  const { id } = await ctx.params;

  const event = await Event.findById(id).select("title dateLabel capacity registered");
  if (!event) throw ApiError.notFound("That event could not be found.");

  const registrations = await EventRegistration.find({ event: id, status: "Registered" })
    .sort("-updatedAt")
    .populate("user", "name email phone avatar");

  return ok({
    event: {
      _id: String(event._id),
      title: event.title,
      dateLabel: event.dateLabel ?? "",
      capacity: event.capacity,
      registered: event.registered,
    },
    registrations: registrations
      .filter((r) => r.user)
      .map((r) => ({
        _id: String(r._id),
        registeredAt: r.get("updatedAt"),
        user: r.user,
      })),
  });
});
