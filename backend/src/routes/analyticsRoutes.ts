import { Router } from 'express';
import { getOverallStats, getEquityCurve, getCalendarStats } from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/stats', getOverallStats);
router.get('/equity-curve', getEquityCurve);
router.get('/calendar', getCalendarStats);

export default router;
