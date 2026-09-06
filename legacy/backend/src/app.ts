import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'

import { env, isProd } from './config/env'
import routes from './routes'
import { notFound, errorHandler } from './middleware/error'

export function createApp() {
  const app = express()

  app.set('trust proxy', 1)
  app.use(helmet())
  app.use(
    cors({
      // In development, reflect any origin so the Vite dev server works on
      // whatever port it lands on. In production, restrict to CLIENT_URL.
      origin: isProd ? env.clientUrls : true,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '2mb' })) // headroom for inline avatar data URLs
  app.use(express.urlencoded({ extended: true }))
  app.use(compression())
  app.use(morgan(isProd ? 'combined' : 'dev'))

  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: {
        success: false,
        message: 'You are making requests too quickly. Please wait a minute and try again.',
      },
    }),
  )

  app.get('/', (_req, res) => {
    res.json({ success: true, name: 'YEEP Somalia API', docs: '/api/health' })
  })

  app.use('/api', routes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
