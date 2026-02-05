"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permanentlyDeleteItem = exports.restoreItem = exports.getTrash = void 0;
const prisma_1 = require("../prisma");
const getTrash = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        // Use any cast to bypass type checking for deletedAt until types are generated
        const [trades, accounts, models] = await Promise.all([
            prisma_1.prisma.trade.findMany({
                where: {
                    userId,
                    NOT: { deletedAt: null }
                },
                orderBy: { deletedAt: 'desc' }
            }),
            prisma_1.prisma.account.findMany({
                where: {
                    userId,
                    NOT: { deletedAt: null }
                },
                orderBy: { deletedAt: 'desc' }
            }),
            prisma_1.prisma.model.findMany({
                where: {
                    userId,
                    NOT: { deletedAt: null }
                },
                orderBy: { deletedAt: 'desc' }
            }),
        ]);
        res.json({ trades, accounts, models });
    }
    catch (error) {
        next(error);
    }
};
exports.getTrash = getTrash;
const restoreItem = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { type, id } = req.body;
        if (!id || !type)
            return res.status(400).json({ error: 'Missing type or id' });
        if (type === 'trade') {
            await prisma_1.prisma.trade.updateMany({
                where: { id, userId },
                data: { deletedAt: null }
            });
        }
        else if (type === 'account') {
            await prisma_1.prisma.account.updateMany({
                where: { id, userId },
                data: { deletedAt: null }
            });
        }
        else if (type === 'model') {
            await prisma_1.prisma.model.updateMany({
                where: { id, userId },
                data: { deletedAt: null }
            });
        }
        else {
            return res.status(400).json({ error: 'Invalid type' });
        }
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.restoreItem = restoreItem;
const permanentlyDeleteItem = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { type, id } = req.body;
        if (!id || !type)
            return res.status(400).json({ error: 'Missing type or id' });
        if (type === 'trade') {
            await prisma_1.prisma.trade.deleteMany({ where: { id, userId } });
        }
        else if (type === 'account') {
            // Check for trade constraints if any, or cascade delete?
            // Prisma schema usually handles cascade if configured, but we might need manual cleanup if not.
            // For now assuming we just delete the account.
            await prisma_1.prisma.account.deleteMany({ where: { id, userId } });
        }
        else if (type === 'model') {
            await prisma_1.prisma.model.deleteMany({ where: { id, userId } });
        }
        else {
            return res.status(400).json({ error: 'Invalid type' });
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.permanentlyDeleteItem = permanentlyDeleteItem;
