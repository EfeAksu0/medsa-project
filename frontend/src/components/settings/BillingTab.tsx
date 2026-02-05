'use client';

import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Shield, Check, CreditCard, Mail, MailCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function BillingTab() {
    const { user } = useAuth();
    const [resendingEmail, setResendingEmail] = useState(false);
    const isAi = user?.tier === 'MEDYSA_AI';

    // Format subscription end date
    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Get subscription status display
    const getStatusDisplay = () => {
        const status = user?.subscriptionStatus;
        if (!status || status === 'active') {
            return { text: 'Active', color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' };
        } else if (status === 'canceled') {
            return { text: 'Canceled', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' };
        } else if (status === 'past_due') {
            return { text: 'Past Due', color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20' };
        } else if (status === 'trialing') {
            return { text: 'Trial', color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' };
        }
        return { text: status, color: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/20' };
    };

    const statusDisplay = getStatusDisplay();

    const handleResendVerification = async () => {
        setResendingEmail(true);
        try {
            // We'll use Supabase directly since we don't have a backend endpoint for this
            const { supabase } = await import('@/lib/supabase');
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: user?.email || '',
            });
            if (error) throw error;
            alert('Verification email sent! Please check your inbox.');
        } catch (error: any) {
            console.error('Failed to resend verification email:', error);
            alert('Failed to resend verification email. Please try again later.');
        } finally {
            setResendingEmail(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            {/* Email Verification Status */}
            {user?.emailVerified === false && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 flex items-start gap-4">
                    <AlertCircle className="text-orange-400 flex-shrink-0 mt-0.5" size={24} />
                    <div className="flex-1">
                        <h4 className="text-white font-bold mb-1">Email Not Verified</h4>
                        <p className="text-gray-400 text-sm mb-3">
                            Please verify your email address to ensure account security and receive important updates.
                        </p>
                        <button
                            onClick={handleResendVerification}
                            disabled={resendingEmail}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {resendingEmail ? 'Sending...' : 'Resend Verification Email'}
                        </button>
                    </div>
                </div>
            )}

            {user?.emailVerified && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                    <MailCheck className="text-green-400" size={20} />
                    <p className="text-sm text-green-400 font-medium">
                        Email verified ✓ {user?.emailVerifiedAt && `(${formatDate(user.emailVerifiedAt)})`}
                    </p>
                </div>
            )}

            {/* Current Plan */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-8 overflow-hidden relative">
                {/* Background glow */}
                <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 ${isAi ? 'bg-purple-600' : 'bg-amber-600'}`}></div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                    <div>
                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Current Plan</h3>
                        <div className="flex items-center gap-3">
                            <h2 className={`text-4xl font-black ${isAi ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' : 'text-amber-500'}`} style={{ fontFamily: 'Cinzel, serif' }}>
                                {isAi ? 'MEDYSA AI' : 'KNIGHTHOOD'}
                            </h2>
                            <span className={`px-3 py-1 ${statusDisplay.bgColor} ${statusDisplay.color} border ${statusDisplay.borderColor} rounded-full text-xs font-bold uppercase tracking-wider`}>
                                {statusDisplay.text}
                            </span>
                        </div>
                        <p className="text-gray-500 mt-2 max-w-md">
                            {isAi
                                ? 'You have unlocked the full arsenal. AI Coaching, Tilt Detection, and unlimited historical data are at your command.'
                                : 'You are armed with the essentials. Upgrade to Medysa AI to unlock neural analysis and real-time coaching.'}
                        </p>
                    </div>

                    {!isAi && (
                        <div className="flex-shrink-0">
                            <Link href="/upgrade" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg shadow-purple-900/20 hover:scale-105 transition-transform flex items-center gap-2">
                                <Shield size={18} />
                                Upgrade to AI
                            </Link>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <CreditCard size={16} className="text-gray-400" />
                            Billing Details
                        </h4>
                        <div className="space-y-2 text-sm text-gray-400">
                            <p>Status: <span className={`font-medium ${statusDisplay.color}`}>{statusDisplay.text}</span></p>
                            <p>
                                {user?.subscriptionStatus === 'canceled' ? 'Access Until: ' : 'Next Billing: '}
                                <span className="text-white">{formatDate(user?.subscriptionEndsAt)}</span>
                            </p>
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await api.post('/payments/create-portal-session');
                                        window.location.href = res.data.url;
                                    } catch (error: any) {
                                        console.error('Failed to create portal session', error);
                                        const errMessage = error.response?.data?.error || error.message || 'Unknown error';
                                        alert(`Subscription Error: ${errMessage}\n\nIf this persists, please contact support.`);
                                    }
                                }}
                                className="text-amber-500 hover:text-amber-400 text-xs underline mt-2 hover:no-underline transition-all"
                            >
                                Manage Stripe Subscription
                            </button>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Included Features</h4>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-gray-300">
                                <Check size={14} className="text-green-500" />
                                <span>Unlimited Trade Logging</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-300">
                                <Check size={14} className="text-green-500" />
                                <span>Vault System Access</span>
                            </li>
                            {isAi && (
                                <>
                                    <li className="flex items-center gap-2 text-sm text-white font-medium">
                                        <Check size={14} className="text-purple-400" />
                                        <span>AI Neural Coach</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-white font-medium">
                                        <Check size={14} className="text-purple-400" />
                                        <span>Psychological Parsing</span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
