import { format } from 'date-fns';

interface MT5TerminalProps {
    balance: number;
    equity: number;
    margin: number;
    freeMargin: number;
    marginLevel: number;
    activeTrade: {
        ticket: number;
        time: string;
        type: 'buy' | 'sell';
        size: number;
        symbol: string;
        price: number;
        sl: number;
        tp: number;
        currentPrice: number;
        commission: number;
        swap: number;
        profit: number;
    } | null;
}

export default function MT5Terminal({ balance, equity, margin, freeMargin, marginLevel, activeTrade }: MT5TerminalProps) {
    return (
        <div className="bg-white flex flex-col h-full select-none text-[12px]">
            {/* Terminal Header/Tabs */}
            <div className="flex bg-[#f0f0f0] border-b border-[#a0a0a0]">
                <div className="px-4 py-1 bg-white border-t-2 border-transparent border-t-blue-500 font-medium">
                    Trade
                </div>
                {['Exposure', 'History', 'News', 'Mailbox', 'Calendar', 'Alerts', 'Code Base', 'Experts', 'Journal'].map(tab => (
                    <div key={tab} className="px-4 py-1 text-gray-500 border-r border-[#d0d0d0] hover:bg-[#e0e0e0] border-t-2 border-transparent cursor-pointer">
                        {tab}
                    </div>
                ))}
            </div>

            {/* Terminal Content Table */}
            <div className="flex-1 overflow-auto bg-white font-mono text-[11px]">
                {/* Table Header */}
                <div className="grid grid-cols-[80px_120px_60px_60px_80px_80px_80px_80px_80px_80px_80px_1fr] bg-[#f0f0f0] border-b border-[#d0d0d0] text-[#555] font-sans">
                    <div className="px-2 py-0.5 border-r border-[#d0d0d0]">Ticket</div>
                    <div className="px-2 py-0.5 border-r border-[#d0d0d0]">Time</div>
                    <div className="px-2 py-0.5 border-r border-[#d0d0d0]">Type</div>
                    <div className="px-2 py-0.5 border-r border-[#d0d0d0]">Size</div>
                    <div className="px-2 py-0.5 border-r border-[#d0d0d0]">Symbol</div>
                    <div className="px-2 py-0.5 border-r border-[#d0d0d0]">Price</div>
                    <div className="px-2 py-0.5 border-r border-[#d0d0d0]">S/L</div>
                    <div className="px-2 py-0.5 border-r border-[#d0d0d0]">T/P</div>
                    <div className="px-2 py-0.5 border-r border-[#d0d0d0]">Price</div>
                    <div className="px-2 py-0.5 border-r border-[#d0d0d0]">Commission</div>
                    <div className="px-2 py-0.5 border-r border-[#d0d0d0]">Swap</div>
                    <div className="px-2 py-0.5 text-right font-bold">Profit</div>
                </div>

                {/* Active Trade Row */}
                {activeTrade && (
                    <div className="grid grid-cols-[80px_120px_60px_60px_80px_80px_80px_80px_80px_80px_80px_1fr] hover:bg-[#e3f2fd] border-b border-[#f0f0f0] text-[#333]">
                        <div className="px-2 py-0.5">{activeTrade.ticket}</div>
                        <div className="px-2 py-0.5">{activeTrade.time}</div>
                        <div className={`px-2 py-0.5 font-bold ${activeTrade.type === 'buy' ? 'text-blue-600' : 'text-red-600'}`}>
                            {activeTrade.type}
                        </div>
                        <div className="px-2 py-0.5">{activeTrade.size.toFixed(2)}</div>
                        <div className="px-2 py-0.5 font-bold">{activeTrade.symbol}</div>
                        <div className="px-2 py-0.5">{activeTrade.price.toFixed(5)}</div>
                        <div className="px-2 py-0.5">{activeTrade.sl.toFixed(5)}</div>
                        <div className="px-2 py-0.5">{activeTrade.tp.toFixed(5)}</div>
                        <div className="px-2 py-0.5">{activeTrade.currentPrice.toFixed(5)}</div>
                        <div className="px-2 py-0.5">{activeTrade.commission.toFixed(2)}</div>
                        <div className="px-2 py-0.5">{activeTrade.swap.toFixed(2)}</div>
                        <div className={`px-2 py-0.5 text-right font-bold ${activeTrade.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {activeTrade.profit.toFixed(2)}
                        </div>
                    </div>
                )}

                {/* Summary Row */}
                <div className="bg-[#f0f0f0] border-b border-[#d0d0d0] px-2 py-1 flex items-center gap-4 text-[#333] font-sans font-medium text-[12px]">
                    <div>Balance: <span className="font-bold font-mono">{balance.toFixed(2)}</span></div>
                    <div>Equity: <span className="font-bold font-mono">{equity.toFixed(2)}</span></div>
                    <div>Margin: <span className="font-mono">{margin.toFixed(2)}</span></div>
                    <div>Free Margin: <span className="font-mono">{freeMargin.toFixed(2)}</span></div>
                    <div>Margin Level: <span className="font-mono">{marginLevel.toFixed(2)}%</span></div>
                </div>
            </div>
        </div>
    );
}
