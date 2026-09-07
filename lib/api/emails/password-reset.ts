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
 * Sent when someone requests a password reset. `url` already contains the
 * one-time token. Valid for one hour.
 */
export function passwordResetEmail(
  name: string,
  url: string,
): { subject: string; html: string; text: string } {
  const firstName = name.trim().split(/\s+/)[0] || "there";
  const subject = "Reset your YEEP Somalia password";

  const text = [
    `Hi ${firstName},`,
    "",
    "We received a request to reset the password for your YEEP Somalia account.",
    "Open this link to choose a new password (it expires in 1 hour):",
    "",
    url,
    "",
    "If you didn't ask for this, you can safely ignore this email — your password",
    "will not change.",
    "",
    "Warm regards,",
    SIGNOFF_NAME,
    SIGNOFF_TITLE,
    "YEEP Somalia",
    `${SUPPORT_EMAIL} - ${WEBSITE}`,
  ].join("\n");

  const body = [
    heading("Reset your password"),
    paragraph(`Hi <strong style="color:${INK};">${escapeHtml(firstName)}</strong>,`),
    paragraph(
      "We received a request to reset the password for your YEEP Somalia account. " +
        "Click the button below to choose a new one.",
    ),
    button("Choose a new password", url),
    paragraph(
      `This link expires in <strong style="color:${INK};">1 hour</strong>. ` +
        "If you didn't request a reset, you can safely ignore this email &mdash; your " +
        "password will not change.",
    ),
    paragraph(
      "Button not working? Paste this into your browser:<br>" +
        `<span style="word-break:break-all;color:${BLUE_DARK};">${escapeHtml(url)}</span>`,
    ),
    signoff(),
  ].join("\n");

  return {
    subject,
    text,
    html: emailShell({
      title: subject,
      preheader: "Choose a new password — this link expires in 1 hour.",
      body,
    }),
  };
}
