import { route, type IdContext } from "@/lib/api/route";
import { ok, created } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { requireUser } from "@/lib/api/auth";
import { sendMail } from "@/lib/api/mailer";
import { eventRegisteredEmail } from "@/lib/api/emails/event-registered";
import { eventToIcs } from "@/lib/api/ics";
import { notify } from "@/lib/api/notify";
import { Event } from "@/models/Event";
import { EventRegistration } from "@/models/EventRegistration";

/** POST /api/events/:id/register — the signed-in member RSVPs to an event. */
export const POST = route<IdContext>(async (req, ctx) => {
  const user = await requireUser(req);
  const { id } = await ctx.params;

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

  const existing = await EventRegistration.findOne({ event: id, user: user.id });
  if (existing?.status === "Registered") {
    return ok(existing, { message: "You are already registered for this event." });
  }

  // Claim a seat atomically so two members can't take the last one.
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
    if (existing) {
      existing.status = "Registered";
      registration = await existing.save();
    } else {
      registration = await EventRegistration.create({
        event: id,
        user: user.id,
        status: "Registered",
      });
    }
  } catch (err) {
    // Roll the seat back if writing the RSVP row failed.
    await Event.updateOne({ _id: id, registered: { $gt: 0 } }, { $inc: { registered: -1 } });
    throw err;
  }

  notify("event_rsvp", `${user.name} registered for "${event.title}"`, {
    link: "events",
    actorName: user.name,
  });

  // Fire-and-forget: confirmation email with a calendar invite attached.
  const mail = eventRegisteredEmail(user.name, {
    title: event.title,
    dateLabel: event.dateLabel ?? undefined,
    timeLabel: event.timeLabel ?? undefined,
    location: event.location ?? undefined,
  });
  void sendMail({
    to: user.email,
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

  return created(registration, "You're registered.");
});

/** DELETE /api/events/:id/register — the member cancels their RSVP. */
export const DELETE = route<IdContext>(async (req, ctx) => {
  const user = await requireUser(req);
  const { id } = await ctx.params;

  const registration = await EventRegistration.findOne({
    event: id,
    user: user.id,
    status: "Registered",
  });
  if (!registration) {
    return ok(null, { message: "You are not registered for this event." });
  }

  registration.status = "Cancelled";
  await registration.save();
  await Event.updateOne({ _id: id, registered: { $gt: 0 } }, { $inc: { registered: -1 } });

  return ok(null, { message: "Your registration has been cancelled." });
});
