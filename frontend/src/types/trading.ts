export interface Account {
    id: string;
    name: string;
    type: string;
    currentBalance: number;
    goalBalance?: number | null;
    netPnL?: number;
    winRate?: number;
    totalTrades?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Model {
    id: string;
    name: string;
    symbol?: string | null;
    winRate?: number;
    totalTrades?: number;
    wins?: number;
    losses?: number;
    breakevens?: number;
    avgSL?: number;
    avgRR?: number;
    maxRR?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Session {
    id: string;
    name: string;
}

export interface PsychologyTag {
    id: string;
    name: string;
    color: string;
}

export interface MistakeTag {
    id: string;
    name: string;
    color: string;
}

export interface AccountFormData {
    name: string;
    type: string;
    currentBalance: number;
    goalBalance?: number | null;
}

export interface ModelFormData {
    name: string;
    symbol?: string | null;
}
