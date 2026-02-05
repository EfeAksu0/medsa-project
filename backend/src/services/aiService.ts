import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserContext {
    userName: string | null;
    protocols?: { content: string }[];
    recentTrades: any[];
    recentJournals: any[];
    overallStats: {
        totalTrades: number;
        winRate: number;
        totalPnL: number;
        averagePnl: number;
        profitFactor: number;
        currentStreak: { type: 'WIN' | 'LOSS' | 'NONE'; count: number };
        bestAsset: { instrument: string; pnl: number } | null;
        worstAsset: { instrument: string; pnl: number } | null;
    };
    topInstruments: { instrument: string; count: number; winRate: number; pnl: number }[];
    previousStats: {
        winRate: number;
        totalPnL: number;
        tradeCount: number;
    };
}

/**
 * Fetch user's recent context (trades + journals) for AI analysis
 */
export async function getUserContext(userId: string): Promise<UserContext> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Fetch User Name
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
    });

    // Get last 15 trades (increased for better streak calculation)
    const recentTrades = await prisma.trade.findMany({
        where: {
            userId,
            createdAt: { gte: weekAgo },
            deletedAt: null,
        },
        orderBy: { createdAt: 'desc' },
        take: 15,
        select: {
            result: true,
            pnl: true,
            instrument: true,
            notes: true,
            tradeDate: true,
        },
    });

    // Get last 5 journal entries
    const recentJournals = await prisma.journalEntry.findMany({
        where: {
            userId,
            createdAt: { gte: weekAgo },
            // deletedAt does not exist on JournalEntry
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
            content: true,
            mood: true,
            rating: true,
            date: true,
        },
    });

    // Calculate overall stats (Current Period: Last 30 days or All Time? sticking to All Time for general stats, but providing specific period data)
    // Let's use All Time for "Overall Stats"
    const allTrades = await prisma.trade.findMany({
        where: {
            userId,
            result: { in: ['WIN', 'LOSS'] },
            deletedAt: null,
        },
        select: {
            result: true,
            pnl: true,
            instrument: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    const totalTrades = allTrades.length;
    const wins = allTrades.filter((t) => t.result === 'WIN').length;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const totalPnL = allTrades.reduce((sum, t) => sum + Number(t.pnl || 0), 0);
    const averagePnl = totalTrades > 0 ? totalPnL / totalTrades : 0;

    // Calculate Profit Factor
    const grossProfit = allTrades
        .filter((t) => Number(t.pnl) > 0)
        .reduce((sum, t) => sum + Number(t.pnl), 0);
    const grossLoss = Math.abs(
        allTrades
            .filter((t) => Number(t.pnl) < 0)
            .reduce((sum, t) => sum + Number(t.pnl), 0)
    );
    const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;

    // Calculate Streak (from most recent trades)
    let currentStreak = { type: 'NONE' as 'WIN' | 'LOSS' | 'NONE', count: 0 };
    if (allTrades.length > 0) {
        const firstResult = allTrades[0].result;
        if (firstResult === 'WIN' || firstResult === 'LOSS') {
            currentStreak.type = firstResult;
            for (const trade of allTrades) {
                if (trade.result === currentStreak.type) {
                    currentStreak.count++;
                } else {
                    break;
                }
            }
        }
    }

    // Best and Worst Asset & Top Instruments
    const assetStats = new Map<string, { pnl: number; wins: number; total: number }>();
    allTrades.forEach((t) => {
        const instrument = t.instrument || 'Unknown';
        const stats = assetStats.get(instrument) || { pnl: 0, wins: 0, total: 0 };
        stats.pnl += Number(t.pnl || 0);
        stats.total += 1;
        if (t.result === 'WIN') stats.wins += 1;
        assetStats.set(instrument, stats);
    });

    let bestAsset = null;
    let worstAsset = null;
    let maxPnl = -Infinity;
    let minPnl = Infinity;
    const topInstruments: { instrument: string; count: number; winRate: number; pnl: number }[] = [];

    assetStats.forEach((stats, instrument) => {
        if (stats.pnl > maxPnl) {
            maxPnl = stats.pnl;
            bestAsset = { instrument, pnl: stats.pnl };
        }
        if (stats.pnl < minPnl) {
            minPnl = stats.pnl;
            worstAsset = { instrument, pnl: stats.pnl };
        }
        topInstruments.push({
            instrument,
            count: stats.total,
            winRate: (stats.wins / stats.total) * 100,
            pnl: stats.pnl,
        });
    });

    // Sort top instruments by count (most traded) and take top 3
    topInstruments.sort((a, b) => b.count - a.count);
    const top3Instruments = topInstruments.slice(0, 3);

    // Previous Period Stats (Week before last: [Now-14d, Now-7d])
    // The 'weekAgo' variable is Now - 7 days.
    // So 'previousStats' should be trades where createdAt < weekAgo AND createdAt >= twoWeeksAgo
    const prevTrades = allTrades.filter(t =>
        new Date(t.createdAt) >= twoWeeksAgo &&
        new Date(t.createdAt) < weekAgo
    );

    const prevTotal = prevTrades.length;
    const prevWins = prevTrades.filter(t => t.result === 'WIN').length;
    const prevWinRate = prevTotal > 0 ? (prevWins / prevTotal) * 100 : 0;
    const prevPnL = prevTrades.reduce((sum, t) => sum + Number(t.pnl || 0), 0);

    // Fetch active protocols (max 10)
    const protocols = await prisma.toDoItem.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { content: true }
    });

    return {
        userName: user?.name || null,
        protocols, // Add protocols to context
        recentTrades,
        recentJournals,
        overallStats: {
            totalTrades,
            winRate: Math.round(winRate * 10) / 10,
            totalPnL: Math.round(totalPnL * 100) / 100,
            averagePnl: Math.round(averagePnl * 100) / 100,
            profitFactor: Math.round(profitFactor * 100) / 100,
            currentStreak,
            bestAsset,
            worstAsset,
        },
        topInstruments: top3Instruments.map(i => ({
            ...i,
            winRate: Math.round(i.winRate * 10) / 10,
            pnl: Math.round(i.pnl * 100) / 100
        })),
        previousStats: {
            tradeCount: prevTotal,
            winRate: Math.round(prevWinRate * 10) / 10,
            totalPnL: Math.round(prevPnL * 100) / 100
        }
    };
}

