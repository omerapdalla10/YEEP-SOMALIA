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
  stepsBox,
  button,
  signoff,
  escapeHtml,
} from "./layout";

const NEXT_STEPS = [
  {
    title: "Watch for your orientation invite",
    desc: "We'll send the date, time and joining details for your volunteer orientation.",
  },
  {
    title: "Review the volunteer guidelines",
    desc: "A short handbook covering our values, safeguarding and what to expect in the role.",
  },
  {
    title: "Your coordinator will be in touch",
    desc: "They'll contact you to agree on your first activities and a schedule that works for you.",
  },
];

/**
 * Sent to an applicant when staff move their volunteer application to
 * "Approved". `name` and `role` come from the application record.
 */
export function volunteerApprovedEmail(
  name: string,
  role?: string,
): { subject: string; html: string; text: string } {
  const fullName = name.trim() || "there";
  const dashboardUrl = `${appUrl}/dashboard`;
  const roleLine = role ? ` for the role of ${role}` : "";
  const subject = "Congratulations — You're Now a YEEP Somalia Volunteer! \u{1F389}";

  const text = [
    `Dear ${fullName},`,
    "",
    `Congratulations! We're thrilled to let you know that your application to volunteer with`,
    `YEEP Somalia${roleLine} has been approved.`,
    "",
    "Thank you for stepping up and offering your time and skills to support our mission —",
    "people like you are what make our work possible.",
    "",
    "Here's what happens next:",
    ...NEXT_STEPS.map((s) => `  - ${s.title}: ${s.desc}`),
    "",
    "If you have any questions before then, feel free to reach out to us anytime.",
    "",
    "Once again, congratulations, and welcome to the YEEP Somalia volunteer team!",
    "",
    "Warm regards,",
    SIGNOFF_NAME,
    SIGNOFF_TITLE,
    "YEEP Somalia",
    `${SUPPORT_EMAIL} - ${WEBSITE}`,
  ].join("\n");

  const body = [
    heading("Congratulations — you're now a YEEP Somalia volunteer! \u{1F389}"),
    paragraph(`Dear <strong style="color:${INK};">${escapeHtml(fullName)}</strong>,`),
    paragraph(
      "Congratulations! We're thrilled to let you know that your application to volunteer with " +
        `YEEP Somalia${escapeHtml(roleLine)} has been <strong style="color:${INK};">approved</strong>.`,
    ),
    paragraph(
      "Thank you for stepping up and offering your time and skills to support our mission " +
        "&mdash; people like you are what make our work possible.",
    ),
    stepsBox("Here's what happens next", NEXT_STEPS),
    button("Open my dashboard", dashboardUrl),
    paragraph(
      "If you have any questions before then, feel free to reach out to us anytime at " +
        `<a href="mailto:${SUPPORT_EMAIL}" style="color:${BLUE_DARK};text-decoration:none;">${SUPPORT_EMAIL}</a>.`,
    ),
    `<p style="margin:0 0 4px;font-size:15px;line-height:1.65;color:${INK};font-weight:600;">Once again, congratulations, and welcome to the YEEP Somalia volunteer team!</p>`,
    signoff(),
  ].join("\n");

  return {
    subject,
    text,
    html: emailShell({
      title: subject,
      preheader: "Your volunteer application has been approved — welcome to the team.",
      body,
    }),
  };
}
