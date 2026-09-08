import { appUrl } from "@/lib/env";
import {
  SUPPORT_EMAIL,
  INK,
  SUB,
  TINT,
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

/** "Your event is coming up" reminder, sent a couple of days before. */
export function eventReminderEmail(
  name: string,
  ev: EventInfo,
): { subject: string; html: string; text: string } {
  const firstName = name.trim().split(/\s+/)[0] || "there";
  const subject = `Reminder: ${ev.title} is coming up`;
  const when = [ev.dateLabel, ev.timeLabel].filter(Boolean).join(" · ");

  const text = [
    `Hi ${firstName},`,
    "",
    `This is a friendly reminder that you're registered for "${ev.title}".`,
    "",
    when ? `When:  ${when}` : "",
    ev.location ? `Where: ${ev.location}` : "",
    "",
    "If you can no longer make it, please cancel from your dashboard so someone",
    "on the waiting list can take your place.",
    "",
    `Dashboard: ${appUrl}/dashboard`,
    "",
    `— The YEEP Somalia Team · ${SUPPORT_EMAIL}`,
  ]
    .filter(Boolean)
    .join("\n");

  const body = [
    heading("See you soon \u{1F44B}"),
    paragraph(`Hi <strong style="color:${INK};">${escapeHtml(firstName)}</strong>,`),
    paragraph(
      `A quick reminder that you're registered for ` +
        `<strong style="color:${INK};">${escapeHtml(ev.title)}</strong>.`,
    ),
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${TINT};border-radius:12px;margin:8px 0 16px;">
      <tr><td style="padding:16px 20px;font-size:14px;line-height:1.8;color:${INK};">
        ${when ? `<strong>When:</strong> ${escapeHtml(when)}<br>` : ""}
        ${ev.location ? `<strong>Where:</strong> ${escapeHtml(ev.location)}` : ""}
      </td></tr>
    </table>`,
    paragraph(
      `<span style="color:${SUB};">Can't make it any more? Please cancel from your ` +
        "dashboard so we can offer your place to someone else.</span>",
    ),
    button("Open my dashboard", `${appUrl}/dashboard`),
    signoff(),
  ].join("\n");

  return {
    subject,
    text,
    html: emailShell({
      title: subject,
      preheader: `${ev.title} is coming up${when ? ` — ${when}` : ""}.`,
      body,
    }),
  };
}
