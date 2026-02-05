import { Router } from 'express';
import { getTrash, restoreItem, permanentlyDeleteItem } from '../controllers/trashController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getTrash);
router.post('/restore', restoreItem);
router.post('/delete', permanentlyDeleteItem); // Using POST slightly unconventional for delete with body, but DELETE with body is also valid but sometimes problematic in some clients. I'll stick to DELETE method for semantic correctness if possible, but POST is safer for "action" endpoint. Let's use standard REST for delete if possible, but since I have a unified endpoint... I'll use DELETE / with body.

// actually let's do:
router.delete('/', permanentlyDeleteItem);

export default router;
