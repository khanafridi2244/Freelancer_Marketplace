import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

const app = express();

// CORS must come first, so preflight (OPTIONS) requests are answered
// immediately, without waiting on the database at all.
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Only check the DB connection for real requests, not OPTIONS preflight
app.use(async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// routes import
import userRouter from './routes/user.routes.js';
import taskRouter from './routes/task.routes.js';
import bidActionRouter from './routes/bidAction.routes.js';
import userReviewRouter from './routes/userReview.routes.js';

// routes declaration
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/bids', bidActionRouter);
app.use('/api/v1/users', userReviewRouter);

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;