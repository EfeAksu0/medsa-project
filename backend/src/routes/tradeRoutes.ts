import { Router } from 'express';
import { createTrade, getTrades, getTradeById, updateTrade, deleteTrade } from '../controllers/tradeController';
import { createTradeFolder, getTradeFolders, deleteTradeFolder } from '../controllers/tradeFolderController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate); // Protect all trade routes

// Folder Routes
router.get('/folders', getTradeFolders);
router.post('/folders', createTradeFolder);
router.delete('/folders/:id', deleteTradeFolder);

// Trade Routes
router.get('/', getTrades);
router.post('/', createTrade);
router.get('/:id', getTradeById);
router.put('/:id', updateTrade);
router.delete('/:id', deleteTrade);

export default router;
