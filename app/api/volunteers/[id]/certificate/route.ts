import { route, type IdContext } from "@/lib/api/route";
import { ApiError } from "@/lib/api/errors";
import { requireUser } from "@/lib/api/auth";
import { roleAtLeast } from "@/lib/roles";
import { generateCertificatePdf, certificateId } from "@/lib/api/certificate";
import { Volunteer } from "@/models/Volunteer";

/**
 * GET /api/volunteers/:id/certificate — download the appreciation certificate
 * for an approved volunteer application (as a PDF). Staff can fetch anyone's;
 * a member can fetch their own.
 */
export const GET = route<IdContext>(async (req, ctx) => {
  const user = await requireUser(req);
  const { id } = await ctx.params;

  const application = await Volunteer.findById(id);
  if (!application) throw ApiError.notFound("That application could not be found.");

  const isStaff = roleAtLeast(user.role, "staff");
  const isOwner = application.user && String(application.user) === user.id;
  if (!isStaff && !isOwner) {
    throw ApiError.forbidden("You can only download your own certificate.");
  }
  if (application.status !== "Approved") {
    throw ApiError.badRequest("A certificate is only available once the application is approved.");
  }

  const certId = certificateId(String(application._id));
  const pdf = await generateCertificatePdf({
    name: application.name,
    role: application.role,
    issuedOn: application.updatedAt ?? application.createdAt ?? new Date(),
    certId,
  });

  const slug = application.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="yeep-certificate-${slug}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
});
