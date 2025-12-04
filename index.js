// index.js
import express from 'express';
import mongoose from 'mongoose';
import serverless from 'serverless-http';

const app = express();
app.use(express.json());

let conn = null;

async function connectToDatabase() {
  if (conn == null) {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set');
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
    res.status(500).send('Database connection error: ' + error.message);
  }
});

export default serverless(app);
