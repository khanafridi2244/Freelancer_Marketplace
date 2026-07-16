import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// Test protected route
router.route('/me').get(verifyJWT, (req, res) => {
  return res.status(200).json({ user: req.user });
});

export default router;