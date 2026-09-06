import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import { User } from '../models/User'

/** GET /api/users — admin list with search + role filter. */
export const listUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))

  const filter: Record<string, unknown> = {}
  if (req.query.role) filter.role = req.query.role
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true'

  const search = (req.query.search as string)?.trim()
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ name: rx }, { email: rx }]
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ])

  res.json({
    success: true,
    data: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  })
})

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) throw ApiError.notFound('That user account could not be found.')
  res.json({ success: true, data: user })
})

/** POST /api/users — admin creates a user account (volunteer or admin). */
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, isActive } = req.body

  const existing = await User.findOne({ email })
  if (existing) {
    throw ApiError.conflict('An account with that email address already exists.', {
      fields: { email: 'This email address is already registered.' },
    })
  }

  const user = await User.create({ name, email, password, phone, role, isActive })
  res.status(201).json({ success: true, data: user })
})

export const updateUser = asyncHandler(async (req, res) => {
  const isSelf = req.params.id === req.user!.id
  if (isSelf && req.body.role && req.body.role !== 'admin') {
    throw ApiError.badRequest("You can't change your own role. Ask another administrator to do it.")
  }
  if (isSelf && req.body.isActive === false) {
    throw ApiError.badRequest("You can't deactivate your own account.")
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!user) throw ApiError.notFound('That user account could not be found.')
  res.json({ success: true, data: user })
})

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user!.id) throw ApiError.badRequest("You can't delete your own account.")
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) throw ApiError.notFound('That user account could not be found.')
  res.json({ success: true, data: { id: req.params.id } })
})
