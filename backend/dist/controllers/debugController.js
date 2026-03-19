"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEnv = void 0;
const checkEnv = (req, res) => {
    res.json({
        frontendUrl: process.env.FRONTEND_URL,
        nodeEnv: process.env.NODE_ENV,
        hasStripe: !!process.env.STRIPE_SECRET_KEY
    });
};
exports.checkEnv = checkEnv;
