'use client';

import { useEffect, useState, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
    TrendingUp, TrendingDown, Target, Activity, Swords, Shield, ShieldAlert,
    ChevronRight, Zap, Trophy, BarChart2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EquityCurveChart } from '@/components/dashboard/EquityCurveChart';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { KnightsBattle } from '@/components/animations/KnightsBattle';
import { AiCoachWidget } from '@/components/dashboard/AiCoachWidget';
import { ToDoWidget } from '@/components/dashboard/ToDoWidget';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { BugReportModal } from '@/components/modals/BugReportModal';

interface DashboardStats {
    netPnL: number;
    winRate: number;
    profitFactor: number;
    totalTrades: number;
    winCount: number;
    lossCount: number;
    breakevenCount?: number;
}

interface EquityPoint {
    date: string;
    equity: number;
}

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function DashboardPage() {
    const { user } = useAuth();
    const [showTour, setShowTour] = useState(false);
    const [showBugModal, setShowBugModal] = useState(false);
    const [isDemo, setIsDemo] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            setIsDemo(params.get('demo') === 'true');
        }
    }, []);

    const { data: statsData, isLoading: isLoadingStats } = useSWR<DashboardStats>(
        isDemo ? null : '/analytics/stats',
        fetcher,
        { refreshInterval: 60000 }
    );

    const { data: equityDataRes, isLoading: isLoadingEquity } = useSWR<EquityPoint[]>(
        isDemo ? null : '/analytics/equity-curve',
        fetcher,
        { refreshInterval: 60000 }
    );

    // DEMO DATA FALLBACK
    const demoStats: DashboardStats = {
        netPnL: 12450.00,
        winRate: 88.5,
        profitFactor: 3.2,
        totalTrades: 142,
        winCount: 126,
        lossCount: 16
    };

    const demoEquityData: EquityPoint[] = [
        { date: '1', equity: 10000 },
        { date: '5', equity: 11200 },
        { date: '10', equity: 10800 },
        { date: '15', equity: 13500 },
        { date: '20', equity: 14200 },
        { date: '25', equity: 18900 },
        { date: '30', equity: 22450 },
    ];

    const stats = isDemo ? demoStats : statsData;
    const equityData = isDemo ? demoEquityData : (equityDataRes || []);

    const isLoading = !isDemo && (isLoadingStats || isLoadingEquity) && !stats;

    useEffect(() => {
        const verifyPayment = async () => {
            const params = new URLSearchParams(window.location.search);
            const paymentSuccess = params.get('payment') === 'success';
            const sessionId = params.get('session_id');
            const completed = localStorage.getItem('medysa_onboarding_completed');

            if (paymentSuccess && sessionId) {
                try {
                    const res = await api.post('/payments/verify-session', { sessionId });
                    if (res.data?.token && res.data?.user) {
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('user', JSON.stringify(res.data.user));
                    }
                    sessionStorage.setItem('medysa_force_onboarding', 'true');
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                    window.location.reload();
                } catch (err) {
                    console.error('Payment Verification Failed', err);
                }
            } else if (paymentSuccess) {
                sessionStorage.setItem('medysa_force_onboarding', 'true');
                window.history.replaceState({}, '', window.location.pathname);
                window.location.reload();
            } else {
                const forceTour = sessionStorage.getItem('medysa_force_onboarding');
                if (forceTour) {
                    sessionStorage.removeItem('medysa_force_onboarding');
                    setTimeout(() => setShowTour(true), 1000);
                } else if (!completed) {
                    setTimeout(() => setShowTour(true), 1000);
                }
            }
        };
        verifyPayment();
    }, []);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'tradesUpdated') {
                mutate('/analytics/stats');
                mutate('/analytics/equity-curve');
            }
        };
        window.addEventListener('storage', handleStorageChange);
        const handleTradesUpdate = () => {
            mutate('/analytics/stats');
            mutate('/analytics/equity-curve');
        };
        window.addEventListener('tradesUpdated', handleTradesUpdate);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('tradesUpdated', handleTradesUpdate);
        };
    }, []);

    const handleTourClose = useCallback(() => {
        setShowTour(false);
        localStorage.setItem('medysa_onboarding_completed', 'true');
    }, []);

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                <p className="text-amber-500/60 text-sm font-serif tracking-widest uppercase">Loading Command...</p>
            </div>
        </div>
    );

    const netPnL = stats?.netPnL ?? 0;
    const isPositive = netPnL >= 0;
    const wins = stats?.winCount ?? 0;
    const losses = stats?.lossCount ?? 0;
    const winRate = stats?.winRate ?? 0;
    const totalTrades = stats?.totalTrades ?? 0;
    const profitFactor = stats?.profitFactor ?? 0;

    return (
        <div className="space-y-6">
            <OnboardingTour isOpen={showTour} onClose={handleTourClose} />
            <BugReportModal isOpen={showBugModal} onClose={() => setShowBugModal(false)} />

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
                        </h1>
                        {user?.tier === 'MEDYSA_AI' && (
                            <span className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-[10px] font-bold text-purple-400 uppercase tracking-widest shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                                ✦ Medysa AI
                            </span>
                        )}
                        {user?.tier === 'KNIGHT' && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                                ⚔ Knight
                            </span>
                        )}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Here's your trading performance at a glance</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowBugModal(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-900/10 hover:bg-red-900/20 border border-red-500/20 rounded-lg text-xs text-red-400/70 hover:text-red-400 transition-all"
                    >
                        <ShieldAlert size={14} />
                        Report Bug
                    </button>
                    <button
                        onClick={() => setShowTour(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white transition-all"
                    >
                        <Shield size={14} className="text-amber-500" />
                        Guide
                    </button>
                </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Net P&L"
                    value={`${isPositive ? '+' : ''}$${Number(netPnL).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    subLabel="All time"
                    icon={isPositive ? TrendingUp : TrendingDown}
                    color={isPositive ? 'green' : 'red'}
                    tooltip="Your total net profit or loss from all trades."
                />
                <StatCard
                    label="Win Rate"
                    value={`${Number(winRate).toFixed(1)}%`}
                    subLabel={`${wins}W / ${losses}L`}
                    icon={Trophy}
                    color="amber"
                    tooltip="Percentage of winning trades out of all completed trades."
                />
                <StatCard
                    label="Profit Factor"
                    value={Number(profitFactor).toFixed(2)}
                    subLabel={profitFactor >= 1.5 ? '🔥 Excellent' : profitFactor >= 1 ? '✅ Profitable' : '⚠️ Needs work'}
                    icon={Zap}
                    color="blue"
                    tooltip="Ratio of gross profit to gross loss. Above 1.5 = excellent."
                />
                <StatCard
                    label="Total Trades"
                    value={totalTrades}
                    subLabel="Recorded"
                    icon={BarChart2}
                    color="purple"
                    tooltip="Total number of trades you have logged."
                />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left column: Chart + Calendar */}
                <div className="xl:col-span-2 space-y-6">
                    <EquityCurveChart data={equityData} />

                    {/* Arena section — now smaller and cleaner */}
                    <div className="bg-gray-900/60 border border-amber-600/20 rounded-2xl p-5 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 bg-amber-500/10 rounded-lg">
                                <Swords className="text-amber-500" size={16} />
                            </div>
                            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-widest" style={{ fontFamily: 'serif' }}>
                                Arena of Valor
                            </h2>
                            <span className="ml-auto text-xs text-gray-600">{wins}W · {losses}L</span>
                        </div>
                        <KnightsBattle wins={wins} losses={losses} />
                    </div>

                    <CalendarWidget />
                </div>

                {/* Right column: AI Coach + ToDo */}
                <div className="space-y-6">
                    <AiCoachWidget />
                    <div className="h-[450px]">
                        <ToDoWidget />
                    </div>
                </div>
            </div>
        </div>
    );
}


import { memo } from 'react';

// Memoized StatCard to prevent unnecessary re-renders
interface StatCardProps {
    label: string;
    value: string | number;
    subLabel?: string;
    icon: React.ElementType;
    color?: 'green' | 'red' | 'amber' | 'blue' | 'purple';
    tooltip?: string;
}

const StatCard = memo(function StatCard({ label, value, subLabel, icon: Icon, color = 'amber', tooltip }: StatCardProps) {
    const colorMap = {
        green: {
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
            text: 'text-green-400',
            iconBg: 'bg-green-500/10 border-green-500/20',
        },
        red: {
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            text: 'text-red-400',
            iconBg: 'bg-red-500/10 border-red-500/20',
        },
        amber: {
            bg: 'bg-amber-500/5',
            border: 'border-amber-500/20',
            text: 'text-amber-300',
            iconBg: 'bg-amber-500/10 border-amber-500/20',
        },
        blue: {
            bg: 'bg-blue-500/5',
            border: 'border-blue-500/20',
            text: 'text-blue-400',
            iconBg: 'bg-blue-500/10 border-blue-500/20',
        },
        purple: {
            bg: 'bg-purple-500/5',
            border: 'border-purple-500/20',
            text: 'text-purple-400',
            iconBg: 'bg-purple-500/10 border-purple-500/20',
        },
    };

    const c = colorMap[color];

    return (
        <div className={cn(
            "relative group rounded-2xl p-5 border backdrop-blur-sm transition-all duration-300",
            "bg-gray-900/60 border-gray-800/60 hover:border-gray-700/80",
            "hover:shadow-lg hover:-translate-y-0.5"
        )}>
            <div className="flex items-start justify-between mb-3">
                <div className={cn("p-2 rounded-xl border", c.iconBg)}>
                    <Icon size={18} className={c.text} />
                </div>
                {tooltip && (
                    <div className="group/tip relative">
                        <span className="w-4 h-4 rounded-full bg-gray-800 text-gray-500 text-[10px] font-bold inline-flex items-center justify-center cursor-help hover:text-gray-300 transition-colors">
                            ?
                        </span>
                        <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs text-gray-300 w-44 opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all z-50 shadow-xl pointer-events-none">
                            {tooltip}
                        </div>
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">{label}</p>
            <p className={cn("text-2xl font-bold tracking-tight", c.text)}>{value}</p>
            {subLabel && (
                <p className="text-xs text-gray-600 mt-1">{subLabel}</p>
            )}
        </div>
    );
});
