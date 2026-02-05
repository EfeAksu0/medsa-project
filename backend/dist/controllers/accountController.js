"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.updateAccount = exports.getAccountById = exports.getAccounts = exports.createAccount = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../prisma");
const accountSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    type: zod_1.z.string().min(1),
    currentBalance: zod_1.z.number(),
    goalBalance: zod_1.z.number().optional().nullable(),
});
const createAccount = async (req, res, next) => {
    try {
        console.log('Creating account with body:', req.body);
        const userId = req.user.userId;
        const data = accountSchema.parse(req.body);
        const account = await prisma_1.prisma.account.create({
            data: {
                ...data,
                userId,
            },
        });
        console.log('Account created:', account);
        res.status(201).json(account);
    }
    catch (error) {
        console.error('Create account error:', error);
        next(error);
    }
};
exports.createAccount = createAccount;
const getAccounts = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const accounts = await prisma_1.prisma.account.findMany({
            where: {
                userId,
                deletedAt: null
            },
            include: {
                _count: {
                    select: { trades: true }
                },
                trades: {
                    where: {
                        deletedAt: null,
                        folderId: null
                    },
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
        const accountsWithMetrics = accounts.map((account) => {
            const trades = account.trades;
            const completedTrades = trades.filter((t) => t.result !== 'OPEN');
            const totalTrades = completedTrades.length;
            const wins = completedTrades.filter((t) => t.result === 'WIN').length;
            const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
            const netPnL = trades.reduce((sum, t) => sum + (Number(t.pnl) || 0), 0);
            return {
                ...account,
                winRate,
                netPnL,
                totalTrades: account.trades.length
            };
        });
        res.json(accountsWithMetrics);
    }
    catch (error) {
        next(error);
    }
};
exports.getAccounts = getAccounts;
const getAccountById = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const account = await prisma_1.prisma.account.findFirst({
            where: {
                id,
                userId,
                deletedAt: null
            },
            include: {
                trades: true
            }
        });
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        res.json(account);
    }
    catch (error) {
        next(error);
    }
};
exports.getAccountById = getAccountById;
const updateAccount = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const data = accountSchema.partial().parse(req.body);
        const existingAccount = await prisma_1.prisma.account.findFirst({ where: { id, userId, deletedAt: null } });
        if (!existingAccount) {
            return res.status(404).json({ error: 'Account not found' });
        }
        const account = await prisma_1.prisma.account.update({
            where: { id },
            data,
        });
        res.json(account);
    }
    catch (error) {
        next(error);
    }
};
exports.updateAccount = updateAccount;
const deleteAccount = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const existingAccount = await prisma_1.prisma.account.findFirst({ where: { id, userId, deletedAt: null } });
        if (!existingAccount) {
            return res.status(404).json({ error: 'Account not found' });
        }
        // Soft delete
        await prisma_1.prisma.account.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAccount = deleteAccount;
