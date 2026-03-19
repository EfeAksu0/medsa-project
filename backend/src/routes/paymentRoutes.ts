
import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { createCheckoutSession, handleWebhook, verifyPaymentSession, createPortalSession } from '../controllers/paymentController';

const router = express.Router();

// POST /api/payments/create-checkout-session
router.post('/create-checkout-session', authenticate, createCheckoutSession);

// POST /api/payments/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// POST /api/payments/verify-session
router.post('/verify-session', verifyPaymentSession);

// POST /api/payments/create-portal-session
router.post('/create-portal-session', authenticate, createPortalSession);

export default router;
