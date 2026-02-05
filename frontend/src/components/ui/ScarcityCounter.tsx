'use client';

import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

export function ScarcityCounter() {
    const [spots, setSpots] = useState(124);

    useEffect(() => {
        const timer = setInterval(() => {
            setSpots(prev => {
                if (prev <= 12) return prev;
                // Randomly decrement to simulate real-time signups
                return Math.random() > 0.7 ? prev - 1 : prev;
            });
        }, 15000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)] animate-pulse-subtle">
            <Flame size={16} fill="currentColor" />
            <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-black uppercase tracking-widest mb-0.5">High Demand</span>
                <span className="text-sm font-bold tracking-tight">Only {spots} Spots Left for 2026 Season</span>
            </div>

            <style jsx>{`
                @keyframes pulse-subtle {
                    0% { opacity: 0.8; transform: scale(1); }
                    100% { opacity: 1; transform: scale(1.02); }
                }
                .animate-pulse-subtle {
                    animation: pulse-subtle 2s ease-in-out infinite alternate;
                }
            `}</style>
        </div>
    );
}
