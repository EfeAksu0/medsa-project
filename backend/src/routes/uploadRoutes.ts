import express, { Request, Response } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { authenticate } from '../middleware/authMiddleware';

import { prisma } from '../prisma';

const router = express.Router();

// Upload Image Route
router.post('/image', authenticate, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const userId = (req as any).user.userId;

        // Save to Database
        const uploadedImage = await prisma.uploadedImage.create({
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
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Serve Image Route
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };

        const image = await prisma.uploadedImage.findUnique({
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
    } catch (error) {
        console.error('Image serve error:', error);
        res.status(500).json({ error: 'Failed to retrieve image' });
    }
});

export default router;
