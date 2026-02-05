'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { BattlefieldBackground } from '@/components/ui/BattlefieldBackground';
import { Shield, Sword } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login } = useAuth();
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError('');

            // Use Supabase authentication (same as register page)
            const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (signInError) throw signInError;

            if (authData.session) {
                // Store token and login user
                localStorage.setItem('token', authData.session.access_token);
                login(authData.session.access_token, authData.session.user as any);
            } else {
                throw new Error('No session returned');
            }
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error('Login error:', err);
            setError(err.message || 'Login failed');
        }
    };

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
                            ⚔️ Enter the Trading Arena ⚔️
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border-2 border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center backdrop-blur-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-gray-900 font-bold rounded-lg transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-amber-500/50 uppercase tracking-wider border-2 border-amber-400/30"
                        style={{ fontFamily: 'Cinzel, serif' }}
                    >
                        {isSubmitting ? '⚔️ Entering Arena...' : '⚔️ Sign In ⚔️'}
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-amber-600/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-900/50 text-amber-400/70 backdrop-blur-sm">New to the arena?</span>
                    </div>
                </div>

                <p className="text-center text-sm">
                    <Link href="/register" className="text-amber-400 hover:text-amber-300 font-medium underline decoration-amber-600/30 hover:decoration-amber-400 transition-all">
                        Join the Order →
                    </Link>
                </p>
            </div>
        </div>
    );
}
