// index.js
import express from "express";
import mongoose from "mongoose";
import serverless from "serverless-http";

const app = express();
app.use(express.json());

let conn = null;

async function connectToDatabase() {
  if (conn) return conn;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI not set");

  conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected");
  return conn;
}

app.get("/", async (req, res) => {
  try {
    // Only ping DB, don’t do heavy queries
    await connectToDatabase();
    res.status(200).send("Serverless MERN Backend OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("DB connection error: " + err.message);
  }
});

app.get("/favicon.ico", (req, res) => res.status(204).end());

export default serverless(app);
