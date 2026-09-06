import mongoose from "mongoose";

/**
 * Cached Mongoose connection.
 *
 * Next.js hot-reloads modules in development, which would otherwise open a new
 * database connection on every change and quickly exhaust the pool. We stash the
 * connection (and the in-flight promise) on the Node global so it survives
 * reloads, and reuse it across every Server Component render and Route Handler.
 */

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongoose ?? { conn: null, promise: null };
if (!global._mongoose) global._mongoose = cache;

export async function dbConnect(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env.local and set it.",
    );
  }

  if (!cache.promise) {
    mongoose.set("strictQuery", true);
    cache.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }

  return cache.conn;
}
