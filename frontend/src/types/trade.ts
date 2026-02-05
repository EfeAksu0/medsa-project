export interface Trade {
    id: string;
    instrument: string;
    entryPrice: number;
    exitPrice?: number | null;
    stopLoss?: number | null;
    takeProfit?: number | null;
    quantity: number;
    pnl?: number | null;
    risk?: number | null;
    reward?: number | null;
    result: 'WIN' | 'LOSS' | 'BREAKEVEN' | 'OPEN';
    notes?: string;
    tradeDate: string;
    exitDate?: string | null;
    strategy?: string;
    session?: string;
    accountId?: string | null;
    account?: {
        id: string;
        name: string;
        type: string;
    } | null;
    modelId?: string | null;
    model?: {
        name: string;
    } | null;
    imageUrl?: string | null;
    direction?: string; // 'LONG' | 'SHORT'
    rrRatio?: number | null;
}

export interface TradeFormData {
    instrument: string;
    entryPrice?: number | null;
    exitPrice?: number | null;
    stopLoss?: number | null;
    takeProfit?: number | null;
    quantity?: number | null;
    pnl?: number | null;
    result: 'WIN' | 'LOSS' | 'BREAKEVEN' | 'OPEN';
    notes?: string;
    tradeDate: string;
    exitDate?: string | null;
    strategy?: string;
    session?: string;
    accountId?: string | null;
    modelId?: string | null;
    imageUrl?: string | null;
}
