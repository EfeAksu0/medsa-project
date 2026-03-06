"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrade = exports.updateTrade = exports.getTradeById = exports.getTrades = exports.createTrade = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../prisma");
const discord_1 = require("../discord");
const tradeSchema = zod_1.z.object({
    instrument: zod_1.z.string().min(1),
    entryPrice: zod_1.z.number().optional().nullable(),
    exitPrice: zod_1.z.number().optional().nullable(),
    stopLoss: zod_1.z.number().optional().nullable(),
    takeProfit: zod_1.z.number().optional().nullable(),
    quantity: zod_1.z.number().optional().nullable(),
    pnl: zod_1.z.number().optional().nullable(),
    risk: zod_1.z.number().optional().nullable(),
    reward: zod_1.z.number().optional().nullable(),
    result: zod_1.z.enum(['WIN', 'LOSS', 'BREAKEVEN', 'OPEN']).default('OPEN'),
    notes: zod_1.z.string().optional(),
    tradeDate: zod_1.z.string().optional(), // Accepts YYYY-MM-DD or ISO
    exitDate: zod_1.z.string().optional().nullable(), // Accepts YYYY-MM-DD or ISO
    strategy: zod_1.z.string().optional(),
    // Session, account, model relations will be added separately
    accountId: zod_1.z.string().optional().nullable(),
    modelId: zod_1.z.string().optional().nullable(),
    sessionId: zod_1.z.string().optional().nullable(),
    folderId: zod_1.z.string().optional().nullable(),
    imageUrl: zod_1.z.string().optional().nullable(), // Base64 string
});
const createTrade = async (req, res, next) => {
    try {
        console.log('Creating trade with body:', req.body);
        const userId = req.user.userId;
        console.log('User ID:', userId);
        const data = tradeSchema.parse(req.body);
        console.log('Parsed data:', data);
        const trade = await prisma_1.prisma.trade.create({
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
        prisma_1.prisma.user.findUnique({ where: { id: userId } }).then(user => {
            if (user) {
                (0, discord_1.notifyNewTrade)(trade, user.name || 'Anonymous Trader').catch(e => console.error('Discord Notification Error:', e));
            }
        });
        res.status(201).json(trade);
    }
    catch (error) {
        console.error('Error creating trade:', error);
        next(error);
    }
};
exports.createTrade = createTrade;
const getTrades = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { folderId, root } = req.query;
        const where = {
            userId,
            deletedAt: null,
        };
        if (folderId) {
            where.folderId = folderId;
        }
        else if (root === 'true') {
            where.folderId = null;
        }
        const trades = await prisma_1.prisma.trade.findMany({
            where,
            orderBy: {
                tradeDate: 'desc',
            },
        });
        res.json({ trades });
    }
    catch (error) {
        next(error);
    }
};
exports.getTrades = getTrades;
const getTradeById = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const trade = await prisma_1.prisma.trade.findFirst({
            where: {
                id: id,
                userId,
                deletedAt: null,
            },
        });
        if (!trade) {
            return res.status(404).json({ error: 'Trade not found' });
        }
        res.json(trade);
    }
    catch (error) {
        next(error);
    }
};
exports.getTradeById = getTradeById;
const updateTrade = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const data = tradeSchema.partial().parse(req.body);
        const existingTrade = await prisma_1.prisma.trade.findFirst({ where: { id: id, userId, deletedAt: null } });
        if (!existingTrade) {
            return res.status(404).json({ error: 'Trade not found' });
        }
        const trade = await prisma_1.prisma.trade.update({
            where: { id: id },
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
    }
    catch (error) {
        next(error);
    }
};
exports.updateTrade = updateTrade;
const deleteTrade = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const existingTrade = await prisma_1.prisma.trade.findFirst({ where: { id: id, userId, deletedAt: null } });
        if (!existingTrade) {
            return res.status(404).json({ error: 'Trade not found' });
        }
        await prisma_1.prisma.trade.update({
            where: { id: id },
            data: { deletedAt: new Date() }
        });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTrade = deleteTrade;
