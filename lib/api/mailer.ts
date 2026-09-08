import nodemailer, { type Transporter } from "nodemailer";
import { emailEnabled, smtp } from "@/lib/env";

let transporter: Transporter | null = null;

function getTransport(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
    });
  }
  return transporter;
}

export interface MailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface Mail {
  to: string;
  subject: string;
  html: string;
  /** Plain-text fallback for clients that don't render HTML. */
  text: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}

/**
 * Send one transactional email. Never throws — a mail failure must not break
 * the request that triggered it. Returns `true` when the message was handed
 * to the SMTP server, `false` when email is disabled or the send failed.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  if (!emailEnabled) {
    console.warn(`[mail] skipped "${mail.subject}" → ${mail.to} (SMTP not configured)`);
    return false;
  }
  try {
    await getTransport().sendMail({
      from: smtp.from,
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      replyTo: mail.replyTo,
      attachments: mail.attachments,
    });
    return true;
  } catch (err) {
    console.error(`[mail] failed to send "${mail.subject}" → ${mail.to}:`, err);
    return false;
  }
}
