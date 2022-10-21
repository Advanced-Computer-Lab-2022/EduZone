import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import coursesRoutes from './routes/coursesRoutes';
dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!!');
});

mongoose.connect(process.env.MONGO_URI as string, (err) => {
  if (err) throw err;
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

/* Routes */

app.use('/courses', (req, res, next) => {
  coursesRoutes.router(req, res, next);
});

/* Error Handlers */
app.use((req, res, next) => {
  const error = new Error('Route Not found');
  return res.status(404).json({
    message: error.message,
  });
});
