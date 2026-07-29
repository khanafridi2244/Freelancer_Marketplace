import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

import userRouter from './routes/user.routes.js';
import taskRouter from './routes/task.routes.js';
import bidActionRouter from './routes/bidAction.routes.js';
import userReviewRouter from './routes/userReview.routes.js';

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