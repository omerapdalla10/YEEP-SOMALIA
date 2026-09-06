import { route, type IdContext } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { requireRole } from "@/lib/api/auth";
import { Volunteer } from "@/models/Volunteer";

const NOT_FOUND = "That volunteer application could not be found.";

export const GET = route<IdContext>(async (req, ctx) => {
  await requireRole(req, "staff");
  const { id } = await ctx.params;
  const item = await Volunteer.findById(id).populate("user", "name email avatar");
  if (!item) throw ApiError.notFound(NOT_FOUND);
  return ok(item);
});

export const DELETE = route<IdContext>(async (req, ctx) => {
  await requireRole(req, "staff");
  const { id } = await ctx.params;
  const item = await Volunteer.findByIdAndDelete(id);
  if (!item) throw ApiError.notFound(NOT_FOUND);
  return ok({ id });
});
