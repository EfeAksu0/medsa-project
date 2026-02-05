import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/authMiddleware';

const modelSchema = z.object({
    name: z.string().min(1),
    symbol: z.string().optional().nullable(),
});

export const createModel = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const data = modelSchema.parse(req.body);

        const model = await prisma.model.create({
            data: {
                ...data,
                userId,
            },
        });

        res.status(201).json(model);
    } catch (error) {
        next(error);
    }
};

export const getModels = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        const models = await prisma.model.findMany({
            where: {
                userId,
                deletedAt: null
            } as any,
            include: {
                _count: {
                    select: { trades: true }
                },
                trades: {
                    where: { deletedAt: null } as any,
                    select: {
                        result: true,
                        entryPrice: true,
                        exitPrice: true,
                        quantity: true,
                        stopLoss: true,
                        takeProfit: true,
                        pnl: true
                    }
                }
            },
        });

        // Calculate metrics for each model
        const modelsWithMetrics = models.map((model: any) => {
            const trades = model.trades;
            const totalTrades = trades.length;
            const wins = trades.filter((t: any) => t.result === 'WIN').length;
            const losses = trades.filter((t: any) => t.result === 'LOSS').length;
            const breakevens = trades.filter((t: any) => t.result === 'BREAKEVEN').length;

            // Win rate excluding breakevens
            const tradesWithoutBE = totalTrades - breakevens;
            const winRate = tradesWithoutBE > 0 ? (wins / tradesWithoutBE) * 100 : 0;

            // Calculate average SL, RR
            let totalSL = 0;
            let slCount = 0;
            let totalRR = 0;
            let maxRR = 0;
            let rrCount = 0;

            trades.forEach((trade: any) => {
                const entry = Number(trade.entryPrice);
                const sl = Number(trade.stopLoss);
                const tp = Number(trade.takeProfit);

                if (sl && entry) {
                    const slDiff = Math.abs(entry - sl);
                    totalSL += slDiff;
                    slCount++;
                }

                if (tp && entry && sl) {
                    const tpDiff = Math.abs(tp - entry);
                    const slDiff = Math.abs(entry - sl);
                    if (slDiff > 0) {
                        const rr = tpDiff / slDiff;
                        totalRR += rr;
                        rrCount++;
                        if (rr > maxRR) maxRR = rr;
                    }
                }
            });

            const avgSL = slCount > 0 ? totalSL / slCount : 0;
            const avgRR = rrCount > 0 ? totalRR / rrCount : 0;

            return {
                id: model.id,
                name: model.name,
                symbol: model.symbol,
                winRate: Math.round(winRate * 10) / 10,
                totalTrades,
                wins,
                losses,
                breakevens,
                avgSL: Math.round(avgSL * 100) / 100,
                avgRR: Math.round(avgRR * 100) / 100,
                maxRR: Math.round(maxRR * 100) / 100,
                createdAt: model.createdAt,
                updatedAt: model.updatedAt
            };
        });

        res.json(modelsWithMetrics);
    } catch (error) {
        next(error);
    }
};

export const getModelById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const id = req.params.id as string;

        const model = await prisma.model.findFirst({
            where: { id, userId, deletedAt: null } as any,
            include: {
                _count: {
                    select: { trades: true }
                }
            }
        });

        if (!model) {
            return res.status(404).json({ error: 'Model not found' });
        }

        res.json(model);
    } catch (error) {
        next(error);
    }
};

export const updateModel = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const id = req.params.id as string;
        const data = modelSchema.partial().parse(req.body);

        const existingModel = await prisma.model.findFirst({ where: { id, userId, deletedAt: null } as any });
        if (!existingModel) {
            return res.status(404).json({ error: 'Model not found' });
        }

        const model = await prisma.model.update({
            where: { id },
            data,
        });

        res.json(model);
    } catch (error) {
        next(error);
    }
};

export const deleteModel = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const id = req.params.id as string;

        const existingModel = await prisma.model.findFirst({ where: { id, userId, deletedAt: null } as any });
        if (!existingModel) {
            return res.status(404).json({ error: 'Model not found' });
        }

        await prisma.model.update({
            where: { id },
            data: { deletedAt: new Date() } as any
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
