import React from 'react';
import { ChevronDown, Lock, Settings, Maximize, ChevronUp, X } from 'lucide-react';

interface TradovateHeaderProps {
    symbol: string;
    accountBalance: number;
    equity: number;
    openPl: number;
    currentPrice: number;
    onBuy: () => void;
    onSell: () => void;
    onReset: () => void;
    speed: number;
    setSpeed: (speed: number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scenarios: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSelectScenario: (scenario: any) => void;
    onMaximize: () => void;
}

export default function TradovateHeader({
    symbol,
    accountBalance,
    equity,
    openPl,
    currentPrice,
    onBuy,
    onSell,
    onReset,
    speed,
    setSpeed,
    scenarios,
    onSelectScenario,
    onMaximize
}: TradovateHeaderProps) {
    const [isSymbolDropdownOpen, setIsSymbolDropdownOpen] = React.useState(false);

    return (
        <div className="bg-[#121212] border-b border-[#2a2a2a] h-[50px] flex items-center justify-between px-4 text-gray-200 select-none font-sans">
            {/* LEFT: Symbol & Price Info */}
            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        onClick={() => setIsSymbolDropdownOpen(!isSymbolDropdownOpen)}
                        className="flex items-center gap-2 hover:bg-[#2a2a2a] px-2 py-1 rounded transition-colors"
                    >
                        <span className="font-bold text-white text-[15px]">{symbol}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {/* Scenario / Symbol Dropdown */}
                    {isSymbolDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-[200px] bg-[#1e1e1e] border border-[#333] rounded shadow-xl z-50 py-1">
                            {scenarios.map(s => (
                                <div
                                    key={s.id}
                                    onClick={() => {
                                        onSelectScenario(s);
                                        setIsSymbolDropdownOpen(false);
                                    }}
                                    className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer text-sm flex items-center justify-between"
                                >
                                    <span>{s.instrument}</span>
                                    <span className="text-gray-500 text-xs">{s.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-4 text-sm font-mono">
                    <div className="text-gray-400">
                        LAST <span className={`font-bold ${currentPrice > 0 ? 'text-green-500' : 'text-white'}`}>{currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="text-gray-400">
                        BID <span className="text-white">{(currentPrice - 0.05).toFixed(2)}</span>
                    </div>
                    <div className="text-gray-400">
                        ASK <span className="text-white">{(currentPrice + 0.05).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* CENTER: Order Ticket (The Core Feature) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-[#1e1e1e] rounded-md border border-[#333] overflow-hidden shadow-lg transform scale-90 md:scale-100">
                {/* Buy Mkt Button */}
                <button
                    onClick={onBuy}
                    className="flex flex-col items-center justify-center bg-[#1b5e20] hover:bg-[#2e7d32] w-[80px] h-[40px] transition-colors border-r border-[#121212] group active:scale-95"
                >
                    <span className="text-[11px] font-bold text-white leading-tight">Buy Mkt</span>
                    <span className="text-[10px] text-green-200">@Ask</span>
                </button>

                {/* Sell Mkt Button */}
                <button
                    onClick={onSell}
                    className="flex flex-col items-center justify-center bg-[#b71c1c] hover:bg-[#c62828] w-[80px] h-[40px] transition-colors border-l border-[#121212] group active:scale-95"
                >
                    <span className="text-[11px] font-bold text-white leading-tight">Sell Mkt</span>
                    <span className="text-[10px] text-red-200">@Bid</span>
                </button>

                {/* Qty Input */}
                <div className="w-[50px] bg-[#121212] h-[40px] flex items-center justify-center border-l border-r border-[#333]">
                    <span className="text-white font-bold">1</span>
                </div>

                {/* Exit Button */}
                <button
                    onClick={onReset}
                    className="flex items-center justify-center bg-[#333] hover:bg-[#444] w-[100px] h-[40px] transition-colors text-[11px] text-gray-300 font-medium"
                >
                    Exit at Mkt & Cxl
                </button>
            </div>

            {/* RIGHT: Account Info */}
            <div className="flex items-center gap-6 text-sm">

                {/* Speed Toggle (Hidden functionality kept) */}
                <div
                    className="flex items-center gap-1 cursor-pointer hover:bg-[#2a2a2a] rounded px-2 py-1"
                    onClick={() => {
                        const speeds = [1, 5, 15];
                        const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
                        setSpeed(speeds[nextIdx]);
                    }}
                >
                    <span className="text-yellow-500 font-bold">{speed}x</span>
                </div>

                <div className="flex flex-col items-end leading-tight">
                    <span className="text-[10px] text-gray-500 uppercase">Account</span>
                    <span className="font-bold flex items-center gap-1">
                        Funded12213 <ChevronDown className="w-3 h-3" />
                    </span>
                </div>

                <div className="flex flex-col items-end leading-tight min-w-[80px]">
                    <span className="text-[10px] text-gray-500 uppercase">Equity</span>
                    <span className="font-mono font-bold text-blue-400">${equity.toFixed(2)}</span>
                </div>

                <div className="flex flex-col items-end leading-tight min-w-[80px]">
                    <span className="text-[10px] text-gray-500 uppercase">Open P/L</span>
                    <span className={`font-mono font-bold ${openPl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {openPl >= 0 ? '+' : ''}{openPl.toFixed(2)}
                    </span>
                </div>

                <div className="flex flex-col items-end w-[100px]">
                    <span className="text-[10px] text-gray-500 mb-0.5 uppercase">Day Margin</span>
                    <div className="w-full h-1.5 bg-[#333] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500"
                            style={{ width: `${(equity / 10000) * 10}%` }} // Mock margin
                        />
                    </div>
                </div>

                <div
                    id="tradovate-maximize-btn"
                    onClick={onMaximize}
                    className="cursor-pointer text-gray-400 hover:text-white transition-colors p-1"
                    title="Fullscreen"
                >
                    <Maximize className="w-5 h-5" />
                </div>
                <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
        </div>
    );
}
