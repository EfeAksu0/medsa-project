import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { chat, getSession, getSessions } from '../controllers/aiController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /api/ai/chat - Send message to AI
router.post('/chat', chat);

// GET /api/ai/session/:id - Get specific session
router.get('/session/:id', getSession);

// GET /api/ai/sessions - Get all sessions
router.get('/sessions', getSessions);

export default router;
