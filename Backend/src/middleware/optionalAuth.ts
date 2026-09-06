import { asyncHandler } from '../utils/asyncHandler'
import { verifyToken } from '../utils/token'
import { User } from '../models/User'

/** Attaches req.user when a valid token is present, but never rejects the request. */
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) {
    try {
      const payload = verifyToken(header.slice(7))
      const user = await User.findById(payload.sub)
      if (user?.isActive) req.user = user
    } catch {
      /* ignore — treat as anonymous */
    }
  }
  next()
})
