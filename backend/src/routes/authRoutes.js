import express from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.put('/me', authenticateToken, updateProfile);

export default router;