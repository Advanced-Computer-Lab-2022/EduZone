import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { coursesRoutes } from './routes';
dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!!');
});

/* Routes */

app.use('/courses', coursesRoutes);

/* Error Handlers */
app.use((req, res) => {
  const error = new Error('Route Not found');
  return res.status(404).json({
    message: error.message,
  });
});

mongoose.connect(process.env.MONGO_URI as string, (err) => {
  if (err) throw err;
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