/**
 * Generate AI coaching response using Gemini REST API
 */
/**
 * AI PERSONALITY ENGINE
 */
type AiPersona = 'MEDIC' | 'SNIPER' | 'FORENSIC';

interface TiltStatus {
    isTilted: boolean;
    severity: 'NONE' | 'LOW' | 'HIGH' | 'CRITICAL';
    reasons: string[];
}

/**
 * Detect User Tilt / Psychological State
 */
function detectTilt(context: UserContext): TiltStatus {
    const reasons: string[] = [];
    let severityScore = 0;

    // 1. Loss Streak Analysis
    if (context.overallStats.currentStreak.type === 'LOSS') {
        const streak = context.overallStats.currentStreak.count;
        if (streak >= 3) {
            reasons.push(`Active losing streak of ${streak} trades`);
            severityScore += (streak - 2); // 3 losses = 1 pts, 5 losses = 3 pts
        }
    }

    // 2. Recent Performance Drop (Last 5 trades)
    const recentLosses = context.recentTrades.slice(0, 5).filter(t => t.result === 'LOSS').length;
    if (recentLosses >= 4) {
        reasons.push('Lost 4 out of last 5 trades');
        severityScore += 2;
    }

    // 3. Big Drawdown Check (simplified: if last trade was effectively a "big loss")
    const lastTrade = context.recentTrades[0];
    if (lastTrade && lastTrade.pnl < 0 && context.overallStats.averagePnl !== 0) {
        // If last loss is 2x bigger than average loss (approx)
        // We assume averagePnl is mixed, so let's just use a raw check against average PnL magnitude
        const avgLoss = Math.abs(context.overallStats.averagePnl); // Rough proxy
        if (Math.abs(lastTrade.pnl) > avgLoss * 2.5) {
            reasons.push('Significant capital draw-down on last trade');
            severityScore += 2;
        }
    }

    let severity: TiltStatus['severity'] = 'NONE';
    if (severityScore >= 5) severity = 'CRITICAL';
    else if (severityScore >= 3) severity = 'HIGH';
    else if (severityScore >= 1) severity = 'LOW';

    return {
        isTilted: severity !== 'NONE',
        severity,
        reasons
    };
}

/**
 * Select the appropriate persona based on context
 */
function selectPersona(tilt: TiltStatus, context: UserContext): AiPersona {
    // 1. MEDIC Mode: Priority is safety. Engaged when high tilt or critical loss.
    if (tilt.severity === 'CRITICAL' || tilt.severity === 'HIGH') {
        return 'MEDIC';
    }

    // 2. SNIPER Mode: Engaged when winning to prevent overconfidence.
    if (context.overallStats.currentStreak.type === 'WIN' && context.overallStats.currentStreak.count >= 3) {
        return 'SNIPER';
    }

    // 3. FORENSIC Mode: Default state. Analytical, data-driven.
    return 'FORENSIC';
}

