import { createApp } from './app'
import { connectDB, disconnectDB } from './config/db'
import { env } from './config/env'

async function start() {
  await connectDB()

  const app = createApp()
  const server = app.listen(env.port, () => {
    console.log(`[api] listening on http://localhost:${env.port} (${env.nodeEnv})`)
  })

  const shutdown = async (signal: string) => {
    console.log(`\n[api] ${signal} received, shutting down...`)
    server.close(async () => {
      await disconnectDB()
      process.exit(0)
    })
    setTimeout(() => process.exit(1), 10_000).unref()
  }

  process.on('SIGINT', () => void shutdown('SIGINT'))
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
}

start().catch((err) => {
  console.error('[api] failed to start:', err)
  process.exit(1)
})
