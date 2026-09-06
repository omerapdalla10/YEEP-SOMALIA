import dotenv from 'dotenv'

dotenv.config()

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

const clientUrls = (process.env.CLIENT_URL ?? 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const port = Number(process.env.PORT ?? 5000)

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port,
  mongoUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/yeep_ngo'),
  jwtSecret: required('JWT_SECRET', 'dev-only-insecure-secret'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  clientUrls,
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    callbackUrl:
      process.env.GOOGLE_CALLBACK_URL ?? `http://localhost:${port}/api/auth/google/callback`,
  },
  /** Where the API sends the browser after a successful Google sign-in. */
  oauthSuccessRedirect:
    process.env.OAUTH_SUCCESS_REDIRECT ?? `${clientUrls[0] ?? 'http://localhost:5173'}/auth/callback`,
  seedAdmin: {
    name: process.env.SEED_ADMIN_NAME ?? 'YEEP Somalia Admin',
    email: process.env.SEED_ADMIN_EMAIL ?? 'admin@yeep.org.so',
    password: process.env.SEED_ADMIN_PASSWORD ?? 'Admin@12345',
  },
}

export const isProd = env.nodeEnv === 'production'

/** True only when both Google OAuth credentials are present. */
export const googleOAuthEnabled = Boolean(env.google.clientId && env.google.clientSecret)
