import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createEntrySchema = z.object({
    content: z.string().min(1, "Content is required"),
    tags: z.array(z.string()).optional(),
    mood: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    date: z.string().optional(),
    folderId: z.string().optional(),
});

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export const createEntry = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).user!.userId;
        const data = createEntrySchema.parse(req.body);

        const entry = await prisma.journalEntry.create({
            data: {
                userId,
                content: data.content,
                tags: data.tags || [],
                mood: data.mood,
                rating: data.rating,
                date: data.date ? new Date(data.date) : new Date(),
                folderId: data.folderId || null,
            },
        });

        res.status(201).json(entry);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: (error as any).errors });
        }
        console.error('Create journal entry error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getEntries = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).user!.userId;
        const folderId = req.query.folderId as string | undefined;

        const whereClause: any = { userId };

        // If folderId is provided, filter by it. 
        // If query param 'root' is true, filter for folderId: null
        if (folderId) {
            whereClause.folderId = folderId;
        } else if (req.query.root === 'true') {
            whereClause.folderId = null;
        }
        // Otherwise return all entries? Or just root? 
        // Let's default to returning all if no filter, or maybe just recent.
        // For file system view, we usually want specific folder content.
        // But for "All Notes" view we might want everything.
        // Let's keep it simple: if folderId is passed, use it. If root=true passed, use null.
        // If neither, return all (previous behavior).

        const entries = await prisma.journalEntry.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
        });
        res.json(entries);
    } catch (error) {
        console.error('Get journal entries error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getEntryById = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).user!.userId;
        const { id } = req.params;

        if (typeof id !== 'string') {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const entry = await prisma.journalEntry.findUnique({
            where: { id },
        });

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        if (entry.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(entry);
    } catch (error) {
        console.error('Get journal entry error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteEntry = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).user!.userId;
        const { id } = req.params;

        if (typeof id !== 'string') {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        // Verify ownership first
        const entry = await prisma.journalEntry.findUnique({ where: { id } });
        if (!entry) return res.status(404).json({ message: 'Entry not found' });
        if (entry.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });

        await prisma.journalEntry.delete({ where: { id } });
        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error('Delete journal entry error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateEntry = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).user!.userId;
        const { id } = req.params;
        const { content, tags, mood, rating, folderId } = req.body;

        if (typeof id !== 'string') {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const entry = await prisma.journalEntry.findUnique({ where: { id } });
        if (!entry) return res.status(404).json({ message: 'Entry not found' });
        if (entry.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });

        const updatedEntry = await prisma.journalEntry.update({
            where: { id },
            data: {
                content,
                tags,
                mood,
                rating,
                folderId // Allow updating folderId (moving the file)
            }
        });

        res.json(updatedEntry);
    } catch (error) {
        console.error('Update journal entry error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
