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
    title: "Access your dashboard",
    desc: "Manage your profile, notifications and everything you apply for in one place.",
  },
  {
    title: "Register for upcoming events",
    desc: "RSVP to forums, workshops and community dialogues near you.",
  },
  {
    title: "Apply for a volunteer role",
    desc: "Browse open positions and join a programme that matches your interests.",
  },
];

/**
 * Welcome / congratulations email sent when a new member account is created —
 * whether they signed up with email + password or with Google. `name` is the
 * real name from the account.
 */
export function welcomeEmail(name: string): { subject: string; html: string; text: string } {
  const fullName = name.trim() || "there";
  const dashboardUrl = `${appUrl}/dashboard`;
  const subject = "Welcome to YEEP Somalia! \u{1F389}";

  const text = [
    `Dear ${fullName},`,
    "",
    "Congratulations and welcome to YEEP Somalia!",
    "",
    "We're excited to have you join our community. Your registration has been",
    "successfully completed, and we're thrilled to have you on board.",
    "",
    "Here's what you can expect next:",
    ...NEXT_STEPS.map((s) => `  - ${s.title}: ${s.desc}`),
    "",
    "If you have any questions at all, please don't hesitate to reach out to us —",
    "we're here to help.",
    "",
    "Once again, welcome to the YEEP Somalia family!",
    "",
    "Warm regards,",
    SIGNOFF_NAME,
    SIGNOFF_TITLE,
    "YEEP Somalia",
    `${SUPPORT_EMAIL} - ${WEBSITE}`,
  ].join("\n");

  const body = [
    heading("Welcome to YEEP Somalia! \u{1F389}"),
    paragraph(`Dear <strong style="color:${INK};">${escapeHtml(fullName)}</strong>,`),
    paragraph(
      "Congratulations and welcome to YEEP Somalia! We're excited to have you join our " +
        "community. Your registration has been successfully completed, and we're thrilled to " +
        "have you on board.",
    ),
    stepsBox("Here's what you can expect next", NEXT_STEPS),
    button("Go to my dashboard", dashboardUrl),
    paragraph(
      "If you have any questions at all, please don't hesitate to reach out to us at " +
        `<a href="mailto:${SUPPORT_EMAIL}" style="color:${BLUE_DARK};text-decoration:none;">${SUPPORT_EMAIL}</a> ` +
        "&mdash; we're here to help.",
    ),
    `<p style="margin:0 0 4px;font-size:15px;line-height:1.65;color:${INK};font-weight:600;">Once again, welcome to the YEEP Somalia family!</p>`,
    signoff(),
  ].join("\n");

  return {
    subject,
    text,
    html: emailShell({
      title: subject,
      preheader: "Your YEEP Somalia account is ready — welcome to the family.",
      body,
    }),
  };
}
