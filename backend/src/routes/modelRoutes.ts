import { Router } from 'express';
import {
    createModel,
    getModels,
    getModelById,
    updateModel,
    deleteModel,
} from '../controllers/modelController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/', createModel);
router.get('/', getModels);
router.get('/:id', getModelById);
router.put('/:id', updateModel);
router.delete('/:id', deleteModel);

export default router;
