'use client';

import { useEffect, useState, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { TrendingUp, TrendingDown, Target, Activity, Swords, Shield, ShieldAlert } from 'lucide-react';
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
        { refreshInterval: 5000 }
    );

    const { data: equityDataRes, isLoading: isLoadingEquity } = useSWR<EquityPoint[]>(
        isDemo ? null : '/analytics/equity-curve',
        fetcher,
        { refreshInterval: 5000 }
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

    // Initial loading state (only for real data when data is missing)
    const isLoading = !isDemo && (isLoadingStats || isLoadingEquity) && !stats;


    useEffect(() => {
        const verifyPayment = async () => {
            const params = new URLSearchParams(window.location.search);
            const paymentSuccess = params.get('payment') === 'success';
            const sessionId = params.get('session_id');
            const completed = localStorage.getItem('medysa_onboarding_completed');

            if (paymentSuccess && sessionId) {
                try {
                    // 1. Verify payment with backend (Double Check)
                    console.log('Verifying payment session:', sessionId);
                    await api.post('/payments/verify-session', { sessionId });

                    // 2. Set flag to force tour on next load
                    sessionStorage.setItem('medysa_force_onboarding', 'true');

                    // Clean up URL
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);

                    // Force reload to update context/subscription status
                    window.location.reload();

                } catch (err) {
                    console.error('Payment Verification Failed', err);
                }
            } else if (paymentSuccess) {
                // Fallback (legacy/error case)
                sessionStorage.setItem('medysa_force_onboarding', 'true');
                window.history.replaceState({}, '', window.location.pathname);
                window.location.reload();
            } else {
                // Check if forced from previous session/reload OR first time visit
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

    const handleTourClose = useCallback(() => {
        setShowTour(false);
        localStorage.setItem('medysa_onboarding_completed', 'true');
    }, []);

    // Listen for storage events (when trades are added in another tab/component)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'tradesUpdated') {
                mutate('/analytics/stats');
                mutate('/analytics/equity-curve');
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also listen for custom events in the same tab
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

    if (isLoading) return <div className="text-gray-400">Loading battle command...</div>;

    const netPnL = stats?.netPnL ?? 0;
    const isPositive = netPnL >= 0;
    const wins = stats?.winCount ?? 0;
    const losses = stats?.lossCount ?? 0;

    return (
        <div className="space-y-6">
            <OnboardingTour isOpen={showTour} onClose={handleTourClose} />
            <BugReportModal isOpen={showBugModal} onClose={() => setShowBugModal(false)} />

            {/* Medieval Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600" style={{ fontFamily: 'serif' }}>
                            ⚔️ Battle Command ⚔️
                        </h1>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                            Beta v0.9
                        </span>
                        {user?.tier === 'MEDYSA_AI' && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[10px] font-bold text-purple-400 uppercase tracking-widest shadow-[0_0_10px_rgba(168,85,247,0.3)] animate-pulse">
                                PLAN: MEDYSA AI
                            </span>
                        )}
                        {user?.tier === 'KNIGHT' && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-500 uppercase tracking-widest shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                                PLAN: KNIGHT
                            </span>
                        )}
                    </div>
                    <p className="text-gray-400 mt-1">Your trading battlefield awaits</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowBugModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 rounded-lg text-sm text-red-400 transition-all font-serif tracking-wide group"
                    >
                        <ShieldAlert size={16} className="group-hover:animate-pulse" />
                        Report Bug
                    </button>
                    <button
                        onClick={() => setShowTour(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-all font-serif tracking-wide"
                    >
                        <Shield size={16} className="text-amber-500" />
                        Guide
                    </button>
                </div>
            </div>

            {/* Knights Battle Animation */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-amber-600/30 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <Swords className="text-amber-500" size={24} />
                    <h2 className="text-xl font-bold text-amber-400" style={{ fontFamily: 'serif' }}>
                        Arena of Valor
                    </h2>
                </div>
                <KnightsBattle wins={wins} losses={losses} />
            </div>

            {/* Battle Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="War Chest"
                    value={`$${netPnL}`}
                    icon={isPositive ? TrendingUp : TrendingDown}
                    trend={isPositive ? 'positive' : 'negative'}
                    tooltip="Your total net profit or loss from all trades. Positive = making money!"
                />
                <StatCard
                    label="Victory Rate"
                    value={`${stats?.winRate || 0}%`}
                    icon={Shield}
                    tooltip="Percentage of winning trades out of all completed trades."
                />
                <StatCard
                    label="Battle Power"
                    value={stats?.profitFactor || 0}
                    icon={Swords}
                    tooltip="Ratio of total profits to total losses. Above 1.0 = profitable trading."
                />
                <StatCard
                    label="Total Battles"
                    value={stats?.totalTrades || 0}
                    icon={Activity}
                    tooltip="The total number of trades you have recorded."
                />
            </div>

            {/* AI Coach Quick Access and ToDoWidget */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <EquityCurveChart data={equityData} />
                    <CalendarWidget />
                </div>
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



interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    trend?: 'positive' | 'negative';
    tooltip?: string;
}

function StatCard({ label, value, icon: Icon, trend, tooltip }: StatCardProps) {
    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-amber-600/20 p-6 rounded-xl flex items-center justify-between hover:border-amber-500/40 transition-all shadow-lg">
            <div>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-amber-300/70 font-medium uppercase tracking-wider" style={{ fontFamily: 'serif' }}>{label}</p>
                    {tooltip && (
                        <div className="group relative">
                            <span className="w-4 h-4 rounded-full bg-gray-700 text-amber-400 text-[10px] font-bold inline-flex items-center justify-center cursor-help hover:bg-gray-600 transition-colors">
                                ?
                            </span>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 border border-amber-600/30 rounded-lg text-xs text-gray-300 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl pointer-events-none">
                                {tooltip}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                            </div>
                        </div>
                    )}
                </div>
                <p className={cn(
                    "text-2xl font-bold mt-1",
                    trend === 'positive' && "text-green-400",
                    trend === 'negative' && "text-red-400",
                    !trend && "text-amber-100"
                )}>
                    {value}
                </p>
            </div>
            <div className={cn(
                "p-3 rounded-lg border-2",
                trend === 'positive' && "bg-green-500/10 text-green-400 border-green-500/30",
                trend === 'negative' && "bg-red-500/10 text-red-500 border-red-500/30",
                !trend && "bg-amber-500/10 text-amber-400 border-amber-500/30"
            )}>
                <Icon size={24} />
            </div>
        </div>
    );
}
