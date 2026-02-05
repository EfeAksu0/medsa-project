'use client';

import { Skull, ShieldCheck, AlertCircle, TrendingUp, XCircle, CheckCircle2, ZapOff, Sparkles } from 'lucide-react';

export function TransformationSection() {
    return (
        <div className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                        The <span className="text-amber-500">Transformation</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        There are two types of traders in the arena. Which one are you today? Which one will you be tomorrow?
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* The Merchant (Before) */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-b from-red-600/20 to-transparent rounded-3xl blur-xl opacity-50"></div>
                        <div className="relative h-full bg-gray-950/50 backdrop-blur-sm border border-red-900/30 rounded-3xl p-8 md:p-12 flex flex-col transition-all duration-500 hover:border-red-500/30">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                                    <Skull size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-red-500 font-serif uppercase tracking-widest">The Merchant</h3>
                                    <p className="text-red-400/60 text-xs font-bold uppercase tracking-widest">Fragile & Unprotected</p>
                                </div>
                            </div>

                            <ul className="space-y-6 flex-grow">
                                {[
                                    { icon: <AlertCircle size={18} />, text: "Trading based on 'gut feeling' and Twitter noise" },
                                    { icon: <XCircle size={18} />, text: "No record of past failures—repeating the same mistakes" },
                                    { icon: <ZapOff size={18} />, text: "Gambling with position sizes during emotional tilts" },
                                    { icon: <Skull size={18} />, text: "Account bleeding slowly through a thousand paper cuts" },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 text-gray-400">
                                        <div className="mt-1 text-red-500/50">{item.icon}</div>
                                        <span className="text-sm font-medium leading-relaxed">{item.text}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-12 pt-8 border-t border-red-900/20">
                                <p className="text-red-400/80 italic text-sm text-center">
                                    &quot;I think the market is about to turn...&quot;
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* The Knight (After) */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/30 to-purple-600/20 rounded-3xl blur-xl opacity-70 animate-pulse"></div>
                        <div className="relative h-full bg-gray-900/80 backdrop-blur-sm border border-amber-500/40 rounded-3xl p-8 md:p-12 flex flex-col transition-all duration-500 hover:border-amber-400/60 hover:scale-[1.02]">
                            <div className="absolute top-6 right-6">
                                <Sparkles className="text-amber-400 animate-spin-slow" size={24} />
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                                    <ShieldCheck size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 font-serif uppercase tracking-widest">The Knight</h3>
                                    <p className="text-amber-400/60 text-xs font-bold uppercase tracking-widest">Disciplined & Data-Driven</p>
                                </div>
                            </div>

                            <ul className="space-y-6 flex-grow">
                                {[
                                    { icon: <CheckCircle2 size={18} />, text: "Executing high-probability setups from a proven playbook" },
                                    { icon: <TrendingUp size={18} />, text: "Precise performance metrics identifying the exact edge" },
                                    { icon: <Sparkles size={18} />, text: "AI Coach preventing tilt before the first bad trade" },
                                    { icon: <ShieldCheck size={18} />, text: "Compound growth protected by institutional-grade stats" },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 text-amber-100">
                                        <div className="mt-1 text-amber-500">{item.icon}</div>
                                        <span className="text-sm font-semibold leading-relaxed">{item.text}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-12 pt-8 border-t border-amber-500/20">
                                <p className="text-amber-400 italic text-sm text-center font-bold">
                                    &quot;My data confirms it&apos;s time to strike.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animate-spin-slow {
                    animation: spin 10s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
