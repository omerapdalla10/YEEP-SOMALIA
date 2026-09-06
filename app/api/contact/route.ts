import type { NextRequest } from "next/server";
import { route } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { listQuery } from "@/lib/api/list-query";
import { ok, created } from "@/lib/api/response";
import { requireRole } from "@/lib/api/auth";
import { contactMessageSchema } from "@/lib/validators";
import { ContactMessage } from "@/models/ContactMessage";

/** POST /api/contact — public contact form. */
export const POST = route(async (req: NextRequest) => {
  const body = await parseBody(req, contactMessageSchema);
  const message = await ContactMessage.create(body);
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
