"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure upload directories exist
const uploadDir = path_1.default.join(__dirname, '../../uploads');
const tradesDir = path_1.default.join(uploadDir, 'trades');
// Ensure upload directories exist (Only in non-production or if write access exists)
try {
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    if (!fs_1.default.existsSync(tradesDir)) {
        fs_1.default.mkdirSync(tradesDir, { recursive: true });
    }
}
catch (error) {
    console.warn("Could not create upload directories (likely read-only environment like Vercel). Using memory storage.");
}
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Not an image! Please upload an image.'));
    }
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
