'use client';

import { Sparkles } from 'lucide-react';

const DEMO_MESSAGES = [
    { role: 'user', content: "I'm feeling anxious about my next trade" },
    { role: 'ai', content: "I hear you - pre-trade anxiety is really common. Take a deep breath. Before entering, ask yourself: 'Does this setup match my plan?' If yes, trust your process. One trade at a time! 💪", emotion: 'Anxious' },
    { role: 'user', content: "I just had 3 losses in a row" },
    { role: 'ai', content: "That's tough, but you're handling it right by checking in. Three losses doesn't define you - your response does. Take a 15-min break, review your journal, then decide if you're mentally ready to continue. How are you feeling right now?", emotion: 'Tilt' },
];

export function DemoSlideshow() {
    return (
        <div className="relative bg-gradient-to-br from-gray-900 via-purple-950/30 to-gray-900 rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/10">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-purple-500/20 bg-black/30">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-white font-bold tracking-wide">MEDYSA AI COACH</h3>
                    <p className="text-purple-300 text-xs">Your Personal Trading Psychologist</p>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 space-y-4 min-h-[280px] max-h-[320px] overflow-hidden">
                {DEMO_MESSAGES.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-purple-600 text-white rounded-br-sm'
                                    : 'bg-gray-800/80 text-gray-100 rounded-bl-sm border border-purple-500/20'
                                }`}
                        >
                            {msg.role === 'ai' && msg.emotion && (
                                <span className="text-purple-400 text-xs font-medium block mb-1">
                                    Emotion: {msg.emotion}
                                </span>
                            )}
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-purple-500/20 bg-black/20">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Share what's on your mind..."
                        className="flex-1 bg-gray-800/50 border border-purple-500/30 rounded-xl px-4 py-3 text-gray-300 placeholder-gray-500 text-sm focus:outline-none"
                        disabled
                    />
                    <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors">
                        SEND
                    </button>
                </div>
            </div>
        </div>
    );
}
