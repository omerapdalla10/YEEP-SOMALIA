import type { Request, Response, NextFunction } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import { verifyToken } from '../utils/token'
import { User } from '../models/User'
import { roleAtLeast, type Role } from '../config/roles'

function extractToken(req: Request): string | null {
  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) return header.slice(7)
  return null
}

/** Requires a valid JWT; attaches the current user to req.user. */
export const protect = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req)
  if (!token) throw ApiError.unauthorized('Please sign in to continue.')

  let payload
  try {
    payload = verifyToken(token)
  } catch {
    throw ApiError.unauthorized('Your session has expired. Please sign in again.')
  }

  const user = await User.findById(payload.sub)
  if (!user) throw ApiError.unauthorized('Your session is no longer valid. Please sign in again.')
  if (!user.isActive) throw ApiError.forbidden('Your account has been disabled. Please contact an administrator.')

  req.user = user
  next()
})

/**
 * Restricts a route to a minimum role. Use after `protect`. Ranks are inherited,
 * so `authorize('staff')` also lets an `admin` through.
 */
export const authorize =
  (...allowed: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const role = req.user?.role
    if (!role) return next(ApiError.unauthorized())
    if (allowed.some((min) => roleAtLeast(role, min))) return next()
    return next(ApiError.forbidden("You don't have permission to do that."))
  }

/** Content team and above (staff, admin). */
export const requireStaff = authorize('staff')

/** Administrators only. */
export const requireAdmin = authorize('admin')
