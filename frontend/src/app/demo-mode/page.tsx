'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Shield } from 'lucide-react';

// Tradovate Components
import TradovateHeader from '../../components/tradovate/TradovateHeader';
import TradovateSidebar from '../../components/tradovate/TradovateSidebar';

// Chart Component
import TradingChart from '../../components/TradingChart';

// Scenarios Data
const SCENARIOS = [
    {
        id: 'mesh6-quick',
        instrument: 'MESH6',
        name: 'Quick Scalp (15s)',
        duration: 15,
        volatility: 'high',
        entryPrice: 5120.50,
        lotSize: 2,
        profitTarget: 300
    },
    {
        id: 'nqh6-trend',
        instrument: 'NQH6',
        name: 'Trend Follow (30s)',
        duration: 30,
        volatility: 'medium',
        entryPrice: 18050.25,
        lotSize: 1,
        profitTarget: 450
    },
    {
        id: 'rtyh6-chop',
        instrument: 'RTYH6',
        name: 'Choppy Market (45s)',
        duration: 45,
        volatility: 'high',
        entryPrice: 2410.10,
        lotSize: 3,
        profitTarget: 250
    },
    {
        id: 'clh6-news',
        instrument: 'CLH6',
        name: 'News Spike (10s)',
        duration: 10,
        volatility: 'extreme',
        entryPrice: 78.40,
        lotSize: 5,
        profitTarget: 600
    },
    {
        id: 'gch6-slow',
        instrument: 'GCH6',
        name: 'Slow Grind (60s)',
        duration: 60,
        volatility: 'low',
        entryPrice: 2045.80,
        lotSize: 1,
        profitTarget: 200
    }
];

const PSYCHOLOGY_MESSAGES = [
    "Don't chase the market. Let the price come to you.",
    "Stick to your plan. Emotions are your enemy right now.",
    "Breathe. You are in control of your execution.",
    "Patience pays. Wait for the perfect setup.",
    "Protect your capital. Risk management is priority #1.",
    "Stay disciplined. One bad trade doesn't define you.",
    "Focus on the process, not the P&L.",
    "Don't get greedy. Secure your profits when appropriate.",
    "Market noise is a distraction. Trust your analysis.",
    "Keep your cool. Hesitation leads to mistakes."
];

