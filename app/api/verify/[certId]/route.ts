import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { certificateId } from "@/lib/api/certificate";
import { Volunteer } from "@/models/Volunteer";

type Ctx = { params: Promise<{ certId: string }> };

/** GET /api/verify/:certId — public: is this a real YEEP certificate? */
export const GET = route<Ctx>(async (_req, ctx) => {
  const { certId } = await ctx.params;
  const wanted = certId.trim().toUpperCase();

  // Certificate ids are a one-way hash of the application id, so we match by
  // scanning approved applications (small set for an NGO).
  const approved = await Volunteer.find({ status: "Approved" }).select("name role updatedAt createdAt");
  const match = approved.find((v) => certificateId(String(v._id)) === wanted);

  if (!match) return ok({ valid: false });

  return ok({
    valid: true,
    name: match.name,
    role: match.role,
    issuedOn: (match.updatedAt ?? match.createdAt ?? new Date()).toISOString(),
  });
});
