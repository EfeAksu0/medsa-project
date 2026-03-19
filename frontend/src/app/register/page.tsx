'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BattlefieldBackground } from '@/components/ui/BattlefieldBackground';
import { Mail, Lock, User, ChevronRight, Shield, Sparkles } from 'lucide-react';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const plans = {
    knight: {
        name: 'Knighthood',
        price: '$9.99',
        original: '$19.98',
        color: 'amber',
        icon: Shield,
        features: ['Unlimited Accounts', 'Vault System Access', 'Full Session Replays', 'Advanced Analytics'],
    },
    ai: {
        name: 'Medysa AI',
        price: '$14.99',
        original: '$29.98',
        color: 'purple',
        icon: Sparkles,
        features: ['Everything in Knighthood', 'Medysa AI Coach', 'Tilt Detection', 'Risk Sentinel'],
    },
};

function RegisterForm() {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan') as 'knight' | 'ai' | null;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmitRegister = async (data: RegisterFormData) => {
        try {
            const response = await api.post('/auth/register', {
                email: data.email,
                name: data.name,
                password: data.password,
                plan: plan || 'knight',
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                login(response.data.token, response.data.user, false);

                if (plan) {
                    try {
                        const paymentResponse = await api.post('/payments/create-checkout-session',
                            { planId: plan },
                            { headers: { 'Authorization': `Bearer ${response.data.token}` } }
                        );
                        if (paymentResponse.data.url) {
                            window.location.href = paymentResponse.data.url;
                            return;
                        }
                    } catch (paymentErr: any) {
                        setError(`Payment initialization failed: ${paymentErr.response?.data?.error || paymentErr.message}`);
                    }
                } else {
                    window.location.href = '/dashboard';
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Registration failed. Please try again.');
        }
    };

    // ── Plan selection screen ──
    if (!plan) {
        return (
            <div className="flex min-h-screen items-center justify-center relative overflow-hidden py-20">
                <BattlefieldBackground />
                <div className="absolute inset-0 bg-black/65 z-[1]" />

                <div className="relative z-10 container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-14">
                        <div className="inline-block mb-8">
                            <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-amber-500/80 shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                                <Image src="/logo.png" alt="Medysa" fill className="object-cover scale-[1.15]" />
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-5">
                            ⚔️ Choose Your Rank
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
                            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Weapon</span>
                        </h2>
                        <p className="text-gray-500 text-lg max-w-md mx-auto">
                            Before you enter the order, select your rank.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {/* Knighthood */}
                        <Link href="/register?plan=knight" className="group relative">
                            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-amber-500/30 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div
                                className="relative rounded-3xl p-8 h-full flex flex-col border border-white/8 group-hover:border-amber-500/30 transition-all duration-300"
                                style={{ background: 'rgba(15,17,25,0.95)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/15">
                                        <Shield size={20} className="text-amber-400" />
                                    </div>
                                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                                        50% OFF First Month
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-amber-400 mb-1" style={{ fontFamily: 'Cinzel, serif' }}>Knighthood</h3>
                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-4xl font-black text-white">$9.99</span>
                                    <span className="text-gray-600 line-through text-sm">$19.98</span>
                                    <span className="text-gray-600 text-sm">/mo</span>
                                </div>
                                <div className="space-y-3 mb-8 flex-1">
                                    {['Unlimited Accounts', 'Vault System Access', 'Full Session Replays', 'Advanced Analytics'].map((f) => (
                                        <div key={f} className="flex items-center gap-3 text-sm text-gray-400">
                                            <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-[10px] shrink-0">✓</div>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-gray-900 font-bold text-center text-sm uppercase tracking-widest group-hover:shadow-amber-500/30 group-hover:shadow-lg transition-all">
                                    Select Knighthood
                                </div>
                            </div>
                        </Link>

                        {/* Medysa AI */}
                        <Link href="/register?plan=ai" className="group relative">
                            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-purple-500/30 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div
                                className="relative rounded-3xl p-8 h-full flex flex-col border border-white/8 group-hover:border-purple-500/30 transition-all duration-300"
                                style={{ background: 'rgba(15,17,25,0.95)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/15">
                                        <Sparkles size={20} className="text-purple-400" />
                                    </div>
                                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                                        Recommended
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-1" style={{ fontFamily: 'Cinzel, serif' }}>Medysa AI</h3>
                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-4xl font-black text-white">$14.99</span>
                                    <span className="text-gray-600 line-through text-sm">$29.98</span>
                                    <span className="text-gray-600 text-sm">/mo</span>
                                </div>
                                <div className="space-y-3 mb-8 flex-1">
                                    {['Everything in Knighthood', 'Medysa AI Coach Access', 'Tilt Detection', 'Risk Sentinel'].map((f) => (
                                        <div key={f} className="flex items-center gap-3 text-sm text-gray-400">
                                            <div className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-[10px] shrink-0">✓</div>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-center text-sm uppercase tracking-widest group-hover:shadow-purple-500/30 group-hover:shadow-lg transition-all">
                                    Select Medysa AI
                                </div>
                            </div>
                        </Link>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-8">
                        Already a knight?{' '}
                        <Link href="/login" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                            Sign in →
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    const planInfo = plans[plan] || plans.knight;
    const isAI = plan === 'ai';

    return (
        <div className="flex min-h-screen relative overflow-hidden">
            <BattlefieldBackground />
            <div className="absolute inset-0 bg-black/60 z-[1]" />

            <div className="relative z-10 flex w-full min-h-screen">

                {/* ── LEFT PANEL ── */}
                <div className="hidden lg:flex flex-col justify-between w-1/2 p-14 xl:p-20">
                    <Link href="/" className="flex items-center gap-3 w-fit">
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-amber-500/80 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                            <Image src="/logo.png" alt="Medysa" fill className="object-cover scale-[1.15]" />
                        </div>
                        <span className="text-2xl font-black tracking-widest text-amber-400 uppercase" style={{ fontFamily: 'Cinzel, serif' }}>Medysa</span>
                    </Link>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase ${isAI ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'}`}>
                                {isAI ? '✨' : '⚔️'} {planInfo.name} Plan
                            </div>
                            <h1 className="text-5xl xl:text-6xl font-black leading-tight text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                                Join the <br />
                                <span className={`text-transparent bg-clip-text ${isAI ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gradient-to-r from-amber-400 to-yellow-300'}`}>
                                    Order
                                </span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
                                Create your account and start your journey to trading mastery.
                            </p>
                        </div>

                        {/* Plan Details */}
                        <div
                            className={`p-6 rounded-2xl border ${isAI ? 'border-purple-500/20 bg-purple-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}
                        >
                            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Your selected plan</p>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-3xl font-black text-white">{planInfo.price}</span>
                                <span className="text-gray-600 line-through">{planInfo.original}</span>
                                <span className="text-gray-600 text-sm">/mo</span>
                            </div>
                            <div className="space-y-2">
                                {planInfo.features.map((f) => (
                                    <div key={f} className="flex items-center gap-2 text-sm text-gray-400">
                                        <span className={isAI ? 'text-purple-400' : 'text-amber-400'}>✓</span> {f}
                                    </div>
                                ))}
                            </div>
                            <Link
                                href="/register"
                                className="mt-4 inline-flex text-xs text-gray-600 hover:text-white underline transition-colors"
                            >
                                Change plan →
                            </Link>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm">© 2025 Medysa. All rights reserved.</p>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="flex flex-col justify-center w-full lg:w-1/2 px-6 py-12 lg:px-16 xl:px-24">

                    {/* Mobile logo */}
                    <div className="flex justify-center mb-10 lg:hidden">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/80 shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                            <Image src="/logo.png" alt="Medysa" fill className="object-cover scale-[1.15]" />
                        </div>
                    </div>

                    <div className="w-full max-w-md mx-auto">
                        <div
                            className="relative rounded-3xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(15,17,25,0.95) 0%, rgba(20,22,32,0.95) 100%)',
                                boxShadow: `0 0 0 1px ${isAI ? 'rgba(168,85,247,0.15)' : 'rgba(251,191,36,0.15)'}, 0 32px 80px rgba(0,0,0,0.6)`,
                            }}
                        >
                            <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${isAI ? 'via-purple-500/50' : 'via-amber-500/50'} to-transparent`} />

                            <div className="p-8 xl:p-10">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
                                        Create Account
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        {isAI ? 'Unlock the full power of AI coaching' : 'Start your trading journal today'}
                                    </p>
                                </div>

                                {error && (
                                    <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm">
                                        <span className="mt-0.5 shrink-0">⚠️</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmitRegister)} className="space-y-4">
                                    {/* Name */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">Knight Name</label>
                                        <div className="relative group">
                                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-400 transition-colors" />
                                            <input
                                                {...register('name')}
                                                type="text"
                                                className="w-full pl-11 pr-4 py-3.5 bg-white/4 border border-white/8 rounded-xl text-white placeholder-gray-600 focus:border-amber-500/50 focus:bg-white/6 outline-none transition-all text-sm"
                                                placeholder="Your trading name"
                                            />
                                        </div>
                                        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">Email Address</label>
                                        <div className="relative group">
                                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-400 transition-colors" />
                                            <input
                                                {...register('email')}
                                                type="email"
                                                className="w-full pl-11 pr-4 py-3.5 bg-white/4 border border-white/8 rounded-xl text-white placeholder-gray-600 focus:border-amber-500/50 focus:bg-white/6 outline-none transition-all text-sm"
                                                placeholder="knight@medysa.com"
                                            />
                                        </div>
                                        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">Password</label>
                                        <div className="relative group">
                                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-400 transition-colors" />
                                            <input
                                                {...register('password')}
                                                type={showPassword ? 'text' : 'password'}
                                                className="w-full pl-11 pr-12 py-3.5 bg-white/4 border border-white/8 rounded-xl text-white placeholder-gray-600 focus:border-amber-500/50 focus:bg-white/6 outline-none transition-all text-sm"
                                                placeholder="Min. 6 characters"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors text-xs"
                                            >
                                                {showPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
                                    </div>

                                    {/* Submit */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="relative w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                                            style={{
                                                background: isAI
                                                    ? 'linear-gradient(135deg, #7c3aed, #a855f7, #7c3aed)'
                                                    : 'linear-gradient(135deg, #d97706, #f59e0b, #d97706)',
                                                backgroundSize: '200% 100%',
                                                color: isAI ? 'white' : '#0f0f0f',
                                                boxShadow: isAI
                                                    ? '0 0 30px rgba(168,85,247,0.25)'
                                                    : '0 0 30px rgba(245,158,11,0.25)',
                                            }}
                                        >
                                            <span className="relative flex items-center justify-center gap-2">
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin opacity-70" />
                                                        Forging Account...
                                                    </>
                                                ) : (
                                                    <>
                                                        {isAI ? '✨' : '⚔️'} Create Account
                                                        <ChevronRight size={16} />
                                                    </>
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                </form>

                                <div className="flex items-center gap-4 my-5">
                                    <div className="flex-1 h-px bg-white/6" />
                                    <span className="text-xs text-gray-600">Already a knight?</span>
                                    <div className="flex-1 h-px bg-white/6" />
                                </div>

                                <Link
                                    href="/login"
                                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-white/8 text-gray-300 hover:text-white hover:border-amber-500/30 hover:bg-white/4 transition-all text-sm font-medium"
                                >
                                    Sign in to Arena
                                    <ChevronRight size={14} className="text-amber-400" />
                                </Link>
                            </div>

                            <div className={`absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${isAI ? 'via-purple-500/20' : 'via-amber-500/20'} to-transparent`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050810]" />}>
            <RegisterForm />
        </Suspense>
    );
}
