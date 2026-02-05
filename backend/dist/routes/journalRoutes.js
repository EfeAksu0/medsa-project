"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const journalController_1 = require("../controllers/journalController");
const folderController_1 = require("../controllers/folderController");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticate);
// Folders
router.post('/folders', folderController_1.createFolder);
router.get('/folders', folderController_1.getFolders);
router.delete('/folders/:id', folderController_1.deleteFolder);
router.put('/folders/:id', folderController_1.updateFolder);
// Entries
router.post('/', journalController_1.createEntry);
router.get('/', journalController_1.getEntries);
router.get('/:id', journalController_1.getEntryById);
router.delete('/:id', journalController_1.deleteEntry);
router.put('/:id', journalController_1.updateEntry);
exports.default = router;
