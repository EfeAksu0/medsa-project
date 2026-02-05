'use client';

import { Star, TrendingUp, Trophy } from 'lucide-react';

const TESTIMONIALS = [
    {
        name: "Valerius",
        role: "Prop Firm Funded",
        amount: "+$12.4k Recovered",
        text: "I was underwater $8k this month. The AI Coach caught my revenge-trading pattern after the 3rd loss. Saved the rest of the account. It literally has no price.",
        color: "amber"
    },
    {
        name: "Seraphina",
        role: "Full-Time Knight",
        amount: "+42% Consistency",
        text: "The Vault changed everything. Separating my 'gambling' testing folders from my main stats gave me the mental clarity to size up on what actually works.",
        color: "purple"
    },
    {
        name: "Kaelen",
        role: "Elite Warrior",
        amount: "Zero Tilt in 30 Days",
        text: "The psychology metrics are brutal but necessary. It told me I wasn't a trader, I was a merchant of luck. Now I trade with iron discipline.",
        color: "emerald"
    }
];

export function TestimonialWall() {
    return (
        <div id="testimonials" className="py-24 relative bg-[#0a0f1a]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                        Voices from the <span className="text-amber-500">Frontline</span>
                    </h2>
                    <p className="text-gray-400">Real warriors. Real data. Real results.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/20 to-transparent rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative bg-black/40 border border-white/5 p-8 rounded-3xl hover:border-amber-500/30 transition-all duration-500 h-full flex flex-col">
                                <div className="flex items-center gap-1 text-amber-500 mb-6">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <p className="text-gray-300 italic mb-8 flex-grow leading-relaxed">&quot;{t.text}&quot;</p>

                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                    <div>
                                        <h4 className="font-bold text-white font-serif">{t.name}</h4>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{t.role}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                                            <Trophy size={10} /> {t.amount}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
