import { randomUUID } from 'node:crypto'
import type { Request } from 'express'
import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import { signToken } from '../utils/token'
import { buildAuthUrl, exchangeCode, fetchProfile, type GoogleProfile } from '../utils/googleOAuth'
import { env, isProd, googleOAuthEnabled } from '../config/env'
import { User } from '../models/User'

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body

  const existing = await User.findOne({ email })
  if (existing) throw ApiError.conflict('An account with that email address already exists. Try signing in instead.')

  const user = await User.create({ name, email, password, phone })
  const token = signToken({ sub: user.id, role: user.role })

  res.status(201).json({ success: true, data: { user, token } })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('The email or password you entered is incorrect.')
  }
  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been disabled. Please contact an administrator.')
  }

  const token = signToken({ sub: user.id, role: user.role })
  user.password = undefined

  res.json({ success: true, data: { user, token } })
})

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user })
})

export const updateMe = asyncHandler(async (req, res) => {
  const user = req.user!
  Object.assign(user, req.body)
  await user.save()
  res.json({ success: true, data: user })
})

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await User.findById(req.user!.id).select('+password')
  if (!user || !(await user.comparePassword(currentPassword))) {
    throw ApiError.badRequest('Your current password is incorrect.', { fields: { currentPassword: 'Your current password is incorrect.' } })
  }
  if (await user.comparePassword(newPassword)) {
    throw ApiError.badRequest('Your new password must be different from your current one.', {
      fields: { newPassword: 'Choose a password different from your current one.' },
    })
  }
  user.password = newPassword
  await user.save()
  res.json({ success: true, message: 'Your password has been changed.' })
})

/* ----------------------------- Google OAuth ----------------------------- */

const OAUTH_STATE_COOKIE = 'yeep_oauth_state'
const STATE_COOKIE_PATH = '/api/auth'
const clientOrigin = env.clientUrls[0] ?? 'http://localhost:5173'

/** Read a single cookie without pulling in cookie-parser. */
function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie
  if (!header) return undefined
  for (const part of header.split(';')) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    if (part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim())
    }
  }
  return undefined
}

/**
 * GET /api/auth/google — kicks off the redirect flow. Signs a short-lived
 * state token, drops it in an httpOnly cookie, and sends the browser to
 * Google's consent screen.
 */
export const googleStart = asyncHandler(async (_req, res) => {
  if (!googleOAuthEnabled) {
    throw ApiError.badRequest('Google sign-in is not configured on this server.')
  }

  const state = jwt.sign({ purpose: 'google-oauth', nonce: randomUUID() }, env.jwtSecret, {
    expiresIn: '10m',
  })

  res.cookie(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 10 * 60 * 1000,
    path: STATE_COOKIE_PATH,
  })

  res.redirect(buildAuthUrl(state))
})

/**
 * GET /api/auth/google/callback — Google redirects here with `code` + `state`.
 * On success the browser is bounced to the frontend with a JWT in the URL hash;
 * on any failure it lands on the login page with a readable `?error=` message.
 */
export const googleCallback = asyncHandler(async (req, res) => {
  const query = req.query as Record<string, string | undefined>
  res.clearCookie(OAUTH_STATE_COOKIE, { path: STATE_COOKIE_PATH })

  const bounce = (reason: string) =>
    res.redirect(`${clientOrigin}/login?error=${encodeURIComponent(reason)}`)

  if (query.error) return bounce('Google sign-in was cancelled.')
  if (!query.code || !query.state) return bounce('Google sign-in failed. Please try again.')

  const cookieState = readCookie(req, OAUTH_STATE_COOKIE)
  if (!cookieState || cookieState !== query.state) {
    return bounce('Your sign-in session expired. Please try again.')
  }
  try {
    jwt.verify(query.state, env.jwtSecret)
  } catch {
    return bounce('Your sign-in session expired. Please try again.')
  }

  let profile: GoogleProfile
  try {
    const accessToken = await exchangeCode(query.code)
    profile = await fetchProfile(accessToken)
  } catch (err) {
    console.error('[auth] google oauth error:', err)
    return bounce('Could not complete Google sign-in. Please try again.')
  }

  if (!profile.email) return bounce('Your Google account did not share an email address.')

  let user = await User.findOne({
    $or: [{ googleId: profile.sub }, { email: profile.email }],
  })

  if (!user) {
    user = await User.create({
      name: profile.name,
      email: profile.email,
      googleId: profile.sub,
      authProvider: 'google',
      avatar: profile.picture,
    })
  } else if (!user.googleId) {
    // Existing local account with the same email — link it to Google.
    user.googleId = profile.sub
    if (!user.avatar && profile.picture) user.avatar = profile.picture
    await user.save()
  }

  if (!user.isActive) {
    return bounce('Your account has been disabled. Please contact an administrator.')
  }

  const token = signToken({ sub: user.id, role: user.role })
  res.redirect(`${env.oauthSuccessRedirect}#token=${encodeURIComponent(token)}`)
})
