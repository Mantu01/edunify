import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(`${MONGODB_URI}/edunify`, opts).then((mongoose) => {
        return mongoose;
      }).catch((error: unknown) => {
        cached.promise = null;
        throw error;
      });
    }

    try {
      cached.conn = await cached.promise;
    } catch (error: unknown) {
      cached.promise = null;
      throw error;
    }

    return cached.conn;
  } catch (error: unknown) {
    cached.promise = null;
    if (error instanceof Error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
    throw new Error('Database connection failed');
  }
}

export default connectDB;
