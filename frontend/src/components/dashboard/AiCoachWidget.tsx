'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, getSessions } from '@/lib/aiApi';
import { Sparkles, Send, Activity, Crosshair, BrainCircuit, AlertTriangle, Shield, Terminal } from 'lucide-react';

type AiPersona = 'MEDIC' | 'SNIPER' | 'FORENSIC' | 'NEUTRAL';

export function AiCoachWidget() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [persona, setPersona] = useState<AiPersona>('FORENSIC');
    const [sessionId, setSessionId] = useState<string | undefined>();

    // Load latest session logic to sync with full chat
    useEffect(() => {
        const loadSessionId = async () => {
            try {
                const sessions = await getSessions();
                if (sessions && sessions.length > 0) {
                    setSessionId(sessions[0].id);
                }
            } catch (error) {
                // Silent fail for widget
            }
        };
        loadSessionId();
    }, []);

    const handleQuickCheck = async () => {
        if (!message.trim() || loading) return;

        setLoading(true);
        setResponse(null);
        setExpanded(true);

        try {
            const result = await sendChatMessage(message, sessionId);
            setResponse(result.message.content);

            // Update session ID if this was a new session
            if (!sessionId) {
                setSessionId(result.sessionId);
            }

            // Map backend emotion to frontend persona
            const emotion = result.message.emotion?.toUpperCase() || 'FORENSIC';
            if (['MEDIC', 'SNIPER', 'FORENSIC'].includes(emotion)) {
                setPersona(emotion as AiPersona);
            } else {
                setPersona('FORENSIC');
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('AI check failed:', error);
            const errorMessage = error.response?.data?.error || 'Connection severed. Neural link unstable.';
            setResponse(errorMessage);
            setPersona('NEUTRAL');
        } finally {
            setLoading(false);
        }
    };

    // Dynamic Styles based on Persona
    const getStyles = () => {
        switch (persona) {
            case 'MEDIC':
                return {
                    border: 'border-red-500/50',
                    bg: 'bg-red-950/20',
                    title: 'TRAUMA TEAM',
                    icon: <Activity className="text-red-500 animate-pulse" size={20} />,
                    glow: 'shadow-[0_0_30px_rgba(239,68,68,0.2)]',
                    text: 'text-red-400'
                };
            case 'SNIPER':
                return {
                    border: 'border-cyan-500/50',
                    bg: 'bg-cyan-950/20',
                    title: 'OVERWATCH',
                    icon: <Crosshair className="text-cyan-500" size={20} />,
                    glow: 'shadow-[0_0_30px_rgba(6,182,212,0.2)]',
                    text: 'text-cyan-400'
                };
            case 'FORENSIC':
            default:
                return {
                    border: 'border-purple-500/50',
                    bg: 'bg-purple-950/20',
                    title: 'FORENSIC UNIT',
                    icon: <BrainCircuit className="text-purple-500" size={20} />,
                    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.2)]',
                    text: 'text-purple-400'
                };
        }
    };

    const styles = getStyles();

    return (
        <div className={`transition-all duration-500 rounded-xl p-1 relative overflow-hidden ${styles.glow} min-h-[400px]`}>
            {/* Background Image (Renaissance) */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
                style={{
                    backgroundImage: 'url(/ai-renaissance-bg.jpg)',
                    filter: 'grayscale(100%) contrast(1.2) brightness(0.4)'
                }}
            />

            {/* Neural Stream Scanline Background Overlay */}
            <div className={`absolute inset-0 ${styles.bg} opacity-80 z-0`} />
            <div className={`absolute inset-0 border-2 ${styles.border} rounded-xl z-20 pointer-events-none transition-colors duration-500`} />

            {/* Content Container */}
            <div className={`relative z-10 p-5 ${styles.bg} rounded-lg h-full flex flex-col`}>

                {/* Header */}
                <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                    <div className={`w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center border border-white/10 ${styles.text}`}>
                        {styles.icon}
                    </div>
                    <div>
                        <h2 className={`text-lg font-bold tracking-widest ${styles.text}`} style={{ fontFamily: 'Cinzel, serif' }}>
                            {styles.title}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-ping' : 'bg-emerald-500'}`} />
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                                {loading ? 'ANALYZING...' : 'SYSTEM ONLINE'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Interaction Area */}
                {!expanded ? (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-400 font-mono">
                            <span className="text-gray-600 mr-2">{'>'}</span>
                            Awaiting query. How can we assist, Operative?
                        </p>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleQuickCheck()}
                                    placeholder="Check my last trade..."
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 font-mono"
                                    disabled={loading}
                                />
                                <Terminal size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" />
                            </div>
                            <button
                                onClick={handleQuickCheck}
                                disabled={loading || !message.trim()}
                                className={`px-4 py-2 ${styles.text} bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all flex items-center gap-2 text-sm font-bold`}
                            >
                                <Send size={16} />
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => { setMessage('Autopsy my last trade. Be brutal.'); handleQuickCheck(); }}
                                className="flex-1 py-2 bg-red-950/30 border border-red-500/20 hover:bg-red-900/40 hover:border-red-500/40 text-red-400 text-[10px] uppercase tracking-wider font-bold rounded flex items-center justify-center gap-1 transition-all"
                            >
                                <AlertTriangle size={10} /> Autopsy Trade
                            </button>
                            <button
                                onClick={() => { setMessage('Run a pre-session psychological check.'); handleQuickCheck(); }}
                                className="flex-1 py-2 bg-emerald-950/30 border border-emerald-500/20 hover:bg-emerald-900/40 hover:border-emerald-500/40 text-emerald-400 text-[10px] uppercase tracking-wider font-bold rounded flex items-center justify-center gap-1 transition-all"
                            >
                                <Shield size={10} /> Pre-Session
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="bg-black/40 border-l-2 border-white/10 p-4 rounded-r-lg">
                            <p className="text-gray-500 text-xs font-mono mb-2 uppercase tracking-widest">
                                User Query
                            </p>
                            <p className="text-sm text-gray-300 italic">&quot;{message}&quot;</p>
                        </div>

                        <div className={`bg-black/60 border border-white/5 p-4 rounded-lg relative overflow-hidden group`}>
                            {/* Scanning effect */}
                            <div className={`absolute top-0 left-0 w-full h-[2px] ${styles.bg} opacity-50 animate-scan`} />

                            <p className={`text-xs ${styles.text} font-mono mb-2 uppercase tracking-widest flex items-center gap-2`}>
                                {styles.icon} {styles.title} Response
                            </p>
                            <p className="text-sm text-gray-200 leading-relaxed font-mono whitespace-pre-wrap">
                                {response || "Computing..."}
                            </p>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => {
                                    setExpanded(false);
                                    setMessage('');
                                    setResponse(null);
                                }}
                                className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
                            >
                                <Terminal size={12} /> NEW QUERY
                            </button>
                            <a
                                href="/ai-coach"
                                className={`text-xs ${styles.text} hover:opacity-80 transition-colors ml-auto flex items-center gap-1`}
                            >
                                FULL NEURAL LINK →
                            </a>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
            `}</style>

            {/* Artist Credit */}
            <div className="absolute bottom-1 right-2 z-30 opacity-40 hover:opacity-100 transition-opacity">
                <p className="text-[9px] text-white/50 font-serif italic tracking-wider">Art by RADİ</p>
            </div>
        </div>
    );
}
