'use client';

import Link from 'next/link';
import { BattlefieldBackground } from '@/components/ui/BattlefieldBackground';
import { Shield, Check, ArrowLeft, Crown, Zap } from 'lucide-react';
import api from '@/lib/api';
import { useState } from 'react';

export default function UpgradePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUpgrade = async (planId: 'knight' | 'ai') => {
        try {
            setIsLoading(true);
            setError('');
            const token = localStorage.getItem('token');
            const response = await api.post('/payments/create-checkout-session',
                { planId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (err: any) {
            console.error('Upgrade error:', err);
            setError(err.response?.data?.error || err.message || 'Payment initialization failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050810] text-gray-100">
            <BattlefieldBackground />

            <div className="container mx-auto px-6 py-20 relative z-10">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors mb-8">
                    <ArrowLeft size={20} />
                    <span>Back to Frontpage</span>
                </Link>

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-6">
                        <Crown size={16} /> Unlock Your Full Potential
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
                        Upgrade for <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Arena Access</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Your account is currently inactive. Select your rank to enter the dashboard.
                    </p>
                </div>

                {error && (
                    <div className="max-w-md mx-auto mb-10 flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm">
                        <span className="mt-0.5 shrink-0">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
                    {/* Knighthood */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-b from-amber-600 to-amber-900 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative h-full bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-amber-500/20 p-10 flex flex-col shadow-2xl">
                            <div className="mb-8">
                                <div className="p-3 w-fit rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6 font-bold text-amber-500 text-[10px] uppercase tracking-widest">
                                    50% OFF First Month
                                </div>
                                <h3 className="text-2xl font-bold text-amber-500 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Knighthood</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-white">$9.99</span>
                                    <span className="text-gray-500 line-through">$19.98</span>
                                    <span className="text-gray-500 text-sm">/mo</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 flex-1">
                                {[
                                    'Connect Unlimited Accounts',
                                    'Vault System Access',
                                    'Advanced Performance Analytics',
                                    'Playbook & Strategy Builder',
                                    'Priority Discord Access'
                                ].map((f, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className="text-gray-300 text-sm">{f}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleUpgrade('knight')}
                                disabled={isLoading}
                                className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black font-black rounded-xl transition-all uppercase tracking-widest text-sm"
                                style={{ fontFamily: 'Cinzel, serif' }}
                            >
                                {isLoading ? 'Connecting...' : 'Select Knighthood'}
                            </button>
                        </div>
                    </div>

                    {/* Medysa AI */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative h-full bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-10 flex flex-col shadow-2xl">
                            <div className="mb-8 font-bold">
                                <div className="p-3 w-fit rounded-xl bg-purple-500/15 border border-purple-500/30 mb-6 text-purple-400 text-[10px] uppercase tracking-widest flex items-center gap-2">
                                    <Zap size={12} /> RECOMMENDED
                                </div>
                                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Medysa AI</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-white">$14.99</span>
                                    <span className="text-gray-500 line-through">$29.98</span>
                                    <span className="text-gray-500 text-sm">/mo</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 flex-1">
                                {[
                                    'Everything in Knighthood',
                                    'Medysa AI Neural Coach',
                                    'Psychological Pulse Analysis',
                                    'Tilt Detection & Risk Sentinel',
                                    'Real-time Battle Metrics'
                                ].map((f, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-purple-500/15 flex items-center justify-center text-purple-400">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className="text-gray-300 text-sm">{f}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleUpgrade('ai')}
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-black rounded-xl transition-all shadow-lg shadow-purple-900/20 uppercase tracking-widest text-sm"
                                style={{ fontFamily: 'Cinzel, serif' }}
                            >
                                {isLoading ? 'Connecting...' : 'Select Medysa AI'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="max-w-3xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mx-auto mb-4 border border-blue-500/20">
                                <Shield size={24} />
                            </div>
                            <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">Secure Payment</h4>
                            <p className="text-xs text-gray-500">256-bit SSL Encryption via Stripe</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mx-auto mb-4 border border-amber-500/20">
                                <Zap size={24} />
                            </div>
                            <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">Instant Access</h4>
                            <p className="text-xs text-gray-500">Activation within seconds of pay</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mx-auto mb-4 border border-emerald-500/20">
                                <Crown size={24} />
                            </div>
                            <h4 className="font-bold text-white text-sm mb-1 uppercase tracking-wider">Cancel Anytime</h4>
                            <p className="text-xs text-gray-500">No contracts, no hidden fees</p>
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

