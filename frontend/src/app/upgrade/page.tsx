'use client';

import Link from 'next/link';
import { BattlefieldBackground } from '@/components/ui/BattlefieldBackground';
import { Shield, Check, ArrowLeft, Crown, Zap } from 'lucide-react';

export default function UpgradePage() {
    return (
        <div className="min-h-screen bg-[#050810] text-gray-100">
            <BattlefieldBackground />

            <div className="container mx-auto px-6 py-20 relative z-10">
                {/* Back Link */}
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors mb-8">
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </Link>

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-6">
                        <Crown size={16} /> Unlock Your Full Potential
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
                        Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Elite Squire</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Access unlimited accounts, playbooks, and advanced analytics to dominate the markets.
                    </p>
                </div>

                {/* Pricing Card */}
                <div className="max-w-lg mx-auto relative group mb-16">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-amber-500/30 p-12 shadow-2xl">
                        {/* Background Glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full"></div>

                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] font-bold uppercase tracking-widest mb-6">
                                <Zap size={12} /> Best Value
                            </div>
                            <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>The Elite Squire</h3>
                            <div className="flex items-baseline justify-center gap-2 mb-2">
                                <span className="text-6xl font-black text-white">$14.99</span>
                                <span className="text-gray-400 text-lg font-medium">/month</span>
                            </div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Cancel Anytime • Instant Access</p>
                        </div>

                        <button className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-gray-900 font-black rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(251,191,36,0.3)] hover:shadow-amber-500/50 hover:scale-105 uppercase tracking-widest mb-10 text-center" style={{ fontFamily: 'Cinzel, serif' }}>
                            Unlock Premium Now
                        </button>

                        <div className="space-y-4">
                            <p className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">What You&apos;ll Unlock:</p>
                            {[
                                'Connect UNLIMITED Accounts',
                                'Unlimited Playbooks & Strategy Vault',
                                'Real-time Battlefield Metrics',
                                'Sessions Trade Replay (Battle Replay)',
                                'Elite Discord Community Access',
                                'Priority Support'
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 border border-amber-500/30">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <span className="text-gray-200 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-8 border-t border-white/5 text-center">
                            <p className="text-xs text-gray-500">
                                🔒 Secure payment powered by Stripe • 30-day money-back guarantee
                            </p>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="max-w-3xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mx-auto mb-4 border border-blue-500/20">
                                <Shield size={32} />
                            </div>
                            <h4 className="font-bold text-white mb-2">Secure & Encrypted</h4>
                            <p className="text-sm text-gray-400">Your data is protected with military-grade encryption</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mx-auto mb-4 border border-amber-500/20">
                                <Zap size={32} />
                            </div>
                            <h4 className="font-bold text-white mb-2">Instant Activation</h4>
                            <p className="text-sm text-gray-400">Access all features immediately after upgrade</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mx-auto mb-4 border border-emerald-500/20">
                                <Crown size={32} />
                            </div>
                            <h4 className="font-bold text-white mb-2">Elite Support</h4>
                            <p className="text-sm text-gray-400">Priority access to our expert support team</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');
            `}</style>
        </div>
    );
}
