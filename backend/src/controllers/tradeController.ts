import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { notifyNewTrade } from '../discord';


const tradeSchema = z.object({
    instrument: z.string().min(1),
    entryPrice: z.number().optional().nullable(),
    exitPrice: z.number().optional().nullable(),
    stopLoss: z.number().optional().nullable(),
    takeProfit: z.number().optional().nullable(),
    quantity: z.number().optional().nullable(),
    pnl: z.number().optional().nullable(),
    risk: z.number().optional().nullable(),
    reward: z.number().optional().nullable(),
    result: z.enum(['WIN', 'LOSS', 'BREAKEVEN', 'OPEN']).default('OPEN'),
    notes: z.string().optional(),
    tradeDate: z.string().optional(), // Accepts YYYY-MM-DD or ISO
    exitDate: z.string().optional().nullable(), // Accepts YYYY-MM-DD or ISO
    strategy: z.string().optional(),
    // Session, account, model relations will be added separately
    accountId: z.string().optional().nullable(),
    modelId: z.string().optional().nullable(),
    sessionId: z.string().optional().nullable(),
    folderId: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(), // Base64 string
});

export const createTrade = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        console.log('Creating trade with body:', req.body);
        const userId = req.user!.userId;
        const data = tradeSchema.parse(req.body);

        // Security Check: Verify ownership of linked entities
        if (data.accountId) {
            const acc = await prisma.account.findFirst({ where: { id: data.accountId, userId } });
            if (!acc) return res.status(403).json({ error: 'Unauthorized: Account does not belong to you' });
        }
        if (data.modelId) {
            const model = await prisma.model.findFirst({ where: { id: data.modelId, userId } });
            if (!model) return res.status(403).json({ error: 'Unauthorized: Model does not belong to you' });
        }
        // Note: Session is currently a global model (Asia/London/NY), no ownership check needed.

        if (data.folderId) {
            const folder = await prisma.tradeFolder.findFirst({ where: { id: data.folderId, userId } });
            if (!folder) return res.status(403).json({ error: 'Unauthorized: Folder does not belong to you' });
        }

        const trade = await prisma.trade.create({
            data: {
                ...data,
                entryPrice: data.entryPrice ?? null,
                exitPrice: data.exitPrice ?? null,
                quantity: data.quantity ?? null,
                stopLoss: data.stopLoss ?? null,
                takeProfit: data.takeProfit ?? null,
                pnl: data.pnl ?? null,
                risk: data.risk ?? null,
                reward: data.reward ?? null,
                userId,
                // Use local date format YYYY-MM-DD HH:mm:ss instead of UTC ISO
                tradeDate: data.tradeDate || (() => {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    const seconds = String(now.getSeconds()).padStart(2, '0');
                    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                })(),
                exitDate: data.exitDate || null,
                folderId: data.folderId || null,
                imageUrl: data.imageUrl || null,
            },
        });
        console.log('Trade created:', trade);

        // Notify Discord (Non-blocking)
        prisma.user.findUnique({ where: { id: userId } }).then(user => {
            if (user) {
                notifyNewTrade(trade, user.name || 'Anonymous Trader').catch(e => console.error('Discord Notification Error:', e));
            }
        });


        res.status(201).json(trade);
    } catch (error) {
        console.error('Error creating trade:', error);
        next(error);
    }
};

export const getTrades = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { folderId, root } = req.query;

        const where: any = {
            userId,
            deletedAt: null,
        };

        if (folderId) {
            where.folderId = folderId;
        } else if (root === 'true') {
            where.folderId = null;
        }

        const trades = await prisma.trade.findMany({
            where,
            orderBy: {
                tradeDate: 'desc',
            },
            include: {
                account: { select: { id: true, name: true, type: true } },
                model: { select: { id: true, name: true } },
                session: { select: { id: true, name: true } },
            },
        });
        res.json({ trades });
    } catch (error) {
        next(error);
    }
};

export const getTradeById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;

        const trade = await prisma.trade.findFirst({
            where: {
                id: id as string,
                userId,
                deletedAt: null,
            },
        });

        if (!trade) {
            return res.status(404).json({ error: 'Trade not found' });
        }

        res.json(trade);
    } catch (error) {
        next(error);
    }
};

export const updateTrade = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;
        const data = tradeSchema.partial().parse(req.body);

        const existingTrade = await prisma.trade.findFirst({ where: { id: id as string, userId, deletedAt: null } });
        if (!existingTrade) {
            return res.status(404).json({ error: 'Trade not found' });
        }

        const trade = await prisma.trade.update({
            where: { id: id as string },
            data: {
                ...data,
                entryPrice: data.entryPrice === null ? null : (data.entryPrice || undefined),
                exitPrice: data.exitPrice === null ? null : (data.exitPrice || undefined),
                quantity: data.quantity === null ? null : (data.quantity || undefined),
                stopLoss: data.stopLoss === null ? null : (data.stopLoss || undefined),
                takeProfit: data.takeProfit === null ? null : (data.takeProfit || undefined),
                pnl: data.pnl === null ? null : (data.pnl || undefined),
                risk: data.risk === null ? null : (data.risk || undefined),
                reward: data.reward === null ? null : (data.reward || undefined),
                tradeDate: data.tradeDate || undefined,
                exitDate: data.exitDate || undefined,
                accountId: data.accountId === null ? null : (data.accountId || undefined),
                modelId: data.modelId === null ? null : (data.modelId || undefined),
                sessionId: data.sessionId === null ? null : (data.sessionId || undefined),
                folderId: data.folderId === null ? null : (data.folderId || undefined),
                imageUrl: data.imageUrl === null ? null : (data.imageUrl || undefined),
            },
        });
        res.json(trade);
    } catch (error) {
        next(error);
    }
};

export const deleteTrade = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params;

        const existingTrade = await prisma.trade.findFirst({ where: { id: id as string, userId, deletedAt: null } });
        if (!existingTrade) {
            return res.status(404).json({ error: 'Trade not found' });
        }

        await prisma.trade.update({
            where: { id: id as string },
            data: { deletedAt: new Date() }
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
