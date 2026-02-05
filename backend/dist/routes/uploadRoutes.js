"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const prisma_1 = require("../prisma");
const router = express_1.default.Router();
// Upload Image Route
router.post('/image', authMiddleware_1.authenticate, uploadMiddleware_1.upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        const userId = req.user.userId;
        // Save to Database
        const uploadedImage = await prisma_1.prisma.uploadedImage.create({
            data: {
                userId: userId,
                data: req.file.buffer,
                mimeType: req.file.mimetype,
                filename: req.file.originalname
            }
        });
        // Return the serving URL
        const fileUrl = `/api/upload/${uploadedImage.id}`;
        res.json({ url: fileUrl });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});
// Serve Image Route
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const image = await prisma_1.prisma.uploadedImage.findUnique({
            where: { id }
        });
        if (!image) {
            res.status(404).json({ error: 'Image not found' });
            return;
        }
        res.setHeader('Content-Type', image.mimeType);
        // Cache control for performance (images usually immutable by ID)
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.send(image.data);
    }
    catch (error) {
        console.error('Image serve error:', error);
        res.status(500).json({ error: 'Failed to retrieve image' });
    }
});
exports.default = router;
