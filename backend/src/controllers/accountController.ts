import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/authMiddleware';

const accountSchema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    currentBalance: z.number(),
    goalBalance: z.number().optional().nullable(),
});

export const createAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        console.log('Creating account with body:', req.body);
        const userId = req.user!.userId;
        const data = accountSchema.parse(req.body);

        const account = await prisma.account.create({
            data: {
                ...data,
                userId,
            },
        });
        console.log('Account created:', account);

        res.status(201).json(account);
    } catch (error) {
        console.error('Create account error:', error);
        next(error);
    }
};

export const getAccounts = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        const accounts = await prisma.account.findMany({
            where: {
                userId,
                deletedAt: null
            } as any,
            include: {
                _count: {
                    select: { trades: true }
                },
                trades: {
                    where: {
                        deletedAt: null,
                        folderId: null
                    } as any,
                    select: {
                        result: true,
                        entryPrice: true,
                        exitPrice: true,
                        quantity: true,
                        pnl: true
                    }
                }
            },
        });

        // Calculate metrics for each account
        const accountsWithMetrics = accounts.map((account: any) => {
            const trades = account.trades;
            const completedTrades = trades.filter((t: any) => t.result !== 'OPEN');
            const totalTrades = completedTrades.length;
            const wins = completedTrades.filter((t: any) => t.result === 'WIN').length;
            const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
            const netPnL = trades.reduce((sum: number, t: any) => sum + (Number(t.pnl) || 0), 0);

            return {
                ...account,
                winRate,
                netPnL,
                totalTrades: account.trades.length
            };
        });

        res.json(accountsWithMetrics);
    } catch (error) {
        next(error);
    }
};

export const getAccountById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const id = req.params.id as string;

        const account = await prisma.account.findFirst({
            where: {
                id,
                userId,
                deletedAt: null
            } as any,
            include: {
                trades: true
            }
        });

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.json(account);
    } catch (error) {
        next(error);
    }
};

export const updateAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const id = req.params.id as string;
        const data = accountSchema.partial().parse(req.body);

        const existingAccount = await prisma.account.findFirst({ where: { id, userId, deletedAt: null } as any });
        if (!existingAccount) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const account = await prisma.account.update({
            where: { id },
            data,
        });

        res.json(account);
    } catch (error) {
        next(error);
    }
};

export const deleteAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const id = req.params.id as string;

        const existingAccount = await prisma.account.findFirst({ where: { id, userId, deletedAt: null } as any });
        if (!existingAccount) {
            return res.status(404).json({ error: 'Account not found' });
        }

        // Soft delete
        await prisma.account.update({
            where: { id },
            data: { deletedAt: new Date() } as any
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
