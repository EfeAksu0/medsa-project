import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

const createFolderSchema = z.object({
    name: z.string().min(1, "Folder name is required")
});

export const createTradeFolder = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { name } = createFolderSchema.parse(req.body);

        // Check if folder with same name exists for this user
        const existingFolder = await prisma.tradeFolder.findUnique({
            where: {
                userId_name: {
                    userId,
                    name
                }
            }
        });

        if (existingFolder) {
            return res.status(409).json({ message: "Folder with this name already exists" });
        }

        const folder = await prisma.tradeFolder.create({
            data: {
                name,
                userId
            },
            include: {
                _count: {
                    select: { trades: true }
                }
            }
        });

        res.status(201).json(folder);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: (error as any).errors });
        }
        console.error('Create trade folder error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTradeFolders = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;

        const folders = await prisma.tradeFolder.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { trades: true }
                }
            }
        });

        res.json(folders);
    } catch (error) {
        console.error('Get trade folders error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteTradeFolder = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const id = req.params.id as string;

        const folder = await prisma.tradeFolder.findUnique({
            where: { id }
        });

        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        if (folder.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Delete folder (and trades inside it - cascade is not set in schema for manual delete, OR we can set logic here)
        // In Schema we didn't set onDelete Cascade for Trade->TradeFolder relation. 
        // User requested: "make the same folder this for Trades section... also drag and put trades to files"
        // Previous Journal implementation deleted entries. Let's replicate that behavior for consistency.

        // Delete all trades in this folder
        await prisma.trade.deleteMany({
            where: { folderId: id }
        });

        await prisma.tradeFolder.delete({
            where: { id }
        });

        res.status(200).json({ message: "Folder and its trades deleted successfully" });
    } catch (error) {
        console.error('Delete trade folder error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
