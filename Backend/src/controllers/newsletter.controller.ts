import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import { Subscriber } from '../models/Subscriber'

/** POST /api/newsletter — public subscription (idempotent). */
export const subscribe = asyncHandler(async (req, res) => {
  const { email, source } = req.body
  const existing = await Subscriber.findOne({ email })

  if (existing) {
    if (!existing.active) {
      existing.active = true
      await existing.save()
    }
    res.status(200).json({ success: true, message: 'You are subscribed' })
    return
  }

  await Subscriber.create({ email, source })
  res.status(201).json({ success: true, message: 'Subscribed' })
})

/** GET /api/newsletter — admin list of subscribers. */
export const listSubscribers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50))

  const [items, total] = await Promise.all([
    Subscriber.find()
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit),
    Subscriber.countDocuments(),
  ])

  res.json({
    success: true,
    data: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  })
})

export const deleteSubscriber = asyncHandler(async (req, res) => {
  const item = await Subscriber.findByIdAndDelete(req.params.id)
  if (!item) throw ApiError.notFound('That subscriber could not be found.')
  res.json({ success: true, data: { id: req.params.id } })
})
