// api/index.js
import mongoose from "mongoose";

let cached = global.mongoose; // use global cache to avoid reconnecting
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not set");

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    res.status(200).json({ message: "Serverless MERN Backend OK" });
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ error: "DB connection error: " + err.message });
  }
}
