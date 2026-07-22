import { Router } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(verifyJWT, (req, res) => {
  return res.status(200).json({ user: req.user });
});
router.route('/:id').get(getUserProfile);

export default router;