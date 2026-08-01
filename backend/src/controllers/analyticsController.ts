import { Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getOverallStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { startDate, endDate } = req.query;

        const where: any = {
            userId,
            deletedAt: null,
            folderId: null
        };

        if (startDate || endDate) {
            where.tradeDate = {};
            if (startDate) where.tradeDate.gte = startDate as string;
            if (endDate) where.tradeDate.lte = endDate as string;
        }

        const trades = await prisma.trade.findMany({ where });

        let winCount = 0;
        let lossCount = 0;
        let breakevenCount = 0;
        let totalPnL = 0;
        let totalRisk = 0;
        let totalReward = 0;

        trades.forEach((trade: any) => {
            // Strictly use manual Pnl
            let pnl = 0;
            if (trade.pnl !== null && trade.pnl !== undefined) {
                pnl = Number(trade.pnl);
            }


            totalPnL += pnl;

            if (trade.result === 'WIN') {
                winCount++;
                totalReward += pnl;
            } else if (trade.result === 'LOSS') {
                lossCount++;
                totalRisk += Math.abs(pnl);
            } else if (trade.result === 'BREAKEVEN') {
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
    } catch (error) {
        next(error);
    }
};

export const getEquityCurve = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { startDate, endDate } = req.query;

        const where: any = {
            userId,
            deletedAt: null,
            folderId: null
        };

        if (startDate || endDate) {
            where.tradeDate = {};
            if (startDate) where.tradeDate.gte = startDate as string;
            if (endDate) where.tradeDate.lte = endDate as string;
        }

        const trades = await prisma.trade.findMany({
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
        const dailyEquity: Record<string, number> = {};

        trades.forEach((trade: any) => {
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
    } catch (error) {
        next(error);
    }
};

export const getCalendarStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { start, end } = req.query; // Expecting ISO strings or YYYY-MM-DD

        // Default to current month if not provided? 
        // Or actually, let frontend dictate the range.
        // For a calendar view, usually we fetch the whole month + padding.

        const where: any = {
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
            if (start) where.tradeDate.gte = new Date(start as string).toISOString();
            if (end) where.tradeDate.lte = new Date(end as string).toISOString();
        }

        const trades = await prisma.trade.findMany({
            where,
            orderBy: { tradeDate: 'asc' }
        });

        // Aggregate by YYYY-MM-DD
        // We need to be careful about timezones, but tradeDate is stored as string usually or we just take the date part.
        // In our schema tradeDate is String. "YYYY-MM-DD HH:mm:ss" usually.

        const dailyStats: Record<string, {
            date: string;
            pnl: number;
            trades: number;
            wins: number;
            losses: number;
            breakevens: number;
        }> = {};

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

            if (trade.result === 'WIN') stats.wins++;
            else if (trade.result === 'LOSS') stats.losses++;
            else if (trade.result === 'BREAKEVEN') stats.breakevens++;
        });

        // Convert map to array? Or just return the map. Map is easier for frontend lookup by date.
        // Let's return the object/map.
        res.json(dailyStats);

    } catch (error) {
        next(error);
    }
};

export const getBehavioralRiskStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        const trades = await prisma.trade.findMany({
            where: {
                userId,
                deletedAt: null,
                folderId: null
            },
            orderBy: { tradeDate: 'asc' }
        });

        // 1. Time-of-Day Heatmap
        const timeBlocks: Record<string, { label: string; wins: number; losses: number; total: number; netPnL: number }> = {
            '00-06': { label: 'Night Shift (00:00 - 06:00)', wins: 0, losses: 0, total: 0, netPnL: 0 },
            '06-12': { label: 'Morning Session (06:00 - 12:00)', wins: 0, losses: 0, total: 0, netPnL: 0 },
            '12-18': { label: 'US/EU Overlap (12:00 - 18:00)', wins: 0, losses: 0, total: 0, netPnL: 0 },
            '18-24': { label: 'Evening Session (18:00 - 24:00)', wins: 0, losses: 0, total: 0, netPnL: 0 },
        };

        let revengeTradeCount = 0;
        let revengeLossCount = 0;
        let lastTradeTime: Date | null = null;
        let lastTradeResult: string | null = null;

        trades.forEach(trade => {
            const pnl = trade.pnl !== null && trade.pnl !== undefined ? Number(trade.pnl) : 0;
            const tradeDateObj = new Date(trade.tradeDate);
            const hour = isNaN(tradeDateObj.getHours()) ? 12 : tradeDateObj.getHours();

            let blockKey = '12-18';
            if (hour >= 0 && hour < 6) blockKey = '00-06';
            else if (hour >= 6 && hour < 12) blockKey = '06-12';
            else if (hour >= 12 && hour < 18) blockKey = '12-18';
            else if (hour >= 18) blockKey = '18-24';

            const block = timeBlocks[blockKey];
            block.total += 1;
            block.netPnL += pnl;
            if (trade.result === 'WIN') block.wins += 1;
            else if (trade.result === 'LOSS') block.losses += 1;

            // Revenge Trade Detection (Trade within 15 minutes of a loss)
            if (lastTradeTime && lastTradeResult === 'LOSS' && !isNaN(tradeDateObj.getTime())) {
                const minutesDiff = (tradeDateObj.getTime() - lastTradeTime.getTime()) / (1000 * 60);
                if (minutesDiff >= 0 && minutesDiff <= 15) {
                    revengeTradeCount++;
                    if (trade.result === 'LOSS') revengeLossCount++;
                }
            }

            if (!isNaN(tradeDateObj.getTime())) {
                lastTradeTime = tradeDateObj;
                lastTradeResult = trade.result;
            }
        });

        const timeBlockAnalysis = Object.values(timeBlocks).map(b => ({
            ...b,
            winRate: b.total > 0 ? Number(((b.wins / b.total) * 100).toFixed(1)) : 0,
            netPnL: Number(b.netPnL.toFixed(2))
        }));

        const revengeWinRate = revengeTradeCount > 0 
            ? Number((((revengeTradeCount - revengeLossCount) / revengeTradeCount) * 100).toFixed(1)) 
            : 100;

        res.json({
            timeBlockAnalysis,
            revengeStats: {
                detectedRevengeTrades: revengeTradeCount,
                revengeLosses: revengeLossCount,
                revengeWinRate,
                riskAlert: revengeTradeCount > 2 && revengeWinRate < 40 
                    ? '⚠️ High Risk: Elevated revenge trading detected post-loss.' 
                    : '✅ Execution protocol stable.'
            }
        });
    } catch (error) {
        next(error);
    }
};

