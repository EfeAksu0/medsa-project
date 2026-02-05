"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trashController_1 = require("../controllers/trashController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.get('/', trashController_1.getTrash);
router.post('/restore', trashController_1.restoreItem);
router.post('/delete', trashController_1.permanentlyDeleteItem); // Using POST slightly unconventional for delete with body, but DELETE with body is also valid but sometimes problematic in some clients. I'll stick to DELETE method for semantic correctness if possible, but POST is safer for "action" endpoint. Let's use standard REST for delete if possible, but since I have a unified endpoint... I'll use DELETE / with body.
// actually let's do:
router.delete('/', trashController_1.permanentlyDeleteItem);
exports.default = router;
