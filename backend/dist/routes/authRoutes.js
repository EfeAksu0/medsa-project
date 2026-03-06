"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.put('/me', authMiddleware_1.authenticate, authController_1.updateMe); // Update Profile
router.get('/me', authMiddleware_1.authenticate, authController_1.getMe);
router.post('/mark-email-verified', authMiddleware_1.authenticate, authController_1.markEmailVerified); // Mark email as verified
router.post('/sync-supabase-user', authMiddleware_1.authenticate, authController_1.syncSupabaseUser); // Sync Supabase user to database
exports.default = router;
