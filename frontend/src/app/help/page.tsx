'use client';

import Link from 'next/link';
import { ArrowLeft, Book, Shield, Swords, Scroll, Trophy, Zap, Lock, HelpCircle } from 'lucide-react';

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-[#050810] text-gray-100 selection:bg-amber-500/30">

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/5 py-4">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 hover:text-amber-500 transition-colors text-sm font-medium uppercase tracking-widest">
                        <ArrowLeft size={16} /> Back to Battlefield
                    </Link>
                    <div className="flex items-center gap-2">
                        <HelpCircle size={18} className="text-amber-500" />
                        <span className="font-bold tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>Battlefield Manual</span>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-32 pb-20">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">
                            Medysa Command
                        </span> Manual
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Everything you need to know to dominate the markets. Learn how to use the Vaults, organize your Trades, and leverage Premium analytics.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {/* Sidebar Navigation (Sticky) */}
                    <div className="md:col-span-1">
                        <div className="sticky top-32 space-y-2 p-6 rounded-2xl bg-gray-900/50 border border-white/5">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Contents</h3>
                            <a href="#getting-started" className="block text-gray-300 hover:text-amber-500 transition-colors py-2 border-b border-white/5">Getting Started</a>
                            <a href="#vault-system" className="block text-gray-300 hover:text-amber-500 transition-colors py-2 border-b border-white/5">The Vault System</a>
                            <a href="#journals" className="block text-gray-300 hover:text-amber-500 transition-colors py-2 border-b border-white/5">Scribe&apos;s Log (Journals)</a>
                            <a href="#trades" className="block text-gray-300 hover:text-amber-500 transition-colors py-2 border-b border-white/5">Trades & Metrics</a>
                            <a href="#premium" className="block text-amber-400 hover:text-amber-300 transition-colors py-2 font-medium">Premium Features</a>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-2 space-y-16">

                        {/* Getting Started */}
                        <section id="getting-started" className="scroll-mt-32">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                                    <Shield size={24} />
                                </div>
                                <h2 className="text-3xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>Getting Started</h2>
                            </div>
                            <div className="prose prose-invert max-w-none text-gray-400">
                                <p>
                                    Welcome to <strong>Medysa</strong>. Your journey begins by registering your account and choosing your Knight Name.
                                    This name represents you on the battlefield and in the community rankings.
                                </p>
                                <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                                    <li><strong>Dashboard:</strong> Your central command center showing Win Rate, PnL, and Equity Curve.</li>
                                    <li><strong>Navigation:</strong> Use the sidebar to access Trades, Analytics, and the Vault.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Vault System */}
                        <section id="vault-system" className="scroll-mt-32">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500">
                                    <Lock size={24} />
                                </div>
                                <h2 className="text-3xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>The Vault System</h2>
                            </div>
                            <div className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-xl mb-6">
                                <h4 className="flex items-center gap-2 font-bold text-amber-500 mb-2">
                                    <Zap size={16} /> Power Feature
                                </h4>
                                <p className="text-amber-200/80 text-sm">
                                    The Vault allows you to exclude specific folders from your main statistics.
                                    Perfect for &quot;Paper Trading&quot;, &quot;Testing Strategies&quot;, or burying bad months.
                                </p>
                            </div>
                            <div className="space-y-6 text-gray-400">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-200 mb-2">How it works</h3>
                                    <p>
                                        When you create a folder in the Trades or Journal section, it behaves normally by default.
                                        However, you can toggle the <strong>&quot;Vaulted&quot;</strong> status on any folder.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-200 mb-2">The Effect</h3>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Trades inside a Vaulted folder <strong>DO NOT</strong> count towards your Win Rate.</li>
                                        <li>They are excluded from your Total PnL and Equity Curve.</li>
                                        <li>They remain visible in the folder for your review and analysis.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Journals */}
                        <section id="journals" className="scroll-mt-32">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <Scroll size={24} />
                                </div>
                                <h2 className="text-3xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>Scribe&apos;s Log</h2>
                            </div>
                            <div className="prose prose-invert max-w-none text-gray-400">
                                <p>
                                    A warrior who does not reflect is doomed to repeat their mistakes. The Scribe&apos;s Log is your daily trading journal.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                    <div className="bg-gray-900 border border-white/5 p-4 rounded-lg">
                                        <h4 className="font-bold text-white mb-2">Daily Entries</h4>
                                        <p className="text-sm">Record your pre-market thoughts, mid-session emotions, and post-market reviews.</p>
                                    </div>
                                    <div className="bg-gray-900 border border-white/5 p-4 rounded-lg">
                                        <h4 className="font-bold text-white mb-2">Mood Tracking</h4>
                                        <p className="text-sm">Tag your entries with emotions (Confident, Anxious, Greedy) to spot psychological patterns.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Trades */}
                        <section id="trades" className="scroll-mt-32">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
                                    <Swords size={24} />
                                </div>
                                <h2 className="text-3xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>Trades & Metrics</h2>
                            </div>
                            <div className="prose prose-invert max-w-none text-gray-400">
                                <p>
                                    Import your trades or log them manually. Group them into folders (e.g., &quot;January 2026&quot;, &quot;Scalping Strategy&quot;).
                                </p>
                                <p className="mt-4">
                                    Use the <strong>Drag & Drop</strong> interface to move trades between folders instantly.
                                    Remember, if you drag a trade into a <strong>Vaulted Folder</strong>, it will disappear from your main dashboard stats!
                                </p>
                            </div>
                        </section>

                        {/* Premium */}
                        <section id="premium" className="scroll-mt-32">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
                                    <Trophy size={24} />
                                </div>
                                <h2 className="text-3xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>Premium Features</h2>
                            </div>
                            <div className="bg-gradient-to-br from-amber-900/20 to-purple-900/20 border border-amber-500/30 p-8 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Trophy size={120} />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">The Elite Squire Plan</h3>
                                <p className="text-gray-300 mb-6">
                                    Unlock the full potential of Medysa for just <strong>$14.99/mo</strong>.
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        "Unlimited Account Connections",
                                        "Unlimited Vault Folders",
                                        "Advanced Analytics & Heatmaps",
                                        "Session Replay Mode",
                                        "Priority Support via Discord"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                                            <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                                                <Zap size={10} />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8">
                                    <Link href="/register" className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-gray-900 font-bold rounded-xl hover:scale-105 transition-transform">
                                        Upgrade Now
                                    </Link>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-10 border-t border-white/5 bg-black/40 text-center text-gray-600 text-sm">
                <p>© 2026 Medysa Trading Journal. All rights reserved.</p>
            </footer>

        </div>
    );
}
