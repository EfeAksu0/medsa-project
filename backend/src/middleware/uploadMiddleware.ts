import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../../uploads');
const tradesDir = path.join(uploadDir, 'trades');

// Ensure upload directories exist (Only in non-production or if write access exists)
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    if (!fs.existsSync(tradesDir)) {
        fs.mkdirSync(tradesDir, { recursive: true });
    }
} catch (error) {
    console.warn("Could not create upload directories (likely read-only environment like Vercel). Using memory storage.");
}

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'));
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
