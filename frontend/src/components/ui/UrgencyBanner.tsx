'use client';

import { useEffect, useState } from 'react';
import { Users, TrendingUp, ShieldCheck } from 'lucide-react';

const MESSAGES = [
    { text: "Warrior 'Kael' just joined the Order!", icon: <Users size={14} className="text-amber-400" /> },
    { text: "Elite 'Seraph' just upgraded to AI Coach!", icon: <TrendingUp size={14} className="text-purple-400" /> },
    { text: "Master 'Draco' closed a 12.5R trade today!", icon: <ShieldCheck size={14} className="text-emerald-400" /> },
    { text: "New recruit 'Luna' started their journey!", icon: <Users size={14} className="text-amber-400" /> },
    { text: "Warrior 'Ajax' integrated their Global Vault!", icon: <ShieldCheck size={14} className="text-blue-400" /> },
];

export function UrgencyBanner() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-black/40 backdrop-blur-md border-b border-amber-500/10 py-2.5 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-center gap-4 transition-all duration-500 animate-fade-in" key={index}>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 shadow-[0_0_10px_rgba(251,191,36,0.1)]">
                        {MESSAGES[index].icon}
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-gray-300">
                            {MESSAGES[index].text}
                        </span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    0% { opacity: 0; transform: translateY(5px); }
                    20% { opacity: 1; transform: translateY(0); }
                    80% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-5px); }
                }
                .animate-fade-in {
                    animation: fade-in 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
