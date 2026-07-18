import { Router } from 'express';
import { createBid, getBidsForTask } from '../controllers/bid.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true });

router.route('/').post(verifyJWT, createBid);
router.route('/').get(verifyJWT, getBidsForTask);

export default router;