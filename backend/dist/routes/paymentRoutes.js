"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const paymentController_1 = require("../controllers/paymentController");
const router = express_1.default.Router();
// POST /api/payments/create-checkout-session
router.post('/create-checkout-session', authMiddleware_1.authenticate, paymentController_1.createCheckoutSession);
// POST /api/payments/webhook
// Note: This needs raw body parsing in app.ts usually
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), paymentController_1.handleWebhook);
exports.default = router;
