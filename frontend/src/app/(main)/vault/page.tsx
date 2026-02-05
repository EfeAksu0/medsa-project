'use client';

import {
    BookOpen,
    Video,
    Brain,
    Sword,
    Shield,
    Scroll,
    Play,
    Lightbulb,
    FileText
} from 'lucide-react';
import Link from 'next/link';

export default function VaultPage() {
    const pillars = [
        {
            title: "The Strategy Forge",
            description: "Craft your weapons. Document your setups, define your edge, and build your playbooks.",
            icon: Sword,
            href: "/vault/strategies",
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/20",
            items: ["Trend Following", "Scalping Setups", "Swing Plays"]
        },
        {
            title: "The War Room",
            description: "Study the battles of the past. Watch educational videos and analyze market movements.",
            icon: Video,
            href: "/vault/videos",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20",
            items: ["Market Analysis", "Live Trading Sessions", "Tutorials"]
        },
        {
            title: "The Inner Sanctum",
            description: "Master yourself. Resources for trading psychology, discipline, and emotional control.",
            icon: Brain,
            href: "/vault/psychology",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/20",
            items: ["Emotional Control", "Discipline Drills", "Mindset Shift"]
        },
        {
            title: "The Scribe's Log",
            description: "Document your daily observations. Keep track of your thoughts, ideas, and lessons learned in the field.",
            icon: FileText,
            href: "/vault/notes",
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
            borderColor: "border-emerald-500/20",
            items: ["Daily Journal", "Market Observations", "Quick Notes"]
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                    The Knowledge Vault
                </h1>
                <p className="text-gray-400">
                    Sharpen your mind and your blade. Here lies the wisdom of the battlefield.
                </p>
            </div>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pillars.map((pillar, index) => (
                    <Link
                        key={index}
                        href={pillar.href}
                        className={`group relative p-8 rounded-2xl bg-gray-900/50 border ${pillar.borderColor} hover:border-opacity-50 transition-all duration-300 hover:transform hover:-translate-y-1 overflow-hidden`}
                    >
                        {/* Background Glow */}
                        <div className={`absolute top-0 right-0 w-32 h-32 ${pillar.bgColor} blur-[50px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity`} />

                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl ${pillar.bgColor} flex items-center justify-center mb-6`}>
                            <pillar.icon size={24} className={pillar.color} />
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
                            {pillar.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                            {pillar.description}
                        </p>

                        {/* Mini List */}
                        <div className="space-y-2">
                            {pillar.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                                    <div className={`w-1 h-1 rounded-full ${pillar.color}`} />
                                    {item}
                                </div>
                            ))}
                        </div>

                        {/* CTA Arrow */}
                        <div className={`absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 ${pillar.color}`}>
                            <Scroll size={20} />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Updates / Featured Content - Placeholder */}
            <div className="mt-12">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Lightbulb size={20} className="text-yellow-500" />
                    <span>Latest Wisdom</span>
                </h2>

                <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-full md:w-48 h-28 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                                <Play size={16} className="text-white ml-1" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                New Video
                            </span>
                            <span className="text-xs text-gray-500">2 days ago</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Mastering the Mental Game: Fear & Greed</h3>
                        <p className="text-sm text-gray-400">
                            An in-depth look at how fear and greed affect your decision making on the battlefield, and practical exercises to overcome them.
                        </p>
                    </div>
                    <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors border border-gray-700">
                        Watch Now
                    </button>
                </div>
            </div>
        </div>
    );
}
