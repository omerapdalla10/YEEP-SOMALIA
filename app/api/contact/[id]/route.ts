import { route, type IdContext } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { requireRole } from "@/lib/api/auth";
import { ContactMessage } from "@/models/ContactMessage";

const NOT_FOUND = "That message could not be found.";

/** GET /api/contact/:id — staff; marks a "New" message as "Read". */
export const GET = route<IdContext>(async (req, ctx) => {
  await requireRole(req, "staff");
  const { id } = await ctx.params;
  const item = await ContactMessage.findById(id);
  if (!item) throw ApiError.notFound(NOT_FOUND);
  if (item.status === "New") {
    item.status = "Read";
    await item.save();
  }
  return ok(item);
});

export const DELETE = route<IdContext>(async (req, ctx) => {
  await requireRole(req, "staff");
  const { id } = await ctx.params;
  const item = await ContactMessage.findByIdAndDelete(id);
  if (!item) throw ApiError.notFound(NOT_FOUND);
  return ok({ id });
});
