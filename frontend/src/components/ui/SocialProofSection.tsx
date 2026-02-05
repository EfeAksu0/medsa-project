'use client';

import { Shield, Zap, Globe, Lock } from 'lucide-react';

const PARTNERS = [
    { name: "Global Liquidity", icon: <Globe size={20} /> },
    { name: "Secure Protocol", icon: <Lock size={20} /> },
    { name: "Quantum Speed", icon: <Zap size={20} /> },
    { name: "Elite Guard", icon: <Shield size={20} /> },
];

export function SocialProofSection() {
    return (
        <div className="py-12 border-y border-white/5 bg-black/20">
            <div className="container mx-auto px-6">
                <p className="text-center text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-8">
                    Trusted by warriors across the leading arenas
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
                    {PARTNERS.map((partner, i) => (
                        <div key={i} className="flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-80 transition-all duration-500 group cursor-default">
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-amber-500/30 group-hover:bg-amber-500/5 transition-colors">
                                {partner.icon}
                            </div>
                            <span className="text-sm font-bold tracking-[0.2em] font-serif uppercase">
                                {partner.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
