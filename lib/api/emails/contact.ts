import { appUrl } from "@/lib/env";
import {
  SUPPORT_EMAIL,
  WEBSITE,
  SIGNOFF_NAME,
  SIGNOFF_TITLE,
  INK,
  SUB,
  TINT,
  BLUE_DARK,
  emailShell,
  heading,
  paragraph,
  signoff,
  escapeHtml,
} from "./layout";

interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Internal notification to the team when a contact form is submitted. */
export function contactNotificationEmail(c: ContactInput): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `New contact message: ${c.subject}`;

  const text = [
    "New message from the website contact form.",
    "",
    `From:    ${c.name} <${c.email}>`,
    `Subject: ${c.subject}`,
    "",
    c.message,
    "",
    "---",
    `Reply directly to this email to respond to ${c.name}.`,
    `Manage all messages: ${appUrl}/admin`,
  ].join("\n");

  const body = [
    heading("New contact message"),
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${TINT};border-radius:12px;margin:8px 0 16px;">
      <tr><td style="padding:18px 20px;font-size:14px;color:${INK};line-height:1.7;">
        <strong>From:</strong> ${escapeHtml(c.name)}
        &lt;<a href="mailto:${escapeHtml(c.email)}" style="color:${BLUE_DARK};text-decoration:none;">${escapeHtml(c.email)}</a>&gt;<br>
        <strong>Subject:</strong> ${escapeHtml(c.subject)}
      </td></tr>
    </table>`,
    `<div style="font-size:15px;line-height:1.65;color:${SUB};white-space:pre-wrap;">${escapeHtml(c.message)}</div>`,
    paragraph(
      `<span style="color:${SUB};font-size:13px;">Reply directly to this email to respond, or ` +
        `<a href="${appUrl}/admin" style="color:${BLUE_DARK};text-decoration:none;">open the admin inbox</a>.</span>`,
    ),
  ].join("\n");

  return {
    subject,
    text,
    html: emailShell({
      title: subject,
      preheader: `${c.name}: ${c.subject}`,
      body,
    }),
  };
}

/** Auto-acknowledgement sent back to whoever submitted the form. */
export function contactAckEmail(
  name: string,
  subject: string,
): { subject: string; html: string; text: string } {
  const firstName = name.trim().split(/\s+/)[0] || "there";
  const mailSubject = "We've received your message — YEEP Somalia";

  const text = [
    `Hi ${firstName},`,
    "",
    "Thank you for reaching out to YEEP Somalia. We've received your message and a",
    "member of our team will get back to you as soon as possible.",
    "",
    `Your message: "${subject}"`,
    "",
    "If it's urgent, you can also reach us at " + SUPPORT_EMAIL + ".",
    "",
    "Warm regards,",
    SIGNOFF_NAME,
    SIGNOFF_TITLE,
    "YEEP Somalia",
    `${SUPPORT_EMAIL} - ${WEBSITE}`,
  ].join("\n");

  const body = [
    heading("Thanks — we've got your message"),
    paragraph(`Hi <strong style="color:${INK};">${escapeHtml(firstName)}</strong>,`),
    paragraph(
      "Thank you for reaching out to YEEP Somalia. We've received your message and a member " +
        "of our team will get back to you as soon as possible.",
    ),
    paragraph(
      `<span style="color:${SUB};">Your message: </span>` +
        `<strong style="color:${INK};">${escapeHtml(subject)}</strong>`,
    ),
    paragraph(
      "If it's urgent, you can also reach us at " +
        `<a href="mailto:${SUPPORT_EMAIL}" style="color:${BLUE_DARK};text-decoration:none;">${SUPPORT_EMAIL}</a>.`,
    ),
    signoff(),
  ].join("\n");

  return {
    subject: mailSubject,
    text,
    html: emailShell({
      title: mailSubject,
      preheader: "A member of our team will get back to you soon.",
      body,
    }),
  };
}
