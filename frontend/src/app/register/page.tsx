'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { BattlefieldBackground } from '@/components/ui/BattlefieldBackground';
import { Shield, Sword } from 'lucide-react';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterForm() {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan');


    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmitRegister = async (data: RegisterFormData) => {
        try {
            // Use backend API for registration instead of Supabase magic link
            const response = await api.post('/auth/register', {
                email: data.email,
                name: data.name,
                password: data.password,
                plan: plan || 'knight'
            });

            // Automatically login the user
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                // Don't auto-redirect in context, we handle it here
                login(response.data.token, response.data.user, false);

                // Redirect to payment if plan selected
                if (plan) {
                    try {
                        // Create checkout session
                        const paymentResponse = await api.post('/payments/create-checkout-session', {
                            planId: plan
                        }, {
                            headers: {
                                'Authorization': `Bearer ${response.data.token}`
                            }
                        });

                        if (paymentResponse.data.url) {
                            window.location.href = paymentResponse.data.url;
                            return;
                        }
                    } catch (paymentErr: any) {
                        console.error('Payment redirection error:', paymentErr);
                        // Show error to user instead of redirecting
                        setError(`Payment initialization failed: ${paymentErr.response?.data?.error || paymentErr.message}`);
                        // Do NOT redirect to dashboard automatically so we can see the error
                    }
                } else {
                    window.location.href = '/dashboard';
                }
            }

        } catch (err: any) {
            console.error('Registration error:', err);

            // Handle specific error messages
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    // If no plan is selected, show the plan selection screen
    if (!plan) {
        return (
            <div className="flex min-h-screen items-center justify-center relative overflow-hidden py-20">
                <BattlefieldBackground />

                <div className="relative z-10 container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Link href="/" className="inline-block relative w-24 h-24 mb-6 hover:scale-105 transition-transform cursor-pointer">
                            <Image
                                src="/logo.png"
                                alt="Medysa Logo"
                                fill
                                className="object-contain drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                                priority
                            />
                        </Link>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                            Choose Your Weapon
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto text-lg font-serif">
                            Before you enter the order, select your rank.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Tier 1: Knighthood */}
                        <Link href="/register?plan=knight" className="group relative transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="absolute -inset-1 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-yellow-500/50 p-8 shadow-2xl overflow-hidden h-full flex flex-col hover:bg-gray-900 transition-colors">
                                <h3 className="text-2xl font-bold mb-2 text-yellow-400" style={{ fontFamily: 'Cinzel, serif' }}>Knighthood</h3>
                                <div className="mb-2">
                                    <div className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
                                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">50% OFF First Month</span>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-3 mb-6">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-gray-600 line-through">$19.98</span>
                                        <span className="text-5xl font-black text-white">$9.99</span>
                                    </div>
                                    <span className="text-gray-500 text-sm font-medium">/mo</span>
                                </div>
                                <div className="space-y-4 mb-8">
                                    {[
                                        'Unlimited Accounts', 'Vault System Access', 'Full Session Replays', 'Advanced Analytics'
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">✓</div>
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-auto w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-gray-900 font-bold rounded-xl text-center uppercase tracking-widest text-sm shadow-lg group-hover:shadow-amber-500/40 transition-all">
                                    Select Knighthood
                                </div>
                            </div>
                        </Link>

                        {/* Tier 2: Medysa AI */}
                        <Link href="/register?plan=ai" className="group relative transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="absolute -inset-1 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                            <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-purple-500/50 p-8 shadow-2xl overflow-hidden h-full flex flex-col hover:bg-gray-900 transition-colors">
                                <div className="absolute top-0 right-0 p-4">
                                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                                        Recommended
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" style={{ fontFamily: 'Cinzel, serif' }}>Medysa AI</h3>
                                <div className="mb-2">
                                    <div className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
                                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">50% OFF First Month</span>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-3 mb-6">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-gray-600 line-through">$29.98</span>
                                        <span className="text-5xl font-black text-white">$14.99</span>
                                    </div>
                                    <span className="text-gray-500 text-sm font-medium">/mo</span>
                                </div>
                                <div className="space-y-4 mb-8">
                                    {[
                                        'Everything in Knighthood', 'Medysa AI Coach Access', 'Tilt Detection', 'Risk Sentinel'
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">✓</div>
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-auto w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-center uppercase tracking-widest text-sm shadow-lg group-hover:shadow-purple-500/40 transition-all">
                                    Select Medysa AI
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }



    return (
        <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
            <BattlefieldBackground />

            {/* Medieval fortress entrance */}
            <div className="w-full max-w-md space-y-8 bg-gradient-to-b from-gray-900/95 via-gray-800/95 to-gray-900/95 p-10 rounded-2xl shadow-2xl border-2 border-amber-600/30 backdrop-blur-sm z-10 relative">
                {/* Decorative shields */}
                <div className="absolute -top-4 -left-4 opacity-20">
                    <Shield size={48} className="text-amber-500" />
                </div>
                <div className="absolute -top-4 -right-4 opacity-20">
                    <Sword size={48} className="text-amber-500" />
                </div>

                <div className="text-center flex flex-col items-center gap-4">
                    <div className="relative w-24 h-24">
                        <Image
                            src="/logo.png"
                            alt="Medysa Logo"
                            fill
                            className="object-contain drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                            priority
                        />
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                            MEDYSA
                        </h2>
                        <p className="mt-2 text-amber-300/70 font-medium" style={{ fontFamily: 'serif' }}>
                            ⚔️ Join the Order ⚔️
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <p className="text-xs text-amber-500/50 uppercase tracking-wider">
                                Plan: <span className="text-amber-400 font-bold">{plan === 'ai' ? 'Medysa AI' : 'Knighthood'}</span>
                            </p>
                            <Link href="/register" className="text-[10px] text-gray-500 hover:text-white underline">Change</Link>
                        </div>

                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border-2 border-red-500/50 text-red-400 p-4 rounded-lg text-sm backdrop-blur-sm">
                        <div className="font-bold text-center mb-2">⚠️ Registration Error</div>
                        <div className="text-center">{error}</div>
                        {error.toLowerCase().includes('rate limit') && (
                            <div className="mt-3 text-xs text-red-300/80 text-center border-t border-red-500/20 pt-3">
                                💡 <strong>Why?</strong> Too many verification emails sent recently.<br />
                                ⏱️ <strong>Solution:</strong> Please wait a minute before trying again.
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmitRegister)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-amber-300/90 mb-2 uppercase tracking-wide" style={{ fontFamily: 'serif' }}>Name</label>
                        <input
                            {...register('name')}
                            type="text"
                            className="w-full px-4 py-3 bg-gray-900/80 border-2 border-amber-600/30 rounded-lg text-amber-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all backdrop-blur-sm"
                            placeholder="Knight Name"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-amber-300/90 mb-2 uppercase tracking-wide" style={{ fontFamily: 'serif' }}>Email</label>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full px-4 py-3 bg-gray-900/80 border-2 border-amber-600/30 rounded-lg text-amber-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all backdrop-blur-sm"
                            placeholder="knight@medysa.com"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-amber-300/90 mb-2 uppercase tracking-wide" style={{ fontFamily: 'serif' }}>Password</label>
                        <input
                            {...register('password')}
                            type="password"
                            className="w-full px-4 py-3 bg-gray-900/80 border-2 border-amber-600/30 rounded-lg text-amber-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all backdrop-blur-sm"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold rounded-lg transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-green-500/50 uppercase tracking-wider border-2 border-green-400/30"
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        {isSubmitting ? '⚔️ Forging Account...' : '⚔️ Sign Up ⚔️'}
                    </button>


                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-amber-600/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-900/50 text-amber-400/70 backdrop-blur-sm">Already a knight?</span>
                    </div>
                </div>

                <p className="text-center text-sm">
                    <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium underline decoration-amber-600/30 hover:decoration-amber-400 transition-all">
                        Sign In to Arena →
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterForm />
        </Suspense>
    );
}
