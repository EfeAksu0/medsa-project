'use client';

import { useEffect, useState } from 'react';
import { Send, Bot, User, AlertTriangle } from 'lucide-react';

export default function ChatReelPage() {
    const [step, setStep] = useState(0);

    // Automation Sequence
    useEffect(() => {
        const timings = [
            1000, // 1. Start (User typing)
            3000, // 2. User sends "I'm doubling size"
            4500, // 3. AI Typing
            6000, // 4. AI Interrupt/Warning
        ];

        let currentTimeout: NodeJS.Timeout;

        if (step < 3) {
            currentTimeout = setTimeout(() => {
                setStep(prev => prev + 1);
            }, timings[step] || 2000);
        }

        return () => clearTimeout(currentTimeout);
    }, [step]);

    return (
        <div className="h-screen w-full bg-[#111827] text-gray-100 font-sans flex items-center justify-center p-4">
            {/* App Container */}
            <div className="w-full max-w-md bg-[#1f2937] rounded-3xl overflow-hidden flex flex-col h-[800px] border border-gray-800 shadow-2xl relative">

                {/* Header */}
                <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#1f2937] z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Bot size={24} className="text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-white text-lg">Medysa Coach</div>
                            <div className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Online
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#111827]">

                    {/* Context: Bad Trade recently */}
                    <div className="flex justify-center my-4">
                        <div className="bg-red-500/10 text-red-400 text-xs px-3 py-1 rounded-full border border-red-500/20">
                            Stop Loss Hit: -2.5% Account Balance
                        </div>
                    </div>

                    {/* Step 1: User Sends Message */}
                    {step >= 1 && (
                        <div className="flex justify-end animate-fade-in-up">
                            <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-md">
                                I need to make that back quickly. Opening a larger position now.
                            </div>
                        </div>
                    )}

                    {/* Step 2: AI Typing */}
                    {step === 2 && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                                <Bot size={16} />
                            </div>
                            <div className="bg-[#1f2937] p-4 rounded-2xl rounded-tl-none border border-gray-800 flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: AI Warning */}
                    {step >= 3 && (
                        <div className="flex items-start gap-3 animate-slide-in-left">
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <Bot size={16} />
                            </div>
                            <div className="space-y-2 max-w-[90%]">
                                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl rounded-tl-none shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                    <div className="flex items-center gap-2 text-red-500 font-bold mb-2">
                                        <AlertTriangle size={18} />
                                        REVENGE TRADING DETECTED
                                    </div>
                                    <div className="text-gray-200 leading-relaxed">
                                        Stop exactly where you are. You just lost <strong>2.5%</strong>. Trying to "make it back" with size is how you lose <strong>10%</strong>.
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-red-500/20 text-red-400 font-semibold text-sm">
                                        Recommendation: Walk away for 30 minutes. 🛑
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Input */}
                <div className="p-4 bg-[#1f2937] border-t border-gray-800">
                    <div className="bg-[#111827] rounded-full p-4 flex items-center text-gray-500 border border-gray-800 shadow-inner">
                        <span className="flex-1 pl-2">Type a message...</span>
                        <div className="bg-blue-600 p-2 rounded-full text-white opacity-50">
                            <Send size={18} />
                        </div>
                    </div>
                </div>

            </div>

            <style jsx>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-in-left {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
                .animate-slide-in-left { animation: slide-in-left 0.5s ease-out forwards; }
                .delay-75 { animation-delay: 75ms; }
                .delay-150 { animation-delay: 150ms; }
             `}</style>
        </div>
    );
}
