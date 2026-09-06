import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import { Volunteer } from '../models/Volunteer'

/** POST /api/volunteers/apply — public (or logged-in) application submission. */
export const submitApplication = asyncHandler(async (req, res) => {
  const application = await Volunteer.create({
    ...req.body,
    user: req.user?.id,
  })
  res.status(201).json({ success: true, data: application })
})

/** GET /api/volunteers/me — the current user's own applications. */
export const myApplications = asyncHandler(async (req, res) => {
  const items = await Volunteer.find({ user: req.user!.id }).sort('-createdAt')
  res.json({ success: true, data: items })
})

/** GET /api/volunteers — admin list. */
export const listApplications = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))

  const filter: Record<string, unknown> = {}
  if (req.query.status) filter.status = req.query.status

  const [items, total] = await Promise.all([
    Volunteer.find(filter)
      .populate('user', 'name email avatar')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit),
    Volunteer.countDocuments(filter),
  ])

  res.json({
    success: true,
    data: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  })
})

export const getApplication = asyncHandler(async (req, res) => {
  const item = await Volunteer.findById(req.params.id).populate('user', 'name email avatar')
  if (!item) throw ApiError.notFound('That volunteer application could not be found.')
  res.json({ success: true, data: item })
})

/** PATCH /api/volunteers/:id/status — admin review decision. */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const item = await Volunteer.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, reviewNote: req.body.reviewNote },
    { new: true, runValidators: true },
  )
  if (!item) throw ApiError.notFound('That volunteer application could not be found.')
  res.json({ success: true, data: item })
})

export const deleteApplication = asyncHandler(async (req, res) => {
  const item = await Volunteer.findByIdAndDelete(req.params.id)
  if (!item) throw ApiError.notFound('That volunteer application could not be found.')
  res.json({ success: true, data: { id: req.params.id } })
})
