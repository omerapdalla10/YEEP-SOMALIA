import { route, type IdContext } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { requireRole } from "@/lib/api/auth";
import { Subscriber } from "@/models/Subscriber";

export const DELETE = route<IdContext>(async (req, ctx) => {
  await requireRole(req, "staff");
  const { id } = await ctx.params;
  const item = await Subscriber.findByIdAndDelete(id);
  if (!item) throw ApiError.notFound("That subscriber could not be found.");
  return ok({ id });
});
