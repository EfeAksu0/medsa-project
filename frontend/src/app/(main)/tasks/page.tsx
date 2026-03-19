'use client';

import { ToDoWidget } from '@/components/dashboard/ToDoWidget';
import { ClipboardList, Zap, Brain, ShieldCheck, Calendar } from 'lucide-react';

const tips = [
    { icon: ShieldCheck, label: 'Mental State', desc: 'Check HALT — Hungry, Angry, Lonely, or Tired?' },
    { icon: Calendar, label: 'News Events', desc: 'Review any high-impact news events for today.' },
    { icon: Zap, label: 'Daily Loss Limit', desc: 'Confirm your max loss limit before entering any position.' },
    { icon: Brain, label: 'Yesterday\'s Review', desc: 'What went wrong yesterday? What went right?' },
];

export default function TasksPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="p-1.5 bg-amber-500/10 rounded-lg">
                        <ClipboardList size={18} className="text-amber-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Pre-Trade Protocol</h1>
                </div>
                <p className="text-sm text-gray-500 pl-10">Complete your daily checklist before entering the market</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Todo Widget */}
                <div className="h-[580px]">
                    <ToDoWidget />
                </div>

                {/* Info Panel */}
                <div className="space-y-4">
                    {/* Quote */}
                    <div className="bg-gradient-to-br from-amber-950/30 to-gray-900/60 border border-amber-500/20 rounded-2xl p-5 backdrop-blur-sm">
                        <p className="text-amber-300 italic font-serif text-sm leading-relaxed">
                            &ldquo;Amateurs look for entries. Professionals follow processes.&rdquo;
                        </p>
                    </div>

                    {/* Protocol Tips */}
                    <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5 backdrop-blur-sm">
                        <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Key Checkpoints</h2>
                        <div className="space-y-3">
                            {tips.map((tip, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-gray-800/40 rounded-xl">
                                    <div className="p-1.5 bg-amber-500/10 rounded-lg shrink-0 mt-0.5">
                                        <tip.icon size={14} className="text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{tip.label}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{tip.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Why it matters */}
                    <div className="bg-gray-900/40 border border-gray-800/40 rounded-2xl p-5">
                        <h3 className="text-sm font-bold text-gray-300 mb-2">Why this works</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Consistency is the edge. By defining a strict set of rules before engaging the market,
                            you separate your <span className="text-white font-medium">logic</span> from your <span className="text-white font-medium">emotions</span>.
                            Traders who follow a pre-trade routine reduce impulsive decisions by up to 60%.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
