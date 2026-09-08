import { appUrl } from "@/lib/env";
import {
  SUPPORT_EMAIL,
  INK,
  SUB,
  TINT,
  BLUE_DARK,
  emailShell,
  heading,
  paragraph,
  button,
  signoff,
  escapeHtml,
} from "./layout";

interface EventInfo {
  title: string;
  dateLabel?: string;
  timeLabel?: string;
  location?: string;
}

/** Confirmation email sent when a member RSVPs to an event. */
export function eventRegisteredEmail(
  name: string,
  ev: EventInfo,
): { subject: string; html: string; text: string } {
  const firstName = name.trim().split(/\s+/)[0] || "there";
  const subject = `You're registered: ${ev.title}`;
  const when = [ev.dateLabel, ev.timeLabel].filter(Boolean).join(" · ");

  const text = [
    `Hi ${firstName},`,
    "",
    `You're registered for "${ev.title}".`,
    "",
    when ? `When:  ${when}` : "",
    ev.location ? `Where: ${ev.location}` : "",
    "",
    "We've attached a calendar invite (.ics) — open it to add the event to your",
    "calendar. You can manage or cancel your registration from your dashboard.",
    "",
    `Dashboard: ${appUrl}/dashboard`,
    "",
    "See you there!",
    `— The YEEP Somalia Team · ${SUPPORT_EMAIL}`,
  ]
    .filter(Boolean)
    .join("\n");

  const body = [
    heading("You're registered! \u{1F389}"),
    paragraph(`Hi <strong style="color:${INK};">${escapeHtml(firstName)}</strong>,`),
    paragraph(
      `Your spot at <strong style="color:${INK};">${escapeHtml(ev.title)}</strong> is confirmed.`,
    ),
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${TINT};border-radius:12px;margin:8px 0 16px;">
      <tr><td style="padding:16px 20px;font-size:14px;line-height:1.8;color:${INK};">
        ${when ? `<strong>When:</strong> ${escapeHtml(when)}<br>` : ""}
        ${ev.location ? `<strong>Where:</strong> ${escapeHtml(ev.location)}` : ""}
      </td></tr>
    </table>`,
    paragraph(
      `<span style="color:${SUB};">A calendar invite (<code>.ics</code>) is attached &mdash; ` +
        "open it to add this to your calendar.</span>",
    ),
    button("Manage in my dashboard", `${appUrl}/dashboard`),
    paragraph(
      "Need to cancel? You can do that from your dashboard or the events page. Questions? " +
        `<a href="mailto:${SUPPORT_EMAIL}" style="color:${BLUE_DARK};text-decoration:none;">${SUPPORT_EMAIL}</a>.`,
    ),
    signoff(),
  ].join("\n");

  return {
    subject,
    text,
    html: emailShell({
      title: subject,
      preheader: `Your spot at ${ev.title} is confirmed.`,
      body,
    }),
  };
}
