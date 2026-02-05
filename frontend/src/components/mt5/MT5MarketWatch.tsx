interface Scenario {
    id: string;
    name: string;
    description: string;
    instrument: string;
}

interface MT5MarketWatchProps {
    scenarios: Scenario[];
    selectedId: string;
    onSelect: (scenario: Scenario) => void;
}

export default function MT5MarketWatch({ scenarios, selectedId, onSelect }: MT5MarketWatchProps) {
    return (
        <div className="w-[280px] bg-white border-r border-[#a0a0a0] flex flex-col h-full select-none">
            {/* Header */}
            <div className="bg-[#e6e6e6] px-2 py-1 text-[12px] font-bold border-b border-[#a0a0a0] flex justify-between">
                <span>Market Watch: 10:23:45</span>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-3 bg-[#f0f0f0] border-b border-[#d0d0d0] text-[11px] text-[#555]">
                <div className="px-2 py-1 border-r border-[#d0d0d0]">Symbol</div>
                <div className="px-2 py-1 border-r border-[#d0d0d0]">Bid</div>
                <div className="px-2 py-1">Ask</div>
            </div>

            {/* Symbol List */}
            <div className="overflow-y-auto flex-1 bg-white">
                {scenarios.map((scenario, index) => {
                    const isSelected = selectedId === scenario.id;
                    const basePrice = index === 0 ? 1.0845 : index === 1 ? 1.2640 : index === 2 ? 148.45 : index === 3 ? 2045.20 : 42500;
                    const spread = index === 4 ? 10 : 0.0002;

                    return (
                        <div
                            key={scenario.id}
                            onClick={() => onSelect(scenario)}
                            className={`grid grid-cols-3 text-[12px] border-b border-[#f0f0f0] cursor-pointer hover:bg-[#e3f2fd] group
                                ${isSelected ? 'bg-[#cce8ff] text-black' : 'text-[#333]'}`}
                        >
                            <div className="px-2 py-1 font-bold flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-green-500' : 'bg-gray-300'}`} />
                                {scenario.instrument}
                            </div>
                            <div className="px-2 py-1 font-mono text-red-600">
                                {(basePrice).toFixed(scenario.instrument.includes('JPY') ? 2 : scenario.instrument.includes('BTC') ? 0 : 5)}
                            </div>
                            <div className="px-2 py-1 font-mono text-blue-600">
                                {(basePrice + spread).toFixed(scenario.instrument.includes('JPY') ? 2 : scenario.instrument.includes('BTC') ? 0 : 5)}
                            </div>

                            {/* Hover Details tooltip replacement */}
                            <div className="hidden group-hover:block col-span-3 px-2 py-1 text-[10px] text-gray-500 bg-[#f9f9f9] border-t border-[#f0f0f0]">
                                {scenario.name} - {scenario.description}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Tabs */}
            <div className="bg-[#f0f0f0] border-t border-[#a0a0a0] flex text-[11px]">
                <div className="px-3 py-1 bg-white border-t-2 border-blue-500 font-medium">Symbols</div>
                <div className="px-3 py-1 text-gray-500 hover:bg-[#e0e0e0]">Details</div>
                <div className="px-3 py-1 text-gray-500 hover:bg-[#e0e0e0]">Trading</div>
                <div className="px-3 py-1 text-gray-500 hover:bg-[#e0e0e0]">Ticks</div>
            </div>
        </div>
    );
}
