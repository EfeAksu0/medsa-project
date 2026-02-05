'use client';

import { useEffect, useState } from 'react';
import { Timer, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export function StickyFomoBar() {
    const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 23, seconds: 12 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);

        const scrollTimer = setTimeout(() => setIsVisible(true), 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(scrollTimer);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-slide-up pointer-events-none">
            <div className="container mx-auto max-w-4xl pointer-events-auto">
                <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 rounded-2xl shadow-[0_0_50px_rgba(251,191,36,0.3)] border border-white/20 p-4 md:p-6 text-gray-900 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-amber-950">Founding Member Offer</p>
                            <h4 className="text-lg font-bold font-serif">50% Lifetime Discount Ends In:</h4>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 font-mono text-2xl font-black">
                            <span className="bg-white/30 px-2 py-1 rounded-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
                            <span className="animate-pulse">:</span>
                            <span className="bg-white/30 px-2 py-1 rounded-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
                            <span className="animate-pulse">:</span>
                            <span className="bg-white/30 px-2 py-1 rounded-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
                        </div>

                        <Link href="/register?promo=founding" className="px-8 py-3 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all shadow-xl uppercase tracking-widest text-sm flex items-center gap-2 group">
                            Claim My Edge <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}
