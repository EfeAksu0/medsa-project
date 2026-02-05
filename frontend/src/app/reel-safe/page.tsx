'use client';

import { useEffect, useState } from 'react';

export default function ReelSafePage() {
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
                    {/* Floating particles */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-500 rounded-full animate-float"></div>
                        <div className="absolute top-40 right-20 w-3 h-3 bg-pink-500 rounded-full animate-float delay-100"></div>
                        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-float delay-200"></div>
                        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-float delay-300"></div>
                    </div>

                    <div className="text-3xl md:text-6xl font-bold text-white mb-2 md:mb-4 text-center animate-slide-up">
                        Day 1 with my
                    </div>
                    <div className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-pulse animate-gradient">
                        AI PSYCHOLOGIST
                    </div>
                </div>
            )}

            {/* Scene 2-5s: The Situation */}
            {scene === 1 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in bg-gradient-to-br from-red-900 via-gray-900 to-black px-4">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500 rounded-full blur-3xl animate-pulse-slow"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500 rounded-full blur-3xl animate-pulse-slow delay-100"></div>
                    </div>

                    {/* Scan lines effect */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="w-full h-1 bg-white absolute top-0 animate-scan"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-8 text-center drop-shadow-2xl animate-slide-up">
                            I wanted to make an
                        </div>
                        <div className="text-3xl md:text-6xl font-bold text-red-400 mb-4 md:mb-8 text-center drop-shadow-2xl animate-slide-up delay-100 animate-shake border-4 border-red-500/50 px-4 py-2 rounded-xl bg-red-500/10">
                            IMPULSIVE DECISION 💭
                        </div>
                        <div className="mt-4 md:mt-8 text-5xl md:text-7xl drop-shadow-2xl animate-bounce-slow">😰</div>
                    </div>
                </div>
            )}

            {/* Scene 5-8s: AI Detection */}
            {scene === 2 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in bg-gradient-to-b from-purple-900 via-indigo-900 to-black px-4">
                    {/* Glowing particles */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-yellow-500 rounded-full blur-3xl animate-pulse delay-200"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="text-3xl md:text-6xl font-bold text-yellow-400 mb-4 md:mb-8 animate-pulse-fast border-4 border-yellow-400 px-6 py-4 rounded-2xl bg-yellow-400/10 backdrop-blur-sm animate-shake">
                            ⚠️ URGENCY DETECTED
                        </div>
                        <div className="text-xl md:text-4xl text-white text-center leading-relaxed animate-slide-up">
                            AI analyzed my notes:
                        </div>
                        <div className="text-xl md:text-4xl text-purple-300 text-center leading-relaxed animate-slide-up delay-100 font-bold">
                            &quot;You&apos;re being impulsive.&quot;
                        </div>
                        {/* Brain emoji with glow */}
                        <div className="mt-4 md:mt-8 text-4xl md:text-6xl animate-pulse bg-purple-500/20 px-6 py-4 rounded-full">🧠</div>
                    </div>
                </div>
            )}

            {/* Scene 8-10s: Result */}
            {scene === 3 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in bg-gradient-to-b from-green-900 via-emerald-900 to-black px-4">
                    {/* Success particles */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-1/4 left-1/4 w-56 h-56 bg-green-400 rounded-full blur-3xl animate-pulse-slow"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-emerald-400 rounded-full blur-3xl animate-pulse-slow delay-100"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="text-3xl md:text-6xl font-bold text-green-400 mb-4 md:mb-8 animate-bounce-in drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                            ✅ I LISTENED
                        </div>
                        <div className="text-xl md:text-4xl text-white text-center animate-slide-up">
                            Avoided a mistake
                        </div>
                        {/* Stats with glow */}
                        <div className="mt-4 md:mt-8 bg-green-500/20 backdrop-blur-sm px-4 md:px-8 py-3 md:py-4 rounded-2xl border-2 border-green-500 animate-scale-in shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                            <div className="text-xl md:text-3xl text-green-300 font-bold">🎯 Better decision made</div>
                        </div>
                        <div className="mt-3 md:mt-4 text-lg md:text-2xl text-gray-300 animate-slide-up delay-200">
                            Day 1 complete ✨
                        </div>
                    </div>
                </div>
            )}

            {/* Scene 10s+: CTA */}
            {scene === 4 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in bg-black px-4">
                    {/* Rotating gradient border effect */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-spin-slow"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-3 md:mb-4 animate-scale-in animate-gradient">
                            MEDYSA AI
                        </div>
                        <div className="text-xl md:text-4xl text-white mb-6 md:mb-8 animate-slide-up">
                            Your AI Psychologist
                        </div>
                        {/* Pulsing CTA with glow */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 md:px-12 py-4 md:py-6 rounded-full animate-pulse-slow shadow-[0_0_40px_rgba(168,85,247,0.6)] border-2 border-purple-400">
                            <div className="text-xl md:text-3xl text-white font-bold">
                                Follow for Day 2 →
                            </div>
                        </div>
                        <div className="mt-4 md:mt-6 text-lg md:text-2xl text-gray-400 animate-fade-in delay-300">
                            Link in bio 👆
                        </div>
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

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }

                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translateY(-100px) translateX(50px);
                        opacity: 0.8;
                    }
                }

                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }

                @keyframes scan {
                    0% {
                        top: 0;
                    }
                    100% {
                        top: 100%;
                    }
                }

                .animate-scan {
                    animation: scan 2s linear infinite;
                }

                @keyframes spin-slow {
                    from {
                        transform: translate(-50%, -50%) rotate(0deg);
                    }
                    to {
                        transform: translate(-50%, -50%) rotate(360deg);
                    }
                }

                .animate-spin-slow {
                    animation: spin-slow 10s linear infinite;
                }

                @keyframes gradient {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </div>
    );
}
