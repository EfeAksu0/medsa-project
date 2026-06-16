'use client';

import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const isReturningFromStripe = typeof window !== 'undefined' &&
            window.location.search.includes('session_id=');

        if (!isLoading) {
            if (!user && !isReturningFromStripe) {
                router.push('/');
            } else if (user && !isReturningFromStripe) {
                const status = user.subscriptionStatus;
                if (status !== 'active' && status !== 'trialing') {
                    router.push('/upgrade');
                }
            }
        }
    }, [user, isLoading, router]);

    if (isLoading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">Loading...</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-950 text-white relative">
            {/* Premium Flawless CSS Mesh Gradient Overlay */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(147,51,234,0.15),transparent)]" />
            <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_80%_70%,rgba(56,189,248,0.08),transparent)]" />

            <div className="relative z-10 flex min-h-screen">
                <Sidebar />
                <main className="pl-64 p-8 w-full">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
