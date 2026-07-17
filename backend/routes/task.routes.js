import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/').post(verifyJWT, createTask);
router.route('/').get(getTasks);
router.route('/:id').get(getTaskById);
router.route('/:id').put(verifyJWT, updateTask);
router.route('/:id').delete(verifyJWT, deleteTask);

export default router;