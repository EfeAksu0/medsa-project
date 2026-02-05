import { Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getTrash = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        // Use any cast to bypass type checking for deletedAt until types are generated
        const [trades, accounts, models] = await Promise.all([
            prisma.trade.findMany({
                where: {
                    userId,
                    NOT: { deletedAt: null }
                } as any,
                orderBy: { deletedAt: 'desc' } as any
            }),
            prisma.account.findMany({
                where: {
                    userId,
                    NOT: { deletedAt: null }
                } as any,
                orderBy: { deletedAt: 'desc' } as any
            }),
            prisma.model.findMany({
                where: {
                    userId,
                    NOT: { deletedAt: null }
                } as any,
                orderBy: { deletedAt: 'desc' } as any
            }),
        ]);

        res.json({ trades, accounts, models });
    } catch (error) {
        next(error);
    }
};

export const restoreItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { type, id } = req.body;

        if (!id || !type) return res.status(400).json({ error: 'Missing type or id' });

        if (type === 'trade') {
            await prisma.trade.updateMany({
                where: { id, userId },
                data: { deletedAt: null } as any
            });
        } else if (type === 'account') {
            await prisma.account.updateMany({
                where: { id, userId },
                data: { deletedAt: null } as any
            });
        } else if (type === 'model') {
            await prisma.model.updateMany({
                where: { id, userId },
                data: { deletedAt: null } as any
            });
        } else {
            return res.status(400).json({ error: 'Invalid type' });
        }

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};

export const permanentlyDeleteItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { type, id } = req.body;

        if (!id || !type) return res.status(400).json({ error: 'Missing type or id' });

        if (type === 'trade') {
            await prisma.trade.deleteMany({ where: { id, userId } });
        } else if (type === 'account') {
            // Check for trade constraints if any, or cascade delete?
            // Prisma schema usually handles cascade if configured, but we might need manual cleanup if not.
            // For now assuming we just delete the account.
            await prisma.account.deleteMany({ where: { id, userId } });
        } else if (type === 'model') {
            await prisma.model.deleteMany({ where: { id, userId } });
        } else {
            return res.status(400).json({ error: 'Invalid type' });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
