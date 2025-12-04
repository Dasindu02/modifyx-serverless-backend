// api/index.js
import mongoose from "mongoose";

let isConnected = false; // track DB connection

async function connectToDatabase() {
  if (isConnected) return;

  if (!process.env.MONGO_URI) throw new Error("MONGO_URI not set");

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
}

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    res.status(200).json({ message: "Serverless MERN Backend OK" });
  } catch (err) {
    res.status(500).json({ error: "DB connection error: " + err.message });
  }
}
