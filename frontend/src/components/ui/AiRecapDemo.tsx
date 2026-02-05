'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert, Zap, TrendingDown, ArrowRight, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AiRecapDemo = () => {
    const [activeTab, setActiveTab] = useState<'bad' | 'good'>('bad');
    const [typing, setTyping] = useState(true);

    // Reset typing effect when tab changes
    useEffect(() => {
        const t = setTimeout(() => setTyping(true), 0);
        const timer = setTimeout(() => setTyping(false), 2000);
        return () => { clearTimeout(timer); clearTimeout(t); };
    }, [activeTab]);

    return (
        <section id="autopsy" className="py-24 relative overflow-hidden bg-[#050810]">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] opacity-30 mix-blend-screen"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px] opacity-20 mix-blend-screen"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Side - Manipulative Copy */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">
                            <ShieldAlert size={14} /> The Brutal Truth
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                            Stop <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Lying</span> to Yourself.
                        </h2>

                        <p className="text-xl text-gray-400 font-medium leading-relaxed border-l-4 border-red-500/30 pl-6">
                            You tell yourself it was &quot;bad luck.&quot; You blame the market maker. You blame the news.
                            <br /><br />
                            <strong className="text-white">Medysa knows the truth.</strong>
                            <br />
                            Our AI performs a forensic autopsy on every trade. It exposes your Tilt, your FOMO, and your hesitation. It doesn&apos;t care about your feelings. It cares about your P&L.
                        </p>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                                    <BrainCircuit size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white uppercase tracking-wider text-sm">Psychological Profiling</h4>
                                    <p className="text-sm text-gray-500">Detects revenge trading before you blow the account.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                                    <TrendingDown size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white uppercase tracking-wider text-sm">Pattern Recognition</h4>
                                    <p className="text-sm text-gray-500">Identifies the exact moment you deviated from your plan.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Demo Card */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-br from-red-500 to-amber-600 rounded-2xl blur opacity-30 animate-pulse"></div>
                        <div className="relative bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

                            {/* Card Header with Tabs */}
                            <div className="flex border-b border-white/5 bg-[#0a0d14]">
                                <button
                                    onClick={() => setActiveTab('bad')}
                                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'bad' ? 'text-red-500 bg-red-500/10 border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    The &quot;Gut Feeling&quot; Trade
                                </button>
                                <button
                                    onClick={() => setActiveTab('good')}
                                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'good' ? 'text-emerald-500 bg-emerald-500/10 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    The &quot;Sniper&quot; Trade
                                </button>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 min-h-[400px] flex flex-col">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'bad' ? (
                                        <motion.div
                                            key="bad"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="text-2xl font-black text-white font-mono">GOLD / XAUUSD</div>
                                                <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold border border-red-500/30">LOSS: -$450.00</div>
                                            </div>

                                            {/* Fake Chart Visualization */}
                                            <div className="h-32 w-full bg-[#050810] rounded-lg border border-white/5 relative overflow-hidden flex items-end p-2 gap-1 opacity-70">
                                                {[40, 45, 60, 55, 70, 85, 80, 40, 30, 20, 15, 10].map((h, i) => (
                                                    <div key={i} className="flex-1 bg-red-500/40 hover:bg-red-500/60 transition-colors rounded-sm" style={{ height: `${h}%` }}></div>
                                                ))}
                                                <div className="absolute top-4 right-1/2 text-xs text-red-500 font-mono">← BOUGHT HERE (FOMO)</div>
                                            </div>

                                            <div className="bg-[#0f1219] p-4 rounded-xl border border-red-500/20 relative">
                                                <div className="absolute -top-3 -left-3">
                                                    <div className="w-8 h-8 bg-black rounded-full border border-red-500 flex items-center justify-center relative z-10">
                                                        <Zap size={16} className="text-red-500" />
                                                    </div>
                                                </div>
                                                <h5 className="text-red-500 font-bold uppercase text-xs tracking-widest mb-2 pl-4">Medysa AI Analysis</h5>
                                                <p className="text-gray-300 text-sm font-mono leading-relaxed">
                                                    &quot;Absolute disaster. You entered clearly into resistance because you saw a big green candle. <span className="text-red-400 bg-red-900/20 px-1">RSI was 85 (Overbought)</span>. You ignored your own rule #4: &apos;Wait for the retest.&apos; This wasn&apos;t trading; this was gambling. Be better.&quot;
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="good"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="text-2xl font-black text-white font-mono">BTC / USD</div>
                                                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold border border-emerald-500/30">PROFIT: +$1,240.00</div>
                                            </div>

                                            {/* Fake Chart Visualization */}
                                            <div className="h-32 w-full bg-[#050810] rounded-lg border border-white/5 relative overflow-hidden flex items-end p-2 gap-1 opacity-70">
                                                {[20, 25, 22, 30, 35, 32, 40, 55, 65, 75, 85, 90].map((h, i) => (
                                                    <div key={i} className="flex-1 bg-emerald-500/40 hover:bg-emerald-500/60 transition-colors rounded-sm" style={{ height: `${h}%` }}></div>
                                                ))}
                                                <div className="absolute bottom-4 left-1/3 text-xs text-emerald-500 font-mono">← ENTRY (PERFECT RETEST)</div>
                                            </div>

                                            <div className="bg-[#0f1219] p-4 rounded-xl border border-emerald-500/20 relative">
                                                <div className="absolute -top-3 -left-3">
                                                    <div className="w-8 h-8 bg-black rounded-full border border-emerald-500 flex items-center justify-center relative z-10">
                                                        <Zap size={16} className="text-emerald-500" />
                                                    </div>
                                                </div>
                                                <h5 className="text-emerald-500 font-bold uppercase text-xs tracking-widest mb-2 pl-4">Medysa AI Analysis</h5>
                                                <p className="text-gray-300 text-sm font-mono leading-relaxed">
                                                    &quot;Clinical execution. You identified the liquidity sweep, waited for the 15m confirmation, and your stop placement was mathematically perfect. Risk/Reward ratio: <span className="text-emerald-400 bg-emerald-900/20 px-1">1:4.2</span>. This is how you build an empire.&quot;
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
