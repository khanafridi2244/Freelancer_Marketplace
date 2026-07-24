import { Router } from 'express';
import { acceptBid, getMyBids } from '../controllers/bid.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/my-bids').get(verifyJWT, getMyBids);
router.route('/:bidId/accept').patch(verifyJWT, acceptBid);

export default router;