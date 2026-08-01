'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Activity, AlertTriangle, ShieldCheck, Clock, TrendingUp } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface TimeBlock {
    label: string;
    wins: number;
    losses: number;
    total: number;
    netPnL: number;
    winRate: number;
}

interface BehavioralData {
    timeBlockAnalysis: TimeBlock[];
    revengeStats: {
        detectedRevengeTrades: number;
        revengeLosses: number;
        revengeWinRate: number;
        riskAlert: string;
    };
}

export function BehavioralRiskWidget() {
    const { theme } = useTheme();
    const isPro = theme === 'pro';

    const [data, setData] = useState<BehavioralData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics/behavioral-risk');
                setData(res.data);
            } catch (err) {
                console.error('Failed to load behavioral risk stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="medieval-card p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 animate-pulse">
                <div className="h-6 w-48 bg-zinc-800 rounded mb-4"></div>
                <div className="h-20 bg-zinc-800/40 rounded"></div>
            </div>
        );
    }

    if (!data) return null;

    const { timeBlockAnalysis, revengeStats } = data;

    return (
        <div className={`p-6 rounded-xl transition-all duration-300 ${
            isPro 
                ? 'bg-zinc-900/90 border border-zinc-800 shadow-xl' 
                : 'medieval-card'
        }`}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isPro ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'}`}>
                        <Activity size={20} />
                    </div>
                    <div>
                        <h3 className={`text-base font-semibold ${isPro ? 'text-zinc-100 font-sans' : 'text-amber-300 font-serif'}`}>
                            {isPro ? 'Behavioral Risk Analytics' : 'Execution & Trauma Protocol'}
                        </h3>
                        <p className="text-xs text-zinc-400">
                            {isPro ? 'Real-time time-of-day heatmap & revenge trading alert' : 'Forensic breakdown of trading discipline'}
                        </p>
                    </div>
                </div>

                <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                    revengeStats.detectedRevengeTrades > 0
                        ? 'bg-rose-950/40 text-rose-400 border-rose-800/50'
                        : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
                }`}>
                    {revengeStats.detectedRevengeTrades > 0 ? (
                        <span className="flex items-center gap-1.5"><AlertTriangle size={13} /> Revenge Risk</span>
                    ) : (
                        <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> Discipline Optimal</span>
                    )}
                </span>
            </div>

            {/* Time of Day Performance Grid */}
            <div className="space-y-3 mb-6">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={14} className="text-zinc-400" /> Time-of-Day Win Rate Heatmap
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {timeBlockAnalysis.map((block, idx) => {
                        const isProfitable = block.netPnL >= 0;
                        return (
                            <div 
                                key={idx} 
                                className={`p-3 rounded-lg border transition-all ${
                                    isPro
                                        ? 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700'
                                        : 'bg-slate-900/60 border-amber-500/20'
                                }`}
                            >
                                <span className="text-[11px] text-zinc-400 font-medium block truncate">
                                    {block.label.split('(')[0]}
                                </span>
                                <div className="flex items-baseline justify-between mt-1">
                                    <span className={`text-lg font-bold ${block.winRate >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {block.winRate}%
                                    </span>
                                    <span className={`text-xs font-semibold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {isProfitable ? '+' : ''}${block.netPnL}
                                    </span>
                                </div>
                                <span className="text-[10px] text-zinc-500 block mt-0.5">
                                    {block.total} trades ({block.wins}W / {block.losses}L)
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Revenge Trade Alert Banner */}
            <div className={`p-4 rounded-lg border flex items-center justify-between ${
                revengeStats.detectedRevengeTrades > 0
                    ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                    : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
            }`}>
                <div className="flex items-center gap-3">
                    <TrendingUp size={18} className={revengeStats.detectedRevengeTrades > 0 ? 'text-rose-400' : 'text-emerald-400'} />
                    <div>
                        <p className="text-xs font-semibold">{revengeStats.riskAlert}</p>
                        <p className="text-[11px] text-zinc-400">
                            Revenge Trades Detected (&lt;15m post-loss): <strong className="text-zinc-200">{revengeStats.detectedRevengeTrades}</strong> | Revenge Win Rate: <strong className="text-zinc-200">{revengeStats.revengeWinRate}%</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
