// api/index.js
import mongoose from "mongoose";

let isConnected = false; // track DB connection

async function connectToDatabase() {
  if (isConnected) return;

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not set");

  try {
    await mongoose.connect(uri, {
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
