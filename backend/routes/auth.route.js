import express from 'express';
import authController from '../controllers/auth.js';
import { verifyToken } from '../middleware/auth.js';

const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/logout', verifyToken, authController.logout);

// Add verify token endpoint
authRouter.get('/verify-token', verifyToken, (req, res) => {
  res.json({ valid: true });
});

export default authRouter;