'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, List, PieChart, Settings, LogOut, Wallet, Brain, Lock, Scroll, BookOpen, Sparkles, Film, ClipboardList } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ConfirmationModal } from './modals/ConfirmationModal';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, locked: false },
    { href: '/accounts', label: 'Accounts', icon: Wallet, locked: false },
    { href: '/models', label: 'Models', icon: Brain, locked: false },
    { href: '/trades', label: 'Trades', icon: List, locked: false },
    { href: '/vault/notes', label: 'Journal', icon: BookOpen, locked: false },
    { href: '/tasks', label: 'Protocol', icon: ClipboardList, locked: false },
    { href: '/ai-coach', label: 'AI Coach', icon: Sparkles, locked: false, special: true },
    { href: '/vault', label: 'Vault', icon: Scroll, locked: false },
    { href: '/settings', label: 'Settings', icon: Settings, locked: false },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

    // Dynamic nav items based on tier
    const dynamicNavItems = navItems.map(item => {
        if (item.href === '/ai-coach' && user?.tier === 'KNIGHT') {
            return { ...item, locked: true };
        }
        return item;
    });

    // Tribute Easter Egg
    useEffect(() => {
        console.log(
            "%c Dedicated to the memory of your father. \n His vision lives on through your code. \n ⚔️ Medysa ⚔️ ",
            "color: #d8b4fe; font-size: 12px; font-weight: bold; background: #1a103d; padding: 12px; border: 1px solid #7e22ce; border-radius: 4px;"
        );
    }, []);

    const handleNavClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
        if (item.locked) {
            e.preventDefault();
            router.push('/upgrade');
        }
    };

    const handleSignOut = () => {
        setIsSignOutModalOpen(true);
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800 flex flex-col items-center text-center">
                <p className="text-sm text-white italic drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">Master Your Trades, Own Your Future</p>
            </div>

            <nav className="flex-1 p-4 space-y-2 relative z-20">
                {dynamicNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium relative",
                                isActive
                                    ? item.special
                                        ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                                        : "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                    : item.locked
                                        ? "text-gray-500 hover:bg-white/5 cursor-pointer"
                                        : item.special
                                            ? "text-purple-300 hover:bg-purple-600/10"
                                            : "text-white hover:bg-white/10"
                            )}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                            {item.locked && (
                                <Lock size={16} className="ml-auto text-amber-500" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800 relative z-20">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>

            {/* Medysa Background & Tribute */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gray-900/80 z-10" /> {/* Slightly lighter overlay */}
                <Image
                    src="/medusa-bg.png"
                    alt="Medysa Background"
                    fill
                    className="object-cover opacity-60"
                />
                <div className="absolute bottom-20 left-4 right-4 z-20 block group">
                    <p className="text-xs text-center text-gray-300 italic font-serif leading-relaxed opacity-90 drop-shadow-md group-hover:opacity-0 transition-opacity duration-500">
                        &quot;Life is 10% what happens to us and 90% how we react to it.&quot;
                    </p>
                    {/* Hidden Tribute Reveal on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs font-serif text-purple-300 tracking-widest uppercase">In Loving Memory</span>
                            <div className="w-8 h-[1px] bg-purple-500/50" />
                            <span className="text-[10px] text-gray-400 font-light">The Vision Lives On</span>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isSignOutModalOpen}
                onClose={() => setIsSignOutModalOpen(false)}
                onConfirm={logout}
                title="Sign Out"
                message="Are you sure? You will be returned to the main page."
                confirmText="Sign Out"
                variant="danger"
            />
        </aside>
    );
}
