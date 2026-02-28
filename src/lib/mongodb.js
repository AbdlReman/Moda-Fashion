import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Note: We don't throw an error here at module load time to allow Next.js
// to build routes that use this module. The error will be thrown at runtime
// when connectToDatabase() is actually called.

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // Throw error if MONGODB_URI is missing when trying to connect
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
  }

  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Connect only once - use the original URI
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        // keep options minimal; Mongoose 7+ has sensible defaults
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        const actualDbName = mongooseInstance.connection.name;
        console.log(`✅ Connected to MongoDB: ${actualDbName}`);
        return mongooseInstance;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}


