"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bugController_1 = require("../controllers/bugController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Allow authenticated users to report bugs. 
// If we want unauthenticated users to report, we'd make auth optional or separate.
// For now, let's keep it behind auth to prevent spam, or make it optional in controller.
// We'll use authMiddleware but maybe make it non-blocking if we really wanted anonymous bugs, 
// but for this app context, user is likely logged in on dashboard.
router.post('/', authMiddleware_1.authenticate, bugController_1.reportBug);
// Admin-only route ideally, but for now just open for you to read them
router.get('/', authMiddleware_1.authenticate, bugController_1.getBugs);
exports.default = router;
