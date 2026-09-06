import mongoose from 'mongoose'
import { env } from './env'

mongoose.set('strictQuery', true)

export async function connectDB(): Promise<void> {
  await mongoose.connect(env.mongoUri)
  console.log(`[db] connected to ${mongoose.connection.name}`)

  mongoose.connection.on('error', (err) => {
    console.error('[db] connection error:', err)
  })
  mongoose.connection.on('disconnected', () => {
    console.warn('[db] disconnected')
  })
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect()
}
