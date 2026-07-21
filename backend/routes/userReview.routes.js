import { Router } from 'express';
import { getUserReviews } from '../controllers/review.controller.js';

const router = Router();

router.route('/:userId/reviews').get(getUserReviews);

export default router;