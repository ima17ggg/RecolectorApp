import { Router } from 'express';
import { register, login, profile, logout } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, profile);
router.post('/logout', logout);

export default router;
