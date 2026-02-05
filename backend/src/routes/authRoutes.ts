import { Router } from 'express';
import { register, login, getMe, updateMe, markEmailVerified, syncSupabaseUser } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.put('/me', authenticate, updateMe); // Update Profile
router.get('/me', authenticate, getMe);
router.post('/mark-email-verified', authenticate, markEmailVerified); // Mark email as verified
router.post('/sync-supabase-user', authenticate, syncSupabaseUser); // Sync Supabase user to database

export default router;
