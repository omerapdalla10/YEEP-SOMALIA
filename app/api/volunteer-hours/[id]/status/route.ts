import { route, type IdContext } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { requireRole } from "@/lib/api/auth";
import { volunteerHoursStatusSchema } from "@/lib/validators";
import { VolunteerHours } from "@/models/VolunteerHours";

/** PATCH /api/volunteer-hours/:id/status — staff approve/reject a logged entry. */
export const PATCH = route<IdContext>(async (req, ctx) => {
  const reviewer = await requireRole(req, "staff");
  const { id } = await ctx.params;
  const { status, reviewNote } = await parseBody(req, volunteerHoursStatusSchema);

  const entry = await VolunteerHours.findByIdAndUpdate(
    id,
    { status, reviewNote, reviewedBy: reviewer.id, reviewedAt: new Date() },
    { new: true, runValidators: true },
  );
  if (!entry) throw ApiError.notFound("That time-log entry could not be found.");

  return ok(entry);
});
