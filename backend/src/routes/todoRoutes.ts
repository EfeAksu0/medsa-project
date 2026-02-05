
import { Router } from 'express';
import { getTodos, createTodo, toggleTodo, deleteTodo } from '../controllers/todoController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getTodos);
router.post('/', createTodo);
router.patch('/:id/toggle', toggleTodo);
router.delete('/:id', deleteTodo);

export default router;
