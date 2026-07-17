import { Router } from 'express';
import { createBid } from '../controllers/bid.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true });

router.route('/').post(verifyJWT, createBid);

export default router;