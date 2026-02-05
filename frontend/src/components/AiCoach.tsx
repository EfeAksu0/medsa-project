'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, AiMessage, getSessions, getSession } from '@/lib/aiApi';
import { Send, Sparkles } from 'lucide-react';

export function AiCoach() {
    const [messages, setMessages] = useState<AiMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | undefined>();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load history on mount
    useEffect(() => {
        const loadSession = async () => {
            try {
                // Get all sessions
                const sessions = await getSessions();
                if (sessions && sessions.length > 0) {
                    // Use the most recent session
                    const lastSession = sessions[0];
                    setSessionId(lastSession.id);

                    // Fetch full history for this session
                    const sessionDetails = await getSession(lastSession.id);
                    if (sessionDetails && sessionDetails.messages) {
                        setMessages(sessionDetails.messages);
                    }
                }
            } catch (error) {
                console.error('Failed to load history:', error);
            }
        };

        loadSession();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: AiMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await sendChatMessage(input, sessionId);

            if (!sessionId) {
                setSessionId(response.sessionId);
            }

            setMessages((prev) => [...prev, response.message]);
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Failed to send message:', error);
            const errorMessage = error.response?.data?.error || 'System Error: Unable to complete analysis. Please retry.';

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: errorMessage,
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
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <Sparkles size={48} className="text-purple-500/30 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg mb-2">System Ready.</p>
                        <p className="text-gray-500 text-sm">
                            Submit trade query for analysis.
                        </p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-2xl p-4 ${msg.role === 'user'
                                ? 'bg-purple-600/20 border border-purple-500/30 text-white'
                                : 'bg-gray-800/50 border border-gray-700/50 text-gray-100'
                                }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}

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
