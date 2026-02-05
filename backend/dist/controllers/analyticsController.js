"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalendarStats = exports.getEquityCurve = exports.getOverallStats = void 0;
const prisma_1 = require("../prisma");
const getOverallStats = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { startDate, endDate } = req.query;
        const where = {
            userId,
            deletedAt: null,
            folderId: null
        };
        if (startDate || endDate) {
            where.tradeDate = {};
            if (startDate)
                where.tradeDate.gte = startDate;
            if (endDate)
                where.tradeDate.lte = endDate;
        }
        const trades = await prisma_1.prisma.trade.findMany({ where });
        let winCount = 0;
        let lossCount = 0;
        let breakevenCount = 0;
        let totalPnL = 0;
        let totalRisk = 0;
        let totalReward = 0;
        trades.forEach((trade) => {
            // Strictly use manual Pnl
            let pnl = 0;
            if (trade.pnl !== null && trade.pnl !== undefined) {
                pnl = Number(trade.pnl);
            }
            totalPnL += pnl;
            if (trade.result === 'WIN') {
                winCount++;
                totalReward += pnl;
            }
            else if (trade.result === 'LOSS') {
                lossCount++;
                totalRisk += Math.abs(pnl);
            }
            else if (trade.result === 'BREAKEVEN') {
                breakevenCount++;
            }
        });
        const totalTrades = winCount + lossCount + breakevenCount;
        const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;
        const profitFactor = totalRisk > 0 ? totalReward / totalRisk : 0;
        res.json({
            totalTrades,
            winRate: Number(winRate.toFixed(2)),
            profitFactor: Number(profitFactor.toFixed(2)),
            netPnL: Number(totalPnL.toFixed(2)),
            winCount,
            lossCount,
            breakevenCount
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOverallStats = getOverallStats;
const getEquityCurve = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { startDate, endDate } = req.query;
        const where = {
            userId,
            deletedAt: null,
            folderId: null
        };
        if (startDate || endDate) {
            where.tradeDate = {};
            if (startDate)
                where.tradeDate.gte = startDate;
            if (endDate)
                where.tradeDate.lte = endDate;
        }
        const trades = await prisma_1.prisma.trade.findMany({
            where,
            orderBy: { tradeDate: 'asc' },
            select: {
                tradeDate: true,
                pnl: true
            }
        });
        // Current cumulative PnL
        let cumulativePnL = 0;
        // Group by day to make the curve smoother and more accurate for charting
        const dailyEquity = {};
        trades.forEach((trade) => {
            const pnl = trade.pnl !== null && trade.pnl !== undefined ? Number(trade.pnl) : 0;
            cumulativePnL += pnl;
            // Use date part only for grouping (YYYY-MM-DD)
            const dateKey = trade.tradeDate.substring(0, 10);
            dailyEquity[dateKey] = Number(cumulativePnL.toFixed(2));
        });
        // Convert grouped object to sorted array of points
        const curve = Object.entries(dailyEquity).map(([date, equity]) => ({
            date,
            equity
        })).sort((a, b) => a.date.localeCompare(b.date));
        // Add a starting point of 0 if we have data
        if (curve.length > 0) {
            const firstDate = new Date(curve[0].date);
            firstDate.setDate(firstDate.getDate() - 1);
            const startPoint = {
                date: firstDate.toISOString().substring(0, 10),
                equity: 0
            };
            curve.unshift(startPoint);
        }
        res.json(curve);
    }
    catch (error) {
        next(error);
    }
};
exports.getEquityCurve = getEquityCurve;
const getCalendarStats = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { start, end } = req.query; // Expecting ISO strings or YYYY-MM-DD
        // Default to current month if not provided? 
        // Or actually, let frontend dictate the range.
        // For a calendar view, usually we fetch the whole month + padding.
        const where = {
            userId,
            deletedAt: null,
            folderId: null,
            // We want all trades that have a date, regardless of status actually?
            // Usually calendar shows closed trades PnL.
            // Let's stick to showing ALL trades but PnL only from closed/valid ones?
            // User request implies PnL calendar, so mainly closed trades.
            // But if I opened a trade today, I might want to see it.
            // Let's include all non-deleted trades and let the logic handle PnL summing.
            // Actually, keep safe: only count PNL from fully valid numeric values.
        };
        if (start || end) {
            where.tradeDate = {};
            if (start)
                where.tradeDate.gte = new Date(start).toISOString();
            if (end)
                where.tradeDate.lte = new Date(end).toISOString();
        }
        const trades = await prisma_1.prisma.trade.findMany({
            where,
            orderBy: { tradeDate: 'asc' }
        });
        // Aggregate by YYYY-MM-DD
        // We need to be careful about timezones, but tradeDate is stored as string usually or we just take the date part.
        // In our schema tradeDate is String. "YYYY-MM-DD HH:mm:ss" usually.
        const dailyStats = {};
        trades.forEach(trade => {
            // Extract YYYY-MM-DD from the tradeDate string
            // Assuming tradeDate format "YYYY-MM-DD..."
            const day = trade.tradeDate.substring(0, 10);
            if (!dailyStats[day]) {
                dailyStats[day] = {
                    date: day,
                    pnl: 0,
                    trades: 0,
                    wins: 0,
                    losses: 0,
                    breakevens: 0
                };
            }
            const stats = dailyStats[day];
            stats.trades += 1;
            // Only add PnL if it exists
            if (trade.pnl !== null && trade.pnl !== undefined) {
                stats.pnl += Number(trade.pnl);
            }
            if (trade.result === 'WIN')
                stats.wins++;
            else if (trade.result === 'LOSS')
                stats.losses++;
            else if (trade.result === 'BREAKEVEN')
                stats.breakevens++;
        });
        // Convert map to array? Or just return the map. Map is easier for frontend lookup by date.
        // Let's return the object/map.
        res.json(dailyStats);
    }
    catch (error) {
        next(error);
    }
};
exports.getCalendarStats = getCalendarStats;
