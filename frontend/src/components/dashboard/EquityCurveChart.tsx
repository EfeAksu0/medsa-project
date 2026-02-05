'use client';

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface EquityPoint {
    date: string;
    equity: number;
}

interface EquityCurveChartProps {
    data: EquityPoint[];
}

export function EquityCurveChart({ data }: EquityCurveChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center text-gray-500 bg-gray-900/50 rounded-xl border border-gray-800 border-dashed">
                No equity data available
            </div>
        );
    }

    const formattedData = data.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString(),
    }));

    return (
        <div className="h-[400px] w-full bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-semibold text-white">Equity Curve</h3>
                <div className="group relative inline-block">
                    <span className="w-4 h-4 rounded-full bg-gray-700 text-blue-400 text-[10px] font-bold inline-flex items-center justify-center cursor-help hover:bg-gray-600 transition-colors">
                        ?
                    </span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl pointer-events-none">
                        Shows your cumulative profit/loss over time. An upward trend means consistent profitability.
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                    </div>
                </div>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedData}>
                        <defs>
                            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af' }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af' }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '0.5rem',
                                color: '#fff',
                            }}
                            formatter={(value: number | undefined) => [
                                value !== undefined ? `$${value.toFixed(2)}` : 'N/A',
                                'Equity'
                            ]}
                        />
                        <Area
                            type="monotone"
                            dataKey="equity"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorEquity)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