export default function DemoModePage() {
    const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
    const [simState, setSimState] = useState({
        currentTime: 0,
        currentPrice: SCENARIOS[0].entryPrice,
        currentPnL: 0,
        showAiWarning: false,
        activeMessage: null as string | null,
        messageShown: false,
        isComplete: false,
    });
    const [userDirection, setUserDirection] = useState<'LONG' | 'SHORT' | null>(null);
    const [isWaitingForEntry, setIsWaitingForEntry] = useState(true);
    const [speed, setSpeed] = useState(1);
    const [initialBalance] = useState(25000);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Use refs for values that change frequently but don't need to trigger re-renders
    const scenarioRef = useRef(selectedScenario);
    const speedRef = useRef(speed);
    const directionRef = useRef<'LONG' | 'SHORT' | null>(null);
    const requestRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number | null>(null);

    // Keep refs in sync
    useEffect(() => { scenarioRef.current = selectedScenario; }, [selectedScenario]);
    useEffect(() => { speedRef.current = speed; }, [speed]);
    useEffect(() => { directionRef.current = userDirection; }, [userDirection]);

    const handleReset = useCallback(() => {
        setSimState({
            currentTime: 0,
            currentPrice: scenarioRef.current.entryPrice,
            currentPnL: 0,
            showAiWarning: false,
            activeMessage: null,
            messageShown: false,
            isComplete: false,
        });
        setUserDirection(null);
        setIsWaitingForEntry(true);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }, []);

    // Stable animate function using refs
    const animateRef = useRef<((time: number) => void) | null>(null);

    const animate = useCallback((time: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = time;
        const deltaTime = (time - lastTimeRef.current) / 1000;
        lastTimeRef.current = time;

        const scenario = scenarioRef.current;
        const speedMultiplier = speedRef.current === 1 ? 1 : speedRef.current === 5 ? 5 : 15;

        setSimState(prev => {
            const newTime = prev.currentTime + (deltaTime * speedMultiplier);
            const progress = Math.min(newTime / scenario.duration, 1);

            const expectedPnL = scenario.profitTarget * Math.pow(progress, 1.2);
            const noise = (Math.random() - 0.5) * (scenario.profitTarget * 0.1);
            const nextPnL = expectedPnL + noise;

            const pointValue = 50;
            const priceChange = nextPnL / (scenario.lotSize * pointValue);

            const nextPrice = directionRef.current === 'SHORT'
                ? scenario.entryPrice - priceChange
                : scenario.entryPrice + priceChange;

            const shouldShowWarning = progress > 0.75 && progress < 0.9;

            // Logic for Psychology Message
            let newMessage = prev.activeMessage;
            let messageShown = prev.messageShown;

            if (!messageShown && progress > 0.3 && progress < 0.6) {
                if (Math.random() < 0.05) {
                    const randomIndex = Math.floor(Math.random() * PSYCHOLOGY_MESSAGES.length);
                    newMessage = PSYCHOLOGY_MESSAGES[randomIndex];
                    messageShown = true;
                }
            }

            if (prev.activeMessage && progress > 0.8) {
                newMessage = null;
            }

            if (progress >= 1) {
                return {
                    currentTime: newTime,
                    currentPrice: nextPrice,
                    currentPnL: scenario.profitTarget,
                    showAiWarning: false,
                    activeMessage: null,
                    messageShown: true,
                    isComplete: true,
                };
            }

            requestRef.current = requestAnimationFrame((t) => animateRef.current?.(t));

            return {
                currentTime: newTime,
                currentPrice: nextPrice,
                currentPnL: nextPnL,
                showAiWarning: shouldShowWarning,
                activeMessage: newMessage,
                messageShown: messageShown,
                isComplete: false,
            };
        });
    }, []);

    useEffect(() => { animateRef.current = animate; }, [animate]);

    const startTrade = useCallback((direction: 'LONG' | 'SHORT') => {
        if (!isWaitingForEntry) return;

        // Batch all state updates together
        setUserDirection(direction);
        setIsWaitingForEntry(false);
        directionRef.current = direction;
        lastTimeRef.current = performance.now();

        // Start animation on next frame to avoid blocking
        requestAnimationFrame(() => {
            requestRef.current = requestAnimationFrame(animate);
        });
    }, [isWaitingForEntry, animate]);

    const progress = Math.min(simState.currentTime / selectedScenario.duration, 1);
    const equity = initialBalance + simState.currentPnL;

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsFullScreen(false);
            if (e.shiftKey && (e.key === 'B' || e.key === 'b')) startTrade('LONG');
            if (e.shiftKey && (e.key === 'S' || e.key === 's')) startTrade('SHORT');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [startTrade]);

    return (
        <div className="flex flex-col h-screen w-screen bg-[#000000] font-sans overflow-hidden text-[#e0e0e0]">
            {!isFullScreen && (
                <TradovateHeader
                    symbol={selectedScenario.instrument}
                    accountBalance={initialBalance}
                    equity={equity}
                    openPl={simState.currentPnL}
                    currentPrice={simState.currentPrice}
                    onBuy={() => startTrade('LONG')}
                    onSell={() => startTrade('SHORT')}
                    onReset={handleReset}
                    speed={speed}
                    setSpeed={setSpeed}
                    scenarios={SCENARIOS}
                    onSelectScenario={setSelectedScenario}
                    onMaximize={() => setIsFullScreen(true)}
                />
            )}

            <div className="flex flex-1 overflow-hidden relative">
                <div className="flex-1 relative bg-black">
                    <TradingChart
                        entryPrice={selectedScenario.entryPrice}
                        currentPrice={simState.currentPrice}
                        direction={userDirection || 'LONG'}
                        progress={progress}
                        instrument={selectedScenario.instrument}
                    />

                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none select-none">
                        <div className="bg-[#333] px-2 py-0.5 rounded text-[10px] font-bold text-gray-300">1S</div>
                        <div className="text-[#444] font-black text-xl leading-none tracking-tighter opacity-50">Tv</div>
                    </div>

                    <div className="absolute bottom-4 right-16 flex flex-col items-end pointer-events-none opacity-40 text-gray-500 text-[10px]">
                        <div>REC: {simState.currentTime.toFixed(1)}s / {selectedScenario.duration}s</div>
                        <div className="text-[9px]">Press {isFullScreen ? 'Esc' : 'Win+Alt+R'} to {isFullScreen ? 'Exit' : 'Record'}</div>
                    </div>

                    {simState.showAiWarning && (
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-yellow-900/80 border border-yellow-500 text-yellow-100 px-4 py-2 rounded shadow-lg animate-pulse z-50 flex items-center gap-2 backdrop-blur-sm">
                            <Shield className="w-4 h-4" />
                            <span className="font-bold text-sm">AI Warning: High Volatility</span>
                        </div>
                    )}

                    {simState.activeMessage && (
                        <div className="absolute top-32 right-4 max-w-xs bg-[#0f0a15]/95 border border-purple-500/50 text-purple-50 p-4 rounded-xl shadow-2xl z-50 backdrop-blur-md animate-slide-in-right">
                            <div className="flex items-center gap-2 mb-2 border-b border-purple-900/50 pb-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-900 flex items-center justify-center shadow-lg">
                                    <span className="text-[10px] font-bold text-white">M</span>
                                </div>
                                <span className="font-bold text-sm text-purple-400">Medysa AI</span>
                                <span className="text-[10px] text-purple-300/50 ml-auto">Live Analysis</span>
                            </div>
                            <p className="text-xs font-medium leading-relaxed font-mono">
                                <span className="text-purple-500 mr-2">➜</span>
                                {simState.activeMessage}
                            </p>
                        </div>
                    )}

                    {simState.isComplete && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1b5e20] border border-green-500 text-white px-8 py-6 rounded-lg shadow-2xl text-center z-50 backdrop-blur-md bg-opacity-90">
                            <div className="font-bold text-2xl mb-2">TP HIT</div>
                            <div className="text-xl font-mono text-green-300 mb-4">+${simState.currentPnL.toFixed(2)}</div>
                            <button
                                onClick={() => setSimState(prev => ({ ...prev, isComplete: false }))}
                                className="px-4 py-2 bg-[#2e7d32] hover:bg-[#388e3c] rounded text-sm font-bold shadow transition-transform hover:scale-105 active:scale-95"
                            >
                                CLOSE
                            </button>
                        </div>
                    )}
                </div>

                {!isFullScreen && <TradovateSidebar />}
            </div>
        </div>
    );
}
