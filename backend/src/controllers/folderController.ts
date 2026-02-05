import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createFolderSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export const createFolder = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).user!.userId;
        const { name } = createFolderSchema.parse(req.body);

        const folder = await prisma.journalFolder.create({
            data: {
                name,
                userId,
            },
        });

        res.status(201).json(folder);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: (error as any).errors });
        }
        // Handle unique constraint violation
        if ((error as any).code === 'P2002') {
            return res.status(409).json({ message: 'Folder with this name already exists' });
        }
        console.error('Create folder error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getFolders = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).user!.userId;
        const folders = await prisma.journalFolder.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { entries: true }
                }
            }
        });
        res.json(folders);
    } catch (error) {
        console.error('Get folders error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteFolder = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).user!.userId;
        const { id } = req.params;

        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid ID' });

        const folder = await prisma.journalFolder.findUnique({ where: { id } });
        if (!folder) return res.status(404).json({ message: 'Folder not found' });
        if (folder.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });

        // Option: Delete entries or move to root? 
        // For now, let's cascade delete entries (handled by database if cascading) or manually delete.
        // Since we didn't set onDelete Cascade in schema, we should probably delete entries or updating them.
        // Let's delete entries for now to be "clean".

        // Manually delete entries first to be safe
        await prisma.journalEntry.deleteMany({
            where: { folderId: id }
        });

        await prisma.journalFolder.delete({ where: { id } });

        res.json({ message: 'Folder deleted successfully' });
    } catch (error) {
        console.error('Delete folder error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateFolder = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).user!.userId;
        const { id } = req.params;
        const { name } = createFolderSchema.parse(req.body);

        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid ID' });

        const folder = await prisma.journalFolder.findUnique({ where: { id } });
        if (!folder) return res.status(404).json({ message: 'Folder not found' });
        if (folder.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });

        const updatedFolder = await prisma.journalFolder.update({
            where: { id },
            data: { name }
        });

        res.json(updatedFolder);
    } catch (error) {
        console.error('Update folder error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
