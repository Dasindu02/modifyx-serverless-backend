const serverless = require('serverless-http');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

// Reuse DB connection across function calls
let conn = null;

async function connectToDatabase() {
  if (conn == null) {
    conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  }
  return conn;
}

app.get('/', async (req, res) => {
  try {
    await connectToDatabase();
    res.send('Serverless MERN Backend');
  } catch (error) {
    console.error(error);
    res.status(500).send('Database connection error');
  }
});

module.exports.handler = serverless(app);
