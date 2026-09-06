import { asyncHandler } from '../utils/asyncHandler'
import { User } from '../models/User'
import { Program } from '../models/Program'
import { Project } from '../models/Project'
import { Partner } from '../models/Partner'

/** GET /api/stats — public, site-wide impact numbers for the marketing pages. */
export const siteStats = asyncHandler(async (_req, res) => {
  const [programAgg, projectAgg, volunteers, partners, communitiesReached, activePrograms] =
    await Promise.all([
      Program.aggregate([{ $group: { _id: null, beneficiaries: { $sum: '$beneficiaries' } } }]),
      Project.aggregate([
        { $group: { _id: null, raised: { $sum: '$raised' }, budget: { $sum: '$budget' } } },
      ]),
      User.countDocuments({ role: 'volunteer' }),
      Partner.countDocuments(),
      Project.distinct('region').then((r) => r.filter(Boolean).length),
      Program.countDocuments({ status: { $in: ['Active', 'Enrolling'] } }),
    ])

  const youthEmpowered = programAgg[0]?.beneficiaries ?? 0
  const fundsRaised = projectAgg[0]?.raised || projectAgg[0]?.budget || 0

  res.json({
    success: true,
    data: {
      youthEmpowered,
      activePrograms,
      communitiesReached,
      fundsRaised,
      volunteers,
      partners,
      foundedYear: 2024,
    },
  })
})
