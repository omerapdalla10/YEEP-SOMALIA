import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { listQuery } from "@/lib/api/list-query";
import { ok, created } from "@/lib/api/response";
import { requireRole } from "@/lib/api/auth";
import { contactMessageSchema } from "@/lib/validators";
import { sendMail } from "@/lib/api/mailer";
import { contactNotificationEmail, contactAckEmail } from "@/lib/api/emails/contact";
import { SUPPORT_EMAIL } from "@/lib/api/emails/layout";
import { notify } from "@/lib/api/notify";
import { ContactMessage } from "@/models/ContactMessage";

const INBOX = process.env.CONTACT_INBOX || SUPPORT_EMAIL;

/** POST /api/contact — public contact form. */
export const POST = route(async (req: NextRequest) => {
  const body = await parseBody(req, contactMessageSchema);
  const message = await ContactMessage.create(body);

  // Fire-and-forget: notify the team, and acknowledge the sender.
  void sendMail({
    to: INBOX,
    replyTo: body.email,
    ...contactNotificationEmail(body),
  });
  void sendMail({ to: body.email, ...contactAckEmail(body.name, body.subject) });
  notify("contact_message", `${body.name}: "${body.subject}"`, {
    link: "messages",
    actorName: body.name,
  });

  return created({ id: message.id }, "Message received");
});

/** GET /api/contact — staff inbox. */
export const GET = route(async (req: NextRequest) => {
  await requireRole(req, "staff");
  const { data, pagination } = await listQuery(ContactMessage, req.nextUrl.searchParams, {
    filterable: ["status"],
  });
  return ok(data, { pagination });
});
