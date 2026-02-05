import express from 'express';
import { reportBug, getBugs } from '../controllers/bugController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Allow authenticated users to report bugs. 
// If we want unauthenticated users to report, we'd make auth optional or separate.
// For now, let's keep it behind auth to prevent spam, or make it optional in controller.
// We'll use authMiddleware but maybe make it non-blocking if we really wanted anonymous bugs, 
// but for this app context, user is likely logged in on dashboard.
router.post('/', authenticate, reportBug);

// Admin-only route ideally, but for now just open for you to read them
router.get('/', authenticate, getBugs);

export default router;
