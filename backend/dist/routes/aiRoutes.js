"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const aiController_1 = require("../controllers/aiController");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(authMiddleware_1.authenticate);
// POST /api/ai/chat - Send message to AI
router.post('/chat', aiController_1.chat);
// GET /api/ai/session/:id - Get specific session
router.get('/session/:id', aiController_1.getSession);
// GET /api/ai/sessions - Get all sessions
router.get('/sessions', aiController_1.getSessions);
exports.default = router;
