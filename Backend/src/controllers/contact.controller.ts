import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import { ContactMessage } from '../models/ContactMessage'

/** POST /api/contact — public contact form. */
export const submitMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create(req.body)
  res.status(201).json({ success: true, data: { id: message.id }, message: 'Message received' })
})

/** GET /api/contact — admin inbox. */
export const listMessages = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))

  const filter: Record<string, unknown> = {}
  if (req.query.status) filter.status = req.query.status

  const [items, total] = await Promise.all([
    ContactMessage.find(filter)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit),
    ContactMessage.countDocuments(filter),
  ])

  res.json({
    success: true,
    data: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  })
})

export const getMessage = asyncHandler(async (req, res) => {
  const item = await ContactMessage.findById(req.params.id)
  if (!item) throw ApiError.notFound('That message could not be found.')
  if (item.status === 'New') {
    item.status = 'Read'
    await item.save()
  }
  res.json({ success: true, data: item })
})

export const updateMessageStatus = asyncHandler(async (req, res) => {
  const item = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  )
  if (!item) throw ApiError.notFound('That message could not be found.')
  res.json({ success: true, data: item })
})

export const deleteMessage = asyncHandler(async (req, res) => {
  const item = await ContactMessage.findByIdAndDelete(req.params.id)
  if (!item) throw ApiError.notFound('That message could not be found.')
  res.json({ success: true, data: { id: req.params.id } })
})
