'use client';

import { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { sendChatMessage, AiMessage, getSessions, getSession } from '@/lib/aiApi';
import { Send, Sparkles } from 'lucide-react';

export function AiCoach() {
    // ── Session discovery ────────────────────────────────────────────────────
    const { data: sessions = [] } = useSWR('/ai/sessions', getSessions);
    const lastSessionId = sessions?.[0]?.id;

    const { data: sessionDetails } = useSWR(
        lastSessionId ? `/ai/sessions/${lastSessionId}` : null,
        () => getSession(lastSessionId!)
    );

    // ── Local state (SOURCE OF TRUTH for rendering) ───────────────────────────
    const [messages, setMessages] = useState<AiMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | undefined>();
    // Ref (not state) so it updates synchronously — before any renders
    const hasUserSentMessage = useRef(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ── Load history ONCE on first mount, but NEVER after user starts chatting ─
    useEffect(() => {
        // If user has already typed and sent, block SWR from overwriting
        if (hasUserSentMessage.current) return;
        if (sessionDetails?.messages) {
            setMessages(sessionDetails.messages);
            setSessionId(lastSessionId);
        }
    }, [sessionDetails, lastSessionId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // ── Send message ─────────────────────────────────────────────────────────
    const handleSend = async () => {
        if (!input.trim() || loading) return;

        // IMMEDIATELY lock out SWR from overwriting state — synchronous ref update
        hasUserSentMessage.current = true;

        const userMessage: AiMessage = {
            id: `temp-${Date.now()}`,
            role: 'user',
            content: input,
            createdAt: new Date().toISOString(),
        };

        // 1. Immediately append to local state — this never gets deleted
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await sendChatMessage(input, sessionId);

            if (response.sessionId) {
                setSessionId(response.sessionId);
            }

            // 2. Replace temp user message with confirmed one, append AI reply
            setMessages(prev => {
                // Remove our temp message (by detecting it's the temp id)
                const withoutTemp = prev.filter(m => m.id !== userMessage.id);
                // Add back as "real" from server perspective + the AI response
                const confirmed: AiMessage = {
                    ...userMessage,
                    id: `confirmed-${Date.now()}`,
                };
                return [...withoutTemp, confirmed, response.message];
            });

        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Failed to send message:', error);
            const errData = error.response?.data;
            const errorMessage =
                errData?.detail || errData?.error || error.message || 'System Error. Please retry.';

            setMessages(prev => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    role: 'assistant',
                    content: `⚠️ ${errorMessage}`,
                    createdAt: new Date().toISOString(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-purple-500/20 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-b border-purple-500/20 p-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                        <Sparkles size={24} className="text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                            Medysa Analyst
                        </h2>
                        <p className="text-sm text-purple-300">Professional Trading Intelligence</p>
                    </div>

                    {/* Tribute Badge */}
                    <div className="ml-auto group relative">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/10 bg-purple-500/5 hover:bg-purple-500/10 transition-all cursor-help">
                            <span className="w-2 h-2 rounded-full bg-purple-500/40 animate-pulse" />
                            <span className="text-xs font-serif text-purple-400/50 group-hover:text-purple-300 transition-colors uppercase tracking-widest">Legacy</span>
                        </div>
                        <div className="absolute right-0 top-full mt-3 w-64 p-4 bg-gray-900/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-[-10px] group-hover:translate-y-0 pointer-events-none z-50">
                            <p className="text-xs text-purple-200 text-center font-serif leading-relaxed italic">
                                &quot;Built in honor of my father. <br />
                                <span className="opacity-50 not-italic block mt-2 text-[10px] tracking-wider font-sans">THE ETERNAL MENTOR</span>&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <Sparkles size={48} className="text-purple-500/30 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg mb-2">System Ready.</p>
                        <p className="text-gray-500 text-sm">
                            Submit trade query for analysis.
                        </p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isUser = msg.role === 'user';
                    const emotion = msg.emotion;

                    let assistantStyles = 'bg-gray-800/50 border-gray-700/50 shadow-none';
                    if (emotion === 'MEDIC') {
                        assistantStyles = 'bg-amber-950/20 border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.1)]';
                    } else if (emotion === 'SNIPER') {
                        assistantStyles = 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]';
                    } else if (emotion === 'FORENSIC') {
                        assistantStyles = 'bg-blue-950/20 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]';
                    }

                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl p-4 transition-all duration-500 ${isUser
                                    ? 'bg-purple-600/20 border border-purple-500/30 text-white'
                                    : `border text-gray-100 ${assistantStyles}`
                                    }`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    );
                })}

                {loading && (
                    <div className="flex justify-start">
                        <div className="max-w-[70%] rounded-2xl p-4 bg-gray-800/50 border border-gray-700/50">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-purple-500/20 p-4 bg-gray-900/50">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Request market analysis..."
                        className="flex-1 bg-gray-800/50 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center gap-2 uppercase tracking-widest text-sm"
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        <Send size={18} />
                        ANALYZE
                    </button>
                </div>
            </div>
        </div>
    );
}
