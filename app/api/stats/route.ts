import { route } from "@/lib/api/route";
import { ok } from "@/lib/api/response";
import { Program } from "@/models/Program";
import { Project } from "@/models/Project";
import { Partner } from "@/models/Partner";
import { Volunteer } from "@/models/Volunteer";

/** GET /api/stats — public, site-wide impact numbers for the marketing pages. */
export const GET = route(async () => {
  const [programAgg, projectAgg, volunteers, partners, communitiesReached, activePrograms] =
    await Promise.all([
      Program.aggregate([{ $group: { _id: null, beneficiaries: { $sum: "$beneficiaries" } } }]),
      Project.aggregate([
        { $group: { _id: null, raised: { $sum: "$raised" }, budget: { $sum: "$budget" } } },
      ]),
      Volunteer.countDocuments({ status: "Approved" }),
      Partner.countDocuments(),
      Project.distinct("region").then((r) => r.filter(Boolean).length),
      Program.countDocuments({ status: { $in: ["Active", "Enrolling"] } }),
    ]);

  const youthEmpowered = programAgg[0]?.beneficiaries ?? 0;
  const fundsRaised = projectAgg[0]?.raised || projectAgg[0]?.budget || 0;

  return ok({
    youthEmpowered,
    activePrograms,
    communitiesReached,
    fundsRaised,
    volunteers,
    partners,
    foundedYear: 2024,
  });
});
