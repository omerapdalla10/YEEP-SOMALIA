import { route, type IdContext } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { ok, created } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { sendMail } from "@/lib/api/mailer";
import { eventRegisteredEmail } from "@/lib/api/emails/event-registered";
import { eventRsvpSchema } from "@/lib/validators";
import { eventToIcs } from "@/lib/api/ics";
import { notify } from "@/lib/api/notify";
import { Event } from "@/models/Event";
import { EventRegistration } from "@/models/EventRegistration";

/** POST /api/events/:id/register — public RSVP form submission. No account needed. */
export const POST = route<IdContext>(async (req, ctx) => {
  const { id } = await ctx.params;
  const body = await parseBody(req, eventRsvpSchema);

  const event = await Event.findById(id);
  if (!event || !event.published) {
    throw ApiError.notFound("That event could not be found.");
  }

  const now = new Date();
  if (event.startDate.getTime() <= now.getTime()) {
    throw ApiError.badRequest("This event has already started.");
  }
  if (event.registrationDeadline && event.registrationDeadline.getTime() < now.getTime()) {
    throw ApiError.badRequest("Registration for this event has closed.");
  }

  const existing = await EventRegistration.findOne({ event: id, email: body.email });
  if (existing) {
    return ok(existing, { message: "You're already registered for this event." });
  }

  // Claim a seat atomically so two people can't take the last one.
  if (event.capacity > 0) {
    const claimed = await Event.findOneAndUpdate(
      { _id: id, registered: { $lt: event.capacity } },
      { $inc: { registered: 1 } },
      { new: true },
    );
    if (!claimed) throw ApiError.conflict("This event is full.");
  } else {
    await Event.updateOne({ _id: id }, { $inc: { registered: 1 } });
  }

  let registration;
  try {
    registration = await EventRegistration.create({ event: id, ...body });
  } catch (err) {
    // Roll the seat back if writing the RSVP row failed.
    await Event.updateOne({ _id: id, registered: { $gt: 0 } }, { $inc: { registered: -1 } });
    throw err;
  }

  notify("event_rsvp", `${body.name} registered for "${event.title}"`, {
    link: "events",
    actorName: body.name,
  });

  // Fire-and-forget: confirmation email with a calendar invite attached.
  const mail = eventRegisteredEmail(body.name, {
    title: event.title,
    dateLabel: event.dateLabel ?? undefined,
    timeLabel: event.timeLabel ?? undefined,
    location: event.location ?? undefined,
  });
  void sendMail({
    to: body.email,
    ...mail,
    attachments: [
      {
        filename: "event.ics",
        contentType: "text/calendar",
        content: eventToIcs({
          id: String(event._id),
          title: event.title,
          description: event.description ?? undefined,
          location: event.location ?? undefined,
          start: event.startDate,
          end: event.endDate ?? undefined,
        }),
      },
    ],
  });

  return created(registration, "You're registered — check your email for confirmation.");
});
