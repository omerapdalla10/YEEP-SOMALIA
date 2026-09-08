import { route, type IdContext } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { requireUser } from "@/lib/api/auth";
import { roleAtLeast } from "@/lib/roles";
import { VolunteerHours } from "@/models/VolunteerHours";

const NOT_FOUND = "That time-log entry could not be found.";

/** DELETE /api/volunteer-hours/:id — member deletes their own pending entry;
 *  staff can delete any. */
export const DELETE = route<IdContext>(async (req, ctx) => {
  const user = await requireUser(req);
  const { id } = await ctx.params;

  const entry = await VolunteerHours.findById(id);
  if (!entry) throw ApiError.notFound(NOT_FOUND);

  const isStaff = roleAtLeast(user.role, "staff");
  const isOwner = String(entry.user) === user.id;

  if (!isStaff && (!isOwner || entry.status !== "Pending")) {
    throw ApiError.forbidden("You can only remove your own entries while they're pending.");
  }

  await entry.deleteOne();
  return ok({ id });
});
