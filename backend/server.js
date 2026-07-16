import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes import
import userRouter from './routes/user.routes.js';
import taskRouter from './routes/task.routes.js';

// routes declaration
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});