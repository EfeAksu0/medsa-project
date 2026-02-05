import React from 'react';
import {
    LayoutGrid,
    BarChart2,
    List,
    Zap,
    Clock,
    MoreHorizontal,
    Trophy,
    HelpCircle
} from 'lucide-react';

export default function TradovateSidebar() {
    const icons = [
        { icon: LayoutGrid, active: true },
        { icon: BarChart2, active: false },
        { icon: List, active: false },
        { icon: Zap, active: false },
        { icon: Clock, active: false },
        { icon: Trophy, active: false },
    ];

    return (
        <div className="w-[50px] bg-[#1a1a1a] border-l border-[#2a2a2a] flex flex-col items-center py-4 gap-4 h-full relative z-20">
            {icons.map((Item, i) => (
                <div
                    key={i}
                    className={`p-2 rounded-lg cursor-pointer transition-all
                        ${Item.active
                            ? 'text-blue-500 bg-[#252525]'
                            : 'text-gray-500 hover:text-gray-300 hover:bg-[#252525]'}`}
                >
                    <Item.icon className="w-6 h-6" strokeWidth={1.5} />
                </div>
            ))}

            <div className="mt-auto pb-4">
                <div className="p-2 text-gray-500 hover:text-gray-300 cursor-pointer">
                    <HelpCircle className="w-6 h-6" strokeWidth={1.5} />
                </div>
            </div>
        </div>
    );
}
