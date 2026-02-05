'use client';

import { X, Check } from 'lucide-react';

export default function FailChartPage() {
    return (
        <div className="h-screen w-full bg-black text-white font-sans flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid grid-cols-2 gap-8">

                {/* 90% Fail - Average Trader */}
                <div className="space-y-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="text-center">
                        <div className="text-6xl font-black text-gray-500 mb-2">90%</div>
                        <div className="text-xl text-gray-400 uppercase tracking-widest">The Crowd</div>
                    </div>

                    <div className="bg-[#111111] border border-gray-800 rounded-3xl p-8 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                <X className="text-red-500" size={24} />
                            </div>
                            <div>
                                <div className="font-bold text-gray-300">Emotional Entries</div>
                                <div className="text-sm text-gray-600">"It's pumping, I have to buy!"</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                <X className="text-red-500" size={24} />
                            </div>
                            <div>
                                <div className="font-bold text-gray-300">No Risk Management</div>
                                <div className="text-sm text-gray-600">"Stop loss is for pussies."</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                <X className="text-red-500" size={24} />
                            </div>
                            <div>
                                <div className="font-bold text-gray-300">Zero Reflection</div>
                                <div className="text-sm text-gray-600">"The market is rigged."</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 10% Win - Medysa User */}
                <div className="space-y-6 transform scale-105">
                    <div className="text-center">
                        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">10%</div>
                        <div className="text-xl text-purple-400 uppercase tracking-widest font-bold">The Elite</div>
                    </div>

                    <div className="bg-[#151515] border border-purple-500/30 rounded-3xl p-8 space-y-6 relative overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Check className="text-green-500" size={24} />
                            </div>
                            <div>
                                <div className="font-bold text-white">Data-Driven Execution</div>
                                <div className="text-sm text-gray-400">Following the Medysa Playbook.</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Check className="text-green-500" size={24} />
                            </div>
                            <div>
                                <div className="font-bold text-white">AI Psychology Guard</div>
                                <div className="text-sm text-gray-400">Preventing tilt before it hits wallet.</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Check className="text-green-500" size={24} />
                            </div>
                            <div>
                                <div className="font-bold text-white">Compound Growth</div>
                                <div className="text-sm text-gray-400">Small wins > Big gambles.</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
