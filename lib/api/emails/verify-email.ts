import {
  SUPPORT_EMAIL,
  INK,
  BLUE_DARK,
  emailShell,
  heading,
  paragraph,
  button,
  signoff,
  escapeHtml,
} from "./layout";

/** Sent after sign-up: confirm the email address owns this account. */
export function verifyEmailEmail(
  name: string,
  url: string,
): { subject: string; html: string; text: string } {
  const firstName = name.trim().split(/\s+/)[0] || "there";
  const subject = "Confirm your email — YEEP Somalia";

  const text = [
    `Hi ${firstName},`,
    "",
    "Please confirm this email address so we know it's really you.",
    "Open this link (valid for 24 hours):",
    "",
    url,
    "",
    "If you didn't create a YEEP Somalia account, you can ignore this email.",
    "",
    `— The YEEP Somalia Team · ${SUPPORT_EMAIL}`,
  ].join("\n");

  const body = [
    heading("Confirm your email"),
    paragraph(`Hi <strong style="color:${INK};">${escapeHtml(firstName)}</strong>,`),
    paragraph(
      "Thanks for joining YEEP Somalia. Please confirm this email address so we can keep " +
        "your account secure and send you the updates you asked for.",
    ),
    button("Confirm my email", url),
    paragraph(
      `This link is valid for <strong style="color:${INK};">24 hours</strong>. If you didn't ` +
        "create an account, you can safely ignore this email.",
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
      preheader: "Confirm your email address to finish setting up your account.",
      body,
    }),
  };
}
