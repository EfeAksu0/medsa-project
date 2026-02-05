'use client';

import { AlertTriangle, ChevronDown, ShieldAlert, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';

const FAQS = [
    {
        question: "Is this just another journal?",
        answer: "Most journals are just graveyards for your failures. Medysa is an active psychologist and statistical arsenal. We don't just track—we intervene when we see you're about to tilt.",
        icon: <ShieldAlert className="text-amber-500" size={20} />
    },
    {
        question: "Can I afford this subscription?",
        answer: "The average 'Merchant' trader loses $14.99 in roughly 3 seconds of a bad trade. One AI intervention pays for the entire year. Can you afford to keep bleeding capital?",
        icon: <Zap className="text-purple-500" size={20} />
    },
    {
        question: "I already have a strategy, why do I need this?",
        answer: "Strategy is 20%. Discipline is 80%. Even the best strategy fails if you can't control your emotions. Medysa builds the iron mind around your strategy.",
        icon: <AlertTriangle className="text-red-500" size={20} />
    },
    {
        question: "Is my data secure in the Vault?",
        answer: "Our Vault uses military-grade isolation. Not even our algorithms can 'see' your confidential setups unless you explicitly grant access. Your edges stay yours.",
        icon: <Sparkles className="text-blue-500" size={20} />
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div id="faq" className="py-24 relative overflow-hidden bg-black/60">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                        Debunking the <span className="text-amber-500">Doubts</span>
                    </h2>
                    <p className="text-gray-400">Survival in the arena requires clarity. Let&apos;s settle the score.</p>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="group">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${openIndex === i
                                    ? 'bg-gray-900 border-amber-500/50 shadow-[0_0_20px_rgba(251,191,36,0.1)]'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    {faq.icon}
                                    <span className="text-lg font-bold font-serif tracking-wide">{faq.question}</span>
                                </div>
                                <ChevronDown
                                    size={20}
                                    className={`text-gray-500 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-amber-500' : ''}`}
                                />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-48' : 'max-h-0'}`}>
                                <div className="p-6 text-gray-400 leading-relaxed border-x border-b border-amber-500/20 rounded-b-2xl bg-gray-900/50">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
