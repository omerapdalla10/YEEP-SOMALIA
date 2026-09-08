import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { cronSecret } from "@/lib/env";
import { sendMail } from "@/lib/api/mailer";
import { eventReminderEmail } from "@/lib/api/emails/event-reminder";
import { Event } from "@/models/Event";
import { EventRegistration } from "@/models/EventRegistration";
import { User } from "@/models/User";

/** Hours before an event that the reminder goes out. */
const LEAD_HOURS = Number(process.env.REMINDER_LEAD_HOURS ?? 48);

function authorized(req: NextRequest): boolean {
  if (!cronSecret) return false;
  const bearer = req.headers.get("authorization");
  if (bearer === `Bearer ${cronSecret}`) return true;
  return req.nextUrl.searchParams.get("key") === cronSecret;
}

/**
 * GET /api/cron/event-reminders — emails everyone registered for an event that
 * starts within the next LEAD_HOURS and hasn't been reminded yet. Idempotent:
 * each registration is reminded at most once (`reminderSentAt`). Call it on a
 * schedule (Vercel Cron / an external scheduler) with the CRON_SECRET.
 */
export const GET = route(async (req: NextRequest) => {
  if (!authorized(req)) throw ApiError.unauthorized("Bad or missing cron key.");

  const now = new Date();
  const until = new Date(now.getTime() + LEAD_HOURS * 60 * 60 * 1000);

  const events = await Event.find({
    published: true,
    startDate: { $gt: now, $lte: until },
  }).select("title dateLabel timeLabel location startDate");

  let sent = 0;
  const perEvent: Record<string, number> = {};

  for (const ev of events) {
    const regs = await EventRegistration.find({
      event: ev._id,
      status: "Registered",
      reminderSentAt: { $exists: false },
    }).populate({ path: "user", select: "name email", model: User });

    for (const reg of regs) {
      const u = reg.user as unknown as { name?: string; email?: string } | null;
      if (!u?.email) continue;
      const mail = eventReminderEmail(u.name ?? "there", {
        title: ev.title,
        dateLabel: ev.dateLabel ?? undefined,
        timeLabel: ev.timeLabel ?? undefined,
        location: ev.location ?? undefined,
      });
      await sendMail({ to: u.email, ...mail });
      reg.reminderSentAt = new Date();
      await reg.save();
      sent++;
      perEvent[ev.title] = (perEvent[ev.title] ?? 0) + 1;
    }
  }

  return ok({ eventsChecked: events.length, remindersSent: sent, perEvent });
});
