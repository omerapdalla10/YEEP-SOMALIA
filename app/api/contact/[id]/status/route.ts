import { route, type IdContext } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { requireRole } from "@/lib/api/auth";
import { contactStatusSchema } from "@/lib/validators";
import { ContactMessage } from "@/models/ContactMessage";

/** PATCH /api/contact/:id/status — staff updates the inbox status. */
export const PATCH = route<IdContext>(async (req, ctx) => {
  await requireRole(req, "staff");
  const { id } = await ctx.params;
  const { status } = await parseBody(req, contactStatusSchema);

  const item = await ContactMessage.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  );
  if (!item) throw ApiError.notFound("That message could not be found.");
  return ok(item);
});
