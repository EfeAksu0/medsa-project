import { Component, Settings, ZoomIn, ZoomOut, BarChart3, LineChart, CandlestickChart, MousePointer2, Crosshair, Type, RefreshCw, Zap } from 'lucide-react';

interface MT5ToolbarProps {
    speed?: number;
    setSpeed?: (speed: number) => void;
}

export default function MT5Toolbar({ speed = 1, setSpeed }: MT5ToolbarProps) {
    const menus = ['File', 'View', 'Insert', 'Charts', 'Tools', 'Window', 'Help'];
    const timeframes = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN'];

    return (
        <div className="bg-[#f0f0f0] border-b border-[#a0a0a0] text-[#333] select-none">
            {/* Menu Bar */}
            <div className="flex px-1 text-[13px]">
                {menus.map(menu => (
                    <div key={menu} className="px-2 py-1 hover:bg-[#e0e0e0] cursor-default text-[#444]">
                        {menu}
                    </div>
                ))}
            </div>

            {/* Toolbar Divider */}
            <div className="h-px bg-[#d0d0d0]" />

            {/* Icon Toolbar */}
            <div className="flex items-center gap-1 p-1 bg-[#f7f7f7]">
                {/* Standard Tools */}
                <div className="flex items-center gap-1 pr-2 border-r border-[#d0d0d0]">
                    <div className="p-1 hover:bg-[#e0e0e0] hover:border hover:border-[#a0a0a0] rounded-sm cursor-pointer border border-transparent">
                        <Component className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="p-1 hover:bg-[#e0e0e0] hover:border hover:border-[#a0a0a0] rounded-sm cursor-pointer border border-transparent">
                        <Settings className="w-4 h-4" />
                    </div>
                </div>

                {/* Chart Tools */}
                <div className="flex items-center gap-1 px-2 border-r border-[#d0d0d0]">
                    <div className="p-1 hover:bg-[#e0e0e0] hover:border hover:border-[#a0a0a0] rounded-sm cursor-pointer border border-transparent">
                        <MousePointer2 className="w-4 h-4" />
                    </div>
                    <div className="p-1 hover:bg-[#e0e0e0] hover:border hover:border-[#a0a0a0] rounded-sm cursor-pointer border border-transparent">
                        <Crosshair className="w-4 h-4" />
                    </div>
                    <div className="p-1 hover:bg-[#e0e0e0] hover:border hover:border-[#a0a0a0] rounded-sm cursor-pointer border border-transparent">
                        <Type className="w-4 h-4" />
                    </div>
                </div>

                {/* Chart Types */}
                <div className="flex items-center gap-1 px-2 border-r border-[#d0d0d0]">
                    <div className="p-1 hover:bg-[#e0e0e0] hover:border hover:border-[#a0a0a0] rounded-sm cursor-pointer border border-transparent">
                        <BarChart3 className="w-4 h-4" />
                    </div>
                    <div className="p-1 bg-[#e0e0e0] border border-[#a0a0a0] rounded-sm cursor-pointer">
                        <CandlestickChart className="w-4 h-4" />
                    </div>
                    <div className="p-1 hover:bg-[#e0e0e0] hover:border hover:border-[#a0a0a0] rounded-sm cursor-pointer border border-transparent">
                        <LineChart className="w-4 h-4" />
                    </div>
                </div>

                {/* Zoom */}
                <div className="flex items-center gap-1 px-2 border-r border-[#d0d0d0]">
                    <div className="p-1 hover:bg-[#e0e0e0] hover:border hover:border-[#a0a0a0] rounded-sm cursor-pointer border border-transparent">
                        <ZoomIn className="w-4 h-4" />
                    </div>
                    <div className="p-1 hover:bg-[#e0e0e0] hover:border hover:border-[#a0a0a0] rounded-sm cursor-pointer border border-transparent">
                        <ZoomOut className="w-4 h-4" />
                    </div>
                </div>

                {/* Speed / Timer Controls (New) */}
                {setSpeed && (
                    <div className="flex items-center gap-1 px-2 border-r border-[#d0d0d0]">
                        <Zap className="w-4 h-4 text-orange-500" />
                        {[1, 5, 15].map(s => (
                            <div
                                key={s}
                                onClick={() => setSpeed(s)}
                                className={`px-1.5 py-0.5 text-[11px] font-bold border border-transparent rounded-sm cursor-pointer
                                    ${speed === s
                                        ? 'bg-[#e0e0e0] border-[#a0a0a0] shadow-inner text-black'
                                        : 'hover:bg-[#e0e0e0] hover:border-[#a0a0a0] text-gray-500'}`}
                            >
                                {s}x
                            </div>
                        ))}
                    </div>
                )}

                {/* Timeframes */}
                <div className="flex items-center gap-0.5 px-2">
                    {timeframes.map((tf, i) => (
                        <div
                            key={tf}
                            className={`px-1.5 py-0.5 text-[11px] font-medium border border-transparent rounded-sm cursor-pointer
                                ${tf === 'M1' ? 'bg-[#e0e0e0] border-[#a0a0a0] shadow-inner' : 'hover:bg-[#e0e0e0] hover:border-[#a0a0a0]'}`}
                        >
                            {tf}
                        </div>
                    ))}
                </div>

                {/* Align Right: Algo Trading */}
                <div className="flex-1 flex justify-end">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-red-100 border border-red-300 rounded cursor-pointer">
                        <RefreshCw className="w-3 h-3 text-red-600" />
                        <span className="text-[11px] font-bold text-red-800">Algo Trading</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
