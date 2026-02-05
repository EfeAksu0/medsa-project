"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteModel = exports.updateModel = exports.getModelById = exports.getModels = exports.createModel = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../prisma");
const modelSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    symbol: zod_1.z.string().optional().nullable(),
});
const createModel = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const data = modelSchema.parse(req.body);
        const model = await prisma_1.prisma.model.create({
            data: {
                ...data,
                userId,
            },
        });
        res.status(201).json(model);
    }
    catch (error) {
        next(error);
    }
};
exports.createModel = createModel;
const getModels = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const models = await prisma_1.prisma.model.findMany({
            where: {
                userId,
                deletedAt: null
            },
            include: {
                _count: {
                    select: { trades: true }
                },
                trades: {
                    where: { deletedAt: null },
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
        const modelsWithMetrics = models.map((model) => {
            const trades = model.trades;
            const totalTrades = trades.length;
            const wins = trades.filter((t) => t.result === 'WIN').length;
            const losses = trades.filter((t) => t.result === 'LOSS').length;
            const breakevens = trades.filter((t) => t.result === 'BREAKEVEN').length;
            // Win rate excluding breakevens
            const tradesWithoutBE = totalTrades - breakevens;
            const winRate = tradesWithoutBE > 0 ? (wins / tradesWithoutBE) * 100 : 0;
            // Calculate average SL, RR
            let totalSL = 0;
            let slCount = 0;
            let totalRR = 0;
            let maxRR = 0;
            let rrCount = 0;
            trades.forEach((trade) => {
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
                        if (rr > maxRR)
                            maxRR = rr;
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
    }
    catch (error) {
        next(error);
    }
};
exports.getModels = getModels;
const getModelById = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const model = await prisma_1.prisma.model.findFirst({
            where: { id, userId, deletedAt: null },
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
    }
    catch (error) {
        next(error);
    }
};
exports.getModelById = getModelById;
const updateModel = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const data = modelSchema.partial().parse(req.body);
        const existingModel = await prisma_1.prisma.model.findFirst({ where: { id, userId, deletedAt: null } });
        if (!existingModel) {
            return res.status(404).json({ error: 'Model not found' });
        }
        const model = await prisma_1.prisma.model.update({
            where: { id },
            data,
        });
        res.json(model);
    }
    catch (error) {
        next(error);
    }
};
exports.updateModel = updateModel;
const deleteModel = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const existingModel = await prisma_1.prisma.model.findFirst({ where: { id, userId, deletedAt: null } });
        if (!existingModel) {
            return res.status(404).json({ error: 'Model not found' });
        }
        await prisma_1.prisma.model.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteModel = deleteModel;
