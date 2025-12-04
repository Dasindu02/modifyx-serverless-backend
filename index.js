// index.js
import express from "express";
import mongoose from "mongoose";
import serverless from "serverless-http";

const app = express();
app.use(express.json());

let isConnected = false; // track connection

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

// Health check route
app.get("/", async (req, res) => {
  try {
    await connectToDatabase();
    res.status(200).send("Serverless MERN Backend OK");
  } catch (err) {
    res.status(500).send("DB connection error: " + err.message);
  }
});

app.get("/favicon.ico", (req, res) => res.status(204).end());

export default serverless(app);
