import mongoose, { Connection } from 'mongoose';

// Adapted from
// https://github.com/vercel/next.js/blob/5763a33a035f19e36b582dae13f66586840427b0/examples/with-mongodb-mongoose/lib/dbConnect.js

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  throw new Error(
    'Please define the DB_URL environment variable inside .env.local',
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/** @returns {Promise<Connection>} */
export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(DB_URL, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
