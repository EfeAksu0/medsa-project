'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { BattlefieldBackground } from '@/components/ui/BattlefieldBackground';
import { Mail, Lock, ChevronRight, BookOpen, Brain, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const features = [
    { icon: BookOpen, title: 'Trade Journal', desc: 'Log every trade in seconds with full session context.' },
    { icon: Brain, title: 'AI Coach', desc: 'Get personalized insights and pattern recognition.' },
    { icon: ShieldCheck, title: 'Risk Sentinel', desc: 'Automatic alerts before tilt destroys your account.' },
];

export default function LoginPage() {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError('');
            const response = await api.post('/auth/login', {
                email: data.email,
                password: data.password,
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                login(response.data.token, response.data.user);
            } else {
                throw new Error('No token returned');
            }
        } catch (err: any) {
            const msg = err.response?.data?.error || err.message || 'Login failed';
            setError(msg === 'Invalid credentials' ? 'Invalid email or password' : msg);
        }
    };

    return (
        <div className="flex min-h-screen relative overflow-hidden">
            <BattlefieldBackground />

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/60 z-[1]" />

            <div className="relative z-10 flex w-full min-h-screen">

                {/* ── LEFT PANEL ── */}
                <div className="hidden lg:flex flex-col justify-between w-1/2 p-14 xl:p-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group w-fit">
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-amber-500/80 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                            <Image src="/logo.png" alt="Medysa" fill className="object-cover scale-[1.15]" />
                        </div>
                        <span className="text-2xl font-black tracking-widest text-amber-400 uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                            Medysa
                        </span>
                    </Link>

                    {/* Center content */}
                    <div className="space-y-10">
                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-widest uppercase">
                                ⚔️ The Trading Arena
                            </div>
                            <h1 className="text-5xl xl:text-6xl font-black leading-tight text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                                Master Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                                    Trading Mind
                                </span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
                                Journal every trade. Decode your psychology. Let AI become your edge.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-3">
                            {features.map(({ icon: Icon, title, desc }) => (
                                <div key={title} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm">
                                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/15 shrink-0">
                                        <Icon size={16} className="text-amber-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-white mb-0.5">{title}</div>
                                        <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-gray-500 text-xs italic font-serif mb-2">&quot;In the arena of life, let humility be your shield, kindness your sword, and love your greatest victory.&quot;</p>
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest">© 2026 Medysa Trading Journal. All rights reserved.</p>
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
                        {/* Card */}
                        <div
                            className="relative rounded-3xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(15,17,25,0.95) 0%, rgba(20,22,32,0.95) 100%)',
                                boxShadow: '0 0 0 1px rgba(251,191,36,0.15), 0 32px 80px rgba(0,0,0,0.6)',
                            }}
                        >
                            {/* Top glow */}
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

                            <div className="p-8 xl:p-10">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
                                        Welcome back
                                    </h2>
                                    <p className="text-gray-500 text-sm">Sign in to enter the arena</p>
                                </div>

                                {error && (
                                    <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm">
                                        <span className="mt-0.5 shrink-0">⚠️</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                            Email Address
                                        </label>
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
                                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                            Password
                                        </label>
                                        <div className="relative group">
                                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-400 transition-colors" />
                                            <input
                                                {...register('password')}
                                                type={showPassword ? 'text' : 'password'}
                                                className="w-full pl-11 pr-12 py-3.5 bg-white/4 border border-white/8 rounded-xl text-white placeholder-gray-600 focus:border-amber-500/50 focus:bg-white/6 outline-none transition-all text-sm"
                                                placeholder="••••••••"
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
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="relative w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
                                        style={{
                                            background: 'linear-gradient(135deg, #d97706, #f59e0b, #d97706)',
                                            backgroundSize: '200% 100%',
                                            color: '#0f0f0f',
                                            transition: 'background-position 0.4s ease, box-shadow 0.3s ease',
                                            boxShadow: '0 0 30px rgba(245,158,11,0.25)',
                                        }}
                                        onMouseEnter={e => {
                                            (e.target as HTMLButtonElement).style.backgroundPosition = '100% 0';
                                            (e.target as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(245,158,11,0.5)';
                                        }}
                                        onMouseLeave={e => {
                                            (e.target as HTMLButtonElement).style.backgroundPosition = '0% 0';
                                            (e.target as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(245,158,11,0.25)';
                                        }}
                                    >
                                        <span className="relative flex items-center justify-center gap-2">
                                            {isSubmitting ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                    Entering Arena...
                                                </>
                                            ) : (
                                                <>
                                                    ⚔️ Sign In
                                                    <ChevronRight size={16} />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </form>

                                {/* Divider */}
                                <div className="flex items-center gap-4 my-6">
                                    <div className="flex-1 h-px bg-white/6" />
                                    <span className="text-xs text-gray-600">New to the arena?</span>
                                    <div className="flex-1 h-px bg-white/6" />
                                </div>

                                <Link
                                    href="/register"
                                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-white/8 text-gray-300 hover:text-white hover:border-amber-500/30 hover:bg-white/4 transition-all text-sm font-medium"
                                >
                                    Join the Order
                                    <ChevronRight size={14} className="text-amber-400" />
                                </Link>
                            </div>

                            {/* Bottom glow */}
                            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