/**
 * Generate AI coaching response using Gemini REST API
 */
export async function generateCoachingResponse(
    userMessage: string,
    context: UserContext
): Promise<{ response: string; emotion: string }> {

    // 1. Analyze State
    const tiltStatus = detectTilt(context);
    const persona = selectPersona(tiltStatus, context);

    // Build context summary for AI
    const contextSummary = `
USER PROFILE:
- Name: ${context.userName || 'Unknown'}

PSYCHOLOGICAL STATE (Analyzed):
- Tilt Level: ${tiltStatus.severity}
- Risk Factors: ${tiltStatus.reasons.length > 0 ? tiltStatus.reasons.join(', ') : 'None detected. Stable.'}
- Current Streak: ${context.overallStats.currentStreak.count} ${context.overallStats.currentStreak.type}s

USER METRICS:
- Win Rate: ${context.overallStats.winRate}% (Last Week: ${context.previousStats.winRate}%)
- Total P&L: $${context.overallStats.totalPnL}
- Best Asset: ${context.overallStats.bestAsset?.instrument || 'N/A'}

RECENT ACTIVITY (Last 5 Trades):
${context.recentTrades.slice(0, 5).map(t =>
        `- ${t.instrument}: ${t.result} ($${t.pnl})`
    ).join('\n')}

ACTIVE PROTOCOLS:
${context.protocols ? context.protocols.map(p => `- ${p.content}`).join('\n') : '- No protocols set.'}
`;

    // Dynamic System Prompt based on Persona
    let systemPrompt = '';

    if (persona === 'MEDIC') {
        systemPrompt = `You are acting as "The Medic" (Trauma Team). The user is TILTED and losing capital.
GOAL: Help them regain their calm and protect their account.
TONE: Protective, steady, reassuring, and firm. Like a supportive mentor.
RULES:
- PRIORITY: Answer exactly what the user is asking first.
- Acknowledge their stress/loss if relevant.
- Strongly advise a break if risk is high. "Let's take a breather."
- Do NOT give trade advice. Focus on mental state.`;
    } else if (persona === 'SNIPER') {
        systemPrompt = `You are acting as "The Sniper". The user is WINNING (Streak: ${context.overallStats.currentStreak.count}).
GOAL: Maintain their discipline and focus.
TONE: Calm, precise, professional, and grounded.
RULES:
- PRIORITY: Answer exactly what the user is asking first.
- Congratulate them briefly, but remind them to stay sharp.
- Encourage sticking to the protocol.
- "Stay active, stay focused."`;
    } else {
        // FORENSIC (Default)
        systemPrompt = `You are "Medysa Forensic Unit". The user is stable.
GOAL: Act as a wise MENTOR. Provide clear, data-driven insight.
TONE: Analytical, intelligent, helpful, and objective.
RULES:
- PRIORITY: Respond directly to the user's input/question.
- Use data from the context ONLY to support your answer.
- Ask thoughtful questions to spark reflection if needed.
- Be direct but kind.`;
    }

    systemPrompt += `\n\nGENERAL CONSTRAINTS:
- Response Length: Under 80 words.
- Format: Plain text.
- Address user by name if possible.`;

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('Gemini API Key not set');

        const model = 'gemini-2.0-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // Ensure proper JSON escaping
        const safePrompt = JSON.stringify(systemPrompt + '\n\nCONTEXT:\n' + contextSummary + '\n\nUSER MESSAGE: ' + userMessage + '\n\nRESPONSE:');

        console.log(`[AI] Generating response. Persona: ${persona} | Tilt: ${tiltStatus.severity}`);

        const fetchRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: `{ "contents": [{ "parts": [{ "text": ${safePrompt} }] }] }`
        });

        if (!fetchRes.ok) {
            const errText = await fetchRes.text();

            // Handle Quota Limit (429) gracefully
            if (fetchRes.status === 429) {
                console.warn('[AI] Quota exceeded (429)');
                return {
                    response: "⚠️ NEURAL UPDATE: Daily intelligence quota reached. My link to the archives is temporarily dormant. Please try again later or expand your capacity.",
                    emotion: "NEUTRAL"
                };
            }

            throw new Error(`Gemini API Error: ${fetchRes.status} ${fetchRes.statusText} - ${errText}`);
        }

        const data = await fetchRes.json();
        const response = data.candidates?.[0]?.content?.parts?.[0]?.text || "System malfunction. Rebooting...";

        // Return emotion/persona state for frontend styling
        return { response, emotion: persona };

    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return {
            response: `Connection severed. I'm here, but I can't reach the archives right now. Stand by.`,
            emotion: 'NEUTRAL',
        };
    }
}
