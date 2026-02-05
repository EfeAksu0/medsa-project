'use client';

import { useEffect, useState } from 'react';

export default function ReelPage() {
    const [scene, setScene] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Auto-start on page load
        if (!isPlaying) {
            setTimeout(() => setIsPlaying(true), 0);
        }
    }, []);

    useEffect(() => {
        if (!isPlaying) return;

        // Auto-advance scenes for 10-second reel
        const timings = [0, 2000, 5000, 8000, 10000];

        const timer1 = setTimeout(() => setScene(1), timings[1]);
        const timer2 = setTimeout(() => setScene(2), timings[2]);
        const timer3 = setTimeout(() => setScene(3), timings[3]);
        const timer4 = setTimeout(() => setScene(4), timings[4]);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, [isPlaying]);

    return (
        <div className="h-screen w-full bg-black flex items-center justify-center overflow-hidden relative">
            {/* Progress Bar - Day 1/30 - Mobile optimized */}
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50 bg-purple-600/80 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-full">
                <div className="text-white font-bold text-sm md:text-xl">DAY 1/30</div>
            </div>

            {/* Logo Watermark - Mobile optimized */}
            <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50 opacity-60">
                <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    MEDYSA
                </div>
            </div>

            {/* Scene 0-2s: Hook */}
            {scene === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in px-4">
                    <div className="text-3xl md:text-6xl font-bold text-white mb-2 md:mb-4 text-center animate-slide-up">
                        Day 1 of trading with my
                    </div>
                    <div className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                        AI PSYCHOLOGIST
                    </div>
                </div>
            )}

            {/* Scene 2-5s: Chart + User thinking */}
            {scene === 1 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in bg-black">
                    {/* Bitcoin Chart Background */}
                    <div className="absolute inset-0 opacity-40 animate-zoom-in">
                        <img
                            src="/bitcoin-chart.png.png"
                            alt="Bitcoin Chart"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Text Overlay */}
                    <div className="relative z-10 flex flex-col items-center px-4">
                        <div className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-8 text-center drop-shadow-2xl animate-slide-up">
                            Bitcoin is pumping... 📈
                        </div>
                        <div className="text-xl md:text-4xl text-gray-200 text-center drop-shadow-xl animate-slide-up delay-100">
                            Should I chase this trade?
                        </div>
                        <div className="mt-4 md:mt-8 text-5xl md:text-7xl drop-shadow-2xl animate-bounce-slow">🤔</div>
                    </div>
                </div>
            )}

            {/* Scene 5-8s: AI Detection */}
            {scene === 2 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in bg-gradient-to-b from-purple-900 to-black px-4">
                    <div className="text-3xl md:text-6xl font-bold text-yellow-400 mb-4 md:mb-8 animate-pulse-fast">
                        ⚠️ FOMO DETECTED
                    </div>
                    <div className="text-xl md:text-4xl text-white text-center leading-relaxed animate-slide-up">
                        Medysa AI: &quot;You&apos;re showing urgency.
                    </div>
                    <div className="text-xl md:text-4xl text-white text-center leading-relaxed animate-slide-up delay-100">
                        Wait for your setup.&quot;
                    </div>
                    {/* Brain emoji */}
                    <div className="mt-4 md:mt-8 text-4xl md:text-6xl animate-pulse">🧠</div>
                </div>
            )}

            {/* Scene 8-10s: Result */}
            {scene === 3 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in bg-gradient-to-b from-green-900 to-black px-4">
                    <div className="text-3xl md:text-6xl font-bold text-green-400 mb-4 md:mb-8 animate-bounce-in">
                        ✅ I LISTENED
                    </div>
                    <div className="text-xl md:text-4xl text-white text-center animate-slide-up">
                        Saved myself from a bad trade
                    </div>
                    {/* Stats */}
                    <div className="mt-4 md:mt-8 bg-green-500/20 backdrop-blur-sm px-4 md:px-8 py-3 md:py-4 rounded-2xl border-2 border-green-500 animate-scale-in">
                        <div className="text-xl md:text-3xl text-green-300 font-bold">💰 Saved: $500</div>
                    </div>
                    <div className="mt-3 md:mt-4 text-lg md:text-2xl text-gray-300 animate-slide-up delay-200">
                        Day 1 complete
                    </div>
                </div>
            )}

            {/* Scene 10s+: CTA */}
            {scene === 4 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in bg-black px-4">
                    <div className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-3 md:mb-4 animate-scale-in">
                        MEDYSA AI
                    </div>
                    <div className="text-xl md:text-4xl text-white mb-6 md:mb-8 animate-slide-up">
                        Your Trading Psychologist
                    </div>
                    {/* Pulsing CTA */}
                    <div className="bg-purple-600 px-6 md:px-12 py-4 md:py-6 rounded-full animate-pulse-slow">
                        <div className="text-xl md:text-3xl text-white font-bold">
                            Follow for Day 2 →
                        </div>
                    </div>
                    <div className="mt-4 md:mt-6 text-lg md:text-2xl text-gray-400 animate-fade-in delay-300">
                        Link in bio 👆
                    </div>
                </div>
            )}

            {/* Restart button - Mobile optimized */}
            <button
                onClick={() => {
                    setScene(0);
                    setIsPlaying(false);
                    setTimeout(() => setIsPlaying(true), 100);
                }}
                className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-purple-600 text-white px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-lg hover:bg-purple-700 active:bg-purple-700 transition-colors opacity-30 hover:opacity-100 active:opacity-100 z-50"
            >
                Restart
            </button>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes zoom-in {
                    from {
                        transform: scale(1.2);
                    }
                    to {
                        transform: scale(1);
                    }
                }

                @keyframes bounce-in {
                    0% {
                        opacity: 0;
                        transform: scale(0.3);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                .animate-slide-up {
                    animation: slide-up 0.6s ease-out forwards;
                }

                .animate-zoom-in {
                    animation: zoom-in 3s ease-out forwards;
                }

                .animate-bounce-in {
                    animation: bounce-in 0.6s ease-out forwards;
                }

                .animate-scale-in {
                    animation: scale-in 0.5s ease-out forwards;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }

                .animate-pulse-fast {
                    animation: pulse 0.8s ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulse 2s ease-in-out infinite;
                }

                .delay-100 {
                    animation-delay: 0.1s;
                }

                .delay-200 {
                    animation-delay: 0.2s;
                }

                .delay-300 {
                    animation-delay: 0.3s;
                }
            `}</style>
        </div>
    );
}
