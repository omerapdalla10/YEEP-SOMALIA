import { appUrl } from "@/lib/env";
import {
  SUPPORT_EMAIL,
  WEBSITE,
  SIGNOFF_NAME,
  SIGNOFF_TITLE,
  INK,
  BLUE_DARK,
  emailShell,
  heading,
  paragraph,
  button,
  signoff,
  escapeHtml,
} from "./layout";

/**
 * Sent to an applicant when staff move their volunteer application to
 * "Rejected". Kept warm and encouraging — a "not this time", not a door
 * closing. `note` is the optional review note staff added.
 */
export function volunteerRejectedEmail(
  name: string,
  role?: string,
  note?: string,
): { subject: string; html: string; text: string } {
  const firstName = name.trim().split(/\s+/)[0] || "there";
  const roleLine = role ? ` for ${role}` : "";
  const subject = "An update on your YEEP Somalia volunteer application";

  const text = [
    `Dear ${firstName},`,
    "",
    `Thank you for applying to volunteer with YEEP Somalia${roleLine}, and for your`,
    "interest in our mission.",
    "",
    "After careful review, we're not able to move forward with your application at",
    "this time. This was a difficult decision and it does not reflect on your",
    "commitment or ability.",
    ...(note ? ["", `A note from our team: ${note}`] : []),
    "",
    "We'd genuinely welcome a future application from you — new roles open",
    "regularly, and you can also join our events and community in the meantime.",
    "",
    "Thank you again for stepping forward.",
    "",
    "Warm regards,",
    SIGNOFF_NAME,
    SIGNOFF_TITLE,
    "YEEP Somalia",
    `${SUPPORT_EMAIL} - ${WEBSITE}`,
  ].join("\n");

  const body = [
    heading("An update on your application"),
    paragraph(`Dear <strong style="color:${INK};">${escapeHtml(firstName)}</strong>,`),
    paragraph(
      `Thank you for applying to volunteer with YEEP Somalia${escapeHtml(roleLine)}, and for ` +
        "your interest in our mission.",
    ),
    paragraph(
      "After careful review, we're not able to move forward with your application at this " +
        "time. This was a difficult decision and it does not reflect on your commitment or " +
        "ability.",
    ),
    note
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;border-radius:12px;margin:8px 0 16px;">
          <tr><td style="padding:16px 18px;font-size:14px;line-height:1.6;color:${INK};">
            <strong>A note from our team:</strong><br>${escapeHtml(note)}
          </td></tr>
        </table>`
      : "",
    paragraph(
      "We'd genuinely welcome a future application from you &mdash; new roles open regularly. " +
        "In the meantime, you're very welcome at our events and in our community.",
    ),
    button("See open opportunities", `${appUrl}/volunteer`),
    paragraph("Thank you again for stepping forward."),
    paragraph(
      "Questions? Reach us at " +
        `<a href="mailto:${SUPPORT_EMAIL}" style="color:${BLUE_DARK};text-decoration:none;">${SUPPORT_EMAIL}</a>.`,
    ),
    signoff(),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    text,
    html: emailShell({
      title: subject,
      preheader: "An update on your volunteer application — and an invitation to apply again.",
      body,
    }),
  };
}
