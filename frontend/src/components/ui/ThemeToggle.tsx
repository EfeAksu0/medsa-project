'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Shield, Zap } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
    const { theme, toggleTheme } = useTheme();
    const isPro = theme === 'pro';

    return (
        <button
            onClick={toggleTheme}
            type="button"
            title={`Switch to ${isPro ? 'Knight Mode' : 'Pro FinTech Mode'}`}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-300 shadow-sm ${
                isPro
                    ? 'bg-zinc-900 text-emerald-400 border-emerald-500/30 hover:border-emerald-400/60 shadow-emerald-950/40'
                    : 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:border-amber-400/60 shadow-amber-950/40'
            } ${className}`}
        >
            {isPro ? (
                <>
                    <Zap size={14} className="text-emerald-400 animate-pulse" />
                    <span>PRO MODE</span>
                </>
            ) : (
                <>
                    <Shield size={14} className="text-amber-400" />
                    <span>KNIGHT MODE</span>
                </>
            )}
        </button>
    );
}
