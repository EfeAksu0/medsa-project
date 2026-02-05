'use client';

import { Check, X, Shield, FileSpreadsheet } from 'lucide-react';

export function ComparisonSection() {
    return (
        <section id="why-us" className="py-24 relative overflow-hidden bg-black/20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-6 italic" style={{ fontFamily: 'Cinzel, serif' }}>
                        Choose Your <span className="text-red-500">Weapon</span>
                    </h2>
                    <p className="text-gray-400">The difference between a Hobby and a Business.</p>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* THE OLD WAY */}
                    <div className="relative p-8 rounded-3xl border border-white/5 bg-gray-900/50 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 rounded-xl bg-gray-800 text-gray-400">
                                <FileSpreadsheet size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-300">The Amateur</h3>
                                <p className="text-sm text-gray-500">Excel / Google Sheets</p>
                            </div>
                        </div>

                        <ul className="space-y-4">
                            {[
                                "Manual data entry (Slow)",
                                "No emotional tracking",
                                "Basic static charts",
                                "No mobile access",
                                "Lonely journey",
                                "0% Accountability"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-400">
                                    <X size={18} className="text-red-900" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* MEDYSA WAY */}
                    <div className="relative p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-gray-900 to-black shadow-2xl shadow-amber-900/10 transform md:-translate-y-4">
                        <div className="absolute top-0 right-0 p-1 px-3 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest rounded-bl-xl">
                            Elite Tier
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-black shadow-lg shadow-amber-500/20">
                                <Shield size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>The Warrior</h3>
                                <p className="text-sm text-amber-500">Medysa Ecosystem</p>
                            </div>
                        </div>

                        <ul className="space-y-4">
                            {[
                                "AI-Powered Analysis",
                                "Tilt & FOMO Detection",
                                "Live Equity Simulators",
                                "Full Mobile Command",
                                "Brotherhood & Rankings",
                                "100% Discipline Protocol"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-white font-medium">
                                    <div className="p-0.5 bg-green-500/20 rounded-full text-green-500">
                                        <Check size={14} />
                                    </div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <p className="text-center text-gray-400 text-sm italic">
                                &quot;This app paid for itself in one trade.&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
