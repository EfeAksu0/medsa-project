'use client';

import { useEffect, useState } from 'react';
import { Upload, Send, Bot, User } from 'lucide-react';

export default function RoastReelPage() {
    const [step, setStep] = useState(0);

    // Automation Sequence
    useEffect(() => {
        const timings = [
            1000, // 1. Start (Empty Chat)
            2500, // 2. User simulates upload
            3500, // 3. Image appears
            5000, // 4. "Medysa is typing..."
            7000, // 5. Roast appears
        ];

        let currentTimeout: NodeJS.Timeout;

        if (step < 4) {
            currentTimeout = setTimeout(() => {
                setStep(prev => prev + 1);
            }, timings[step] || 2000);
        }

        return () => clearTimeout(currentTimeout);
    }, [step]);

    return (
        <div className="h-screen w-full bg-[#313338] text-gray-100 font-sans flex items-center justify-center p-4">
            {/* Discord-like Container */}
            <div className="w-full max-w-md bg-[#313338] rounded-lg overflow-hidden flex flex-col h-[800px] border border-[#1e1f22] shadow-2xl relative">

                {/* Header */}
                <div className="h-12 border-b border-[#26272d] flex items-center px-4 shadow-sm bg-[#313338] z-10">
                    <div className="text-xl font-bold text-gray-400 mr-2">#</div>
                    <div className="font-semibold text-white">roast-my-trade</div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-4 space-y-6 overflow-y-auto">

                    {/* Previous Context (Optional) */}
                    <div className="opacity-50">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <User size={20} className="text-blue-400" />
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-medium text-blue-400">CryptoKing</span>
                                    <span className="text-xs text-gray-400">Today at 10:42 AM</span>
                                </div>
                                <div className="text-gray-300">Rate my setup?</div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2/3: User Upload */}
                    {step >= 2 && (
                        <div className="flex items-start gap-4 animate-fade-in-up">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                <User size={20} className="text-amber-400" />
                            </div>
                            <div className="w-full">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-medium text-amber-400">You</span>
                                    <span className="text-xs text-gray-400">Today at 10:45 AM</span>
                                </div>
                                <div className="mt-1 bg-[#2b2d31] rounded-lg p-3 max-w-[300px] border border-[#1e1f22]">
                                    {step === 2 ? (
                                        <div className="flex items-center gap-2 text-sm text-gray-400 animate-pulse">
                                            <Upload size={16} /> Uploading chart...
                                        </div>
                                    ) : (
                                        <div className="relative aspect-video bg-gray-900 rounded-md overflow-hidden">
                                            {/* Placeholder for chart - using a gradient or actual image if available */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-gray-500">
                                                <div className="text-center">
                                                    <div className="text-4xl">📉</div>
                                                    <div className="text-xs mt-2 font-mono">BTCUSD_final_final.png</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4:Bot Typing */}
                    {step === 3 && (
                        <div className="flex items-end gap-2 px-2 animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-500 delay-75"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-500 delay-150"></div>
                            <span className="text-xs text-gray-400 ml-2">Medysa AI is typing...</span>
                        </div>
                    )}

                    {/* Step 5: Roast */}
                    {step >= 4 && (
                        <div className="flex items-start gap-4 animate-scale-in origin-left">
                            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 border border-purple-400">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-white bg-purple-600 px-1 rounded text-xs py-0.5">BOT</span>
                                    <span className="font-medium text-purple-400">Medysa AI</span>
                                    <span className="text-xs text-gray-400">Today at 10:45 AM</span>
                                </div>
                                <div className="mt-1 text-gray-100 leading-relaxed bg-[#2b2d31] p-3 rounded-lg border-l-4 border-purple-500">
                                    <p className="mb-2">Alright, let&apos;s see what we have here... 🧐</p>
                                    <p className="mb-2">You entered a <strong>LONG</strong> on a clear downtrend because of &quot;RSI divergence&quot;? That&apos;s not trading, that&apos;s <strong>charity work</strong> for the market makers.</p>
                                    <p className="font-bold text-red-400">Risk Rating: 11/10 (Terminal)</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Simulated Input */}
                <div className="p-4 bg-[#313338]">
                    <div className="bg-[#383a40] rounded-lg p-3 flex items-center text-gray-500 cursor-not-allowed">
                        <div className="w-6 h-6 rounded-full bg-gray-400/20 flex items-center justify-center mr-3">
                            <span className="text-lg">+</span>
                        </div>
                        <span className="flex-1">Message #roast-my-trade</span>
                    </div>
                </div>

            </div>

            <style jsx>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
                .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
             `}</style>
        </div>
    );
}
