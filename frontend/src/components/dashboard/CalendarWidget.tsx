'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface DailyStats {
    date: string;
    pnl: number;
    trades: number;
    wins: number;
    losses: number;
    breakevens: number;
}

export function CalendarWidget() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState<Record<string, DailyStats>>({});
    const [loading, setLoading] = useState(true);

    const fetchCalendarData = async () => {
        try {
            setLoading(true);
            // Construct date range for the current month
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth(); // 0-indexed

            const start = new Date(year, month, 1).toISOString();
            const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

            const res = await api.get(`/analytics/calendar?start=${start}&end=${end}`);
            setCalendarData(res.data);
        } catch (error) {
            console.error('Failed to fetch calendar data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCalendarData();
    }, [currentDate]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    // Generate calendar grid
    const generateDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

        const days = [];

        // Empty cells for previous month padding
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }

        // Days of the actual month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const days = generateDays();
    const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    // PnL Formatting
    const formatMoney = (amount: number) => {
        if (amount === 0) return '$0';
        return (amount >= 0 ? '+' : '') + '$' + Math.abs(amount).toFixed(0); // Keeping it compact without cents for calendar
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">PnL Calendar</h2>
                    <div className="group relative inline-block">
                        <span className="w-4 h-4 rounded-full bg-gray-700 text-blue-400 text-[10px] font-bold inline-flex items-center justify-center cursor-help hover:bg-gray-600 transition-colors">
                            ?
                        </span>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl pointer-events-none">
                            Monthly view of your trading results. Green = profit day, Red = loss day.
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300 w-32 text-center select-none">
                        {monthName}
                    </span>
                    <div className="flex gap-1">
                        <button
                            onClick={handlePrevMonth}
                            className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={handleNextMonth}
                            className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {loading && Object.keys(calendarData).length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        <Loader2 className="animate-spin mr-2" />
                        Loading calendar...
                    </div>
                ) : (
                    <div className="grid grid-cols-7 gap-px bg-gray-800 rounded-lg overflow-hidden border border-gray-800">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="bg-gray-900 p-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}

                        {days.map((day, idx) => {
                            if (day === null) {
                                return <div key={`empty-${idx}`} className="bg-gray-900/50 min-h-[100px]" />;
                            }

                            // Format date key: YYYY-MM-DD
                            // IMPORTANT: Ensure manual padding matches backend format
                            const year = currentDate.getFullYear();
                            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                            const dayStr = day.toString().padStart(2, '0');
                            const dateKey = `${year}-${month}-${dayStr}`;

                            const data = calendarData[dateKey];
                            const hasTrades = data && data.trades > 0;
                            const pnl = data ? data.pnl : 0;

                            const currentDayDate = new Date(year, currentDate.getMonth(), day);
                            const isWeekend = currentDayDate.getDay() === 0 || currentDayDate.getDay() === 6;

                            // Determine cell color based on PnL
                            let bgClass = "bg-gray-900";
                            let textClass = "text-gray-400"; // For PnL text

                            if (hasTrades) {
                                if (pnl > 0) {
                                    bgClass = "bg-green-500/10 hover:bg-green-500/20";
                                    textClass = "text-green-400";
                                } else if (pnl < 0) {
                                    bgClass = "bg-red-500/10 hover:bg-red-500/20";
                                    textClass = "text-red-400";
                                } else {
                                    bgClass = "bg-gray-800 hover:bg-gray-700";
                                    textClass = "text-gray-400";
                                }
                            } else {
                                // Default background: Black for weekends, Gray-900 for weekdays
                                bgClass = isWeekend ? "bg-black/50 hover:bg-black/70" : "bg-gray-900 hover:bg-gray-800/50";
                            }

                            return (
                                <div key={idx} className={cn("min-h-[100px] p-2 transition-colors flex flex-col justify-between", bgClass)}>
                                    <div className="text-right">
                                        <span className={cn("text-xs font-medium", hasTrades ? "text-gray-300" : "text-gray-600")}>
                                            {day}
                                        </span>
                                    </div>

                                    {hasTrades ? (
                                        <div className="space-y-1">
                                            <div className={cn("font-bold text-sm", textClass)}>
                                                {formatMoney(pnl)}
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-medium">
                                                {data.trades} trade{data.trades !== 1 ? 's' : ''}
                                            </div>
                                            <div className="flex gap-0.5 mt-1">
                                                {/* Mini indicators for win/loss distribution? Optional polish */}
                                                {/* For now, just keeping it clean */}
                                            </div>
                                        </div>
                                    ) : (
                                        <div />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
