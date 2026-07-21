import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask

} from '../controllers/task.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import bidRouter from './bid.routes.js';
import reviewRouter from './review.routes.js';

const router = Router();

router.route('/').post(verifyJWT, createTask);
router.route('/').get(getTasks);
router.route('/:id').get(getTaskById);
router.route('/:id').put(verifyJWT, updateTask);
router.route('/:id').delete(verifyJWT, deleteTask);
router.route('/:id/complete').patch(verifyJWT, completeTask);
router.use('/:taskId/reviews', reviewRouter);

// nested bid routes
router.use('/:taskId/bids', bidRouter);

export default router;