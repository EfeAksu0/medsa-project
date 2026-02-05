"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tradeController_1 = require("../controllers/tradeController");
const tradeFolderController_1 = require("../controllers/tradeFolderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate); // Protect all trade routes
// Folder Routes
router.get('/folders', tradeFolderController_1.getTradeFolders);
router.post('/folders', tradeFolderController_1.createTradeFolder);
router.delete('/folders/:id', tradeFolderController_1.deleteTradeFolder);
// Trade Routes
router.get('/', tradeController_1.getTrades);
router.post('/', tradeController_1.createTrade);
router.get('/:id', tradeController_1.getTradeById);
router.put('/:id', tradeController_1.updateTrade);
router.delete('/:id', tradeController_1.deleteTrade);
exports.default = router;
