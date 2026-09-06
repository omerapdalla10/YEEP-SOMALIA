import { route, type IdContext } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { requireRole } from "@/lib/api/auth";
import { volunteerStatusSchema } from "@/lib/validators";
import { Volunteer } from "@/models/Volunteer";

/** PATCH /api/volunteers/:id/status — staff review decision. */
export const PATCH = route<IdContext>(async (req, ctx) => {
  await requireRole(req, "staff");
  const { id } = await ctx.params;
  const { status, reviewNote } = await parseBody(req, volunteerStatusSchema);

  const item = await Volunteer.findByIdAndUpdate(
    id,
    { status, reviewNote },
    { new: true, runValidators: true },
  );
  if (!item) {
    throw ApiError.notFound("That volunteer application could not be found.");
  }
  return ok(item);
});
