import { route, type IdContext } from "@/lib/api/route";
import { parseBody } from "@/lib/api/validate";
import { ok } from "@/lib/api/response";
import { ApiError } from "@/lib/api/errors";
import { requireRole } from "@/lib/api/auth";
import { volunteerStatusSchema } from "@/lib/validators";
import { sendMail } from "@/lib/api/mailer";
import { volunteerApprovedEmail } from "@/lib/api/emails/volunteer-approved";
import { Volunteer } from "@/models/Volunteer";

/** PATCH /api/volunteers/:id/status — staff review decision. */
export const PATCH = route<IdContext>(async (req, ctx) => {
  await requireRole(req, "staff");
  const { id } = await ctx.params;
  const { status, reviewNote } = await parseBody(req, volunteerStatusSchema);

  const before = await Volunteer.findById(id).select("status");
  if (!before) {
    throw ApiError.notFound("That volunteer application could not be found.");
  }

  const item = await Volunteer.findByIdAndUpdate(
    id,
    { status, reviewNote },
    { new: true, runValidators: true },
  );
  if (!item) {
    throw ApiError.notFound("That volunteer application could not be found.");
  }

  // Notify the applicant the first time they're approved. Fire-and-forget:
  // a mail failure must never fail the review action.
  if (status === "Approved" && before.status !== "Approved") {
    const mail = volunteerApprovedEmail(item.name, item.role);
    void sendMail({ to: item.email, ...mail });
  }

  return ok(item);
});
