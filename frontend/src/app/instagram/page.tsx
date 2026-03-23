"use client";
/* eslint-disable react-hooks/purity */
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shield, Zap, TrendingUp, Brain, Target, Flame } from 'lucide-react';
import Image from 'next/image';

export default function InstagramCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activePost, setActivePost] = useState(3); // Default to Post 4 (The Psychology Carousel)
    const totalSlides = activePost === 0 || activePost === 1 ? 6 : activePost === 2 ? 3 : 4; // Post 4 has 4 slides

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

    // Toggle between Post 1, 2, 3, and 4
    const togglePost = () => {
        setActivePost((prev) => (prev + 1) % 4);
        setCurrentSlide(0);
    };

    // Auto-advance for preview (optional, can remove)
    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [totalSlides]);

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center">
            {/* Instagram Post Container - 9:16 mobile aspect ratio */}
            <div className="relative w-[100vw] h-[100vh] md:w-[60vh] md:h-[calc(60vh*16/9)] bg-black overflow-hidden shadow-2xl border border-gray-800">

                {/* Navigation Arrows (Visible on Desktop) */}
                <button
                    onClick={prevSlide}
                    className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/80 text-white rounded-full items-center justify-center transition-all z-50 border border-gray-700"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/80 text-white rounded-full items-center justify-center transition-all z-50 border border-gray-700"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Hidden Toggle Button (Top Left Corner Tap) */}
                <div
                    onClick={togglePost}
                    className="absolute top-0 left-0 w-16 h-16 z-50 cursor-crosshair opacity-0 hover:opacity-10 bg-white/10"
                    title="Toggle Post Set"
                />

                {/* ========================================== */}
                {/* POST 1 SLIDES (Brand Identity) */}
                {/* ========================================== */}
                {activePost === 0 && (
                    <>
                        {/* Slide 1: The Hook */}
                        {currentSlide === 0 && (
                            <div className="h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=2070')] opacity-20 bg-cover bg-center mix-blend-overlay" />

                                <Shield className="w-24 h-24 text-amber-500 mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />

                                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter" style={{ fontFamily: 'Cinzel, serif' }}>
                                    STOP<br />
                                    <span className="text-amber-500">GAMBLING.</span>
                                </h1>

                                <p className="text-gray-400 text-xl md:text-2xl font-light tracking-widest uppercase">
                                    Start Commanding.
                                </p>

                                <div className="absolute bottom-12 animate-bounce">
                                    <div className="w-1 h-16 bg-gradient-to-b from-amber-500 to-transparent rounded-full opacity-50" />
                                </div>
                            </div>
                        )}

                        {/* Slide 2: The Problem */}
                        {currentSlide === 1 && (
                            <div className="h-full bg-black p-8 flex flex-col justify-center relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 to-transparent" />

                                <h2 className="text-3xl md:text-4xl font-bold text-gray-500 mb-12 uppercase tracking-widest">
                                    The Reality
                                </h2>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-6 opacity-50">
                                        <div className="w-12 h-12 rounded-full border border-red-900 flex items-center justify-center text-red-700 font-bold text-xl">X</div>
                                        <span className="text-gray-500 text-xl md:text-2xl line-through decoration-red-900">Emotional entries</span>
                                    </div>
                                    <div className="flex items-center gap-6 opacity-75">
                                        <div className="w-12 h-12 rounded-full border border-red-800 flex items-center justify-center text-red-600 font-bold text-xl">X</div>
                                        <span className="text-gray-400 text-xl md:text-2xl line-through decoration-red-800">Revenge trading</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-full border border-red-600 flex items-center justify-center text-red-500 font-bold text-xl">X</div>
                                        <span className="text-gray-300 text-xl md:text-2xl font-bold">Zero consistency</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Slide 3: The Solution (Detailed Feature 1) */}
                        {currentSlide === 2 && (
                            <div className="h-full bg-gradient-to-b from-gray-900 to-black p-8 pt-16 flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-20">
                                    <Brain className="w-32 h-32 text-amber-500" />
                                </div>

                                <h2 className="text-4xl md:text-5xl font-black text-white mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                                    AI PSYCHOLOGIST
                                </h2>
                                <div className="w-24 h-1 bg-amber-500 mb-8" />

                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border-l-4 border-amber-500 mb-8">
                                    <p className="text-amber-500 italic mb-4">&quot;You&apos;re chasing losses again. Taking a 15-minute break is recommended.&quot;</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span>Live Analysis</span>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-lg leading-relaxed">
                                    Real-time mental state monitoring. It detects tilt before you blow up your account.
                                </p>
                            </div>
                        )}

                        {/* Slide 4: The Validation (Detailed Feature 2) */}
                        {currentSlide === 3 && (
                            <div className="h-full bg-black flex flex-col relative">
                                <div className="h-1/2 bg-[url('https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2070')] bg-cover bg-center opacity-40" />
                                <div className="h-1/2 bg-black absolute bottom-0 w-full bg-gradient-to-t from-black via-black to-transparent" />

                                <div className="absolute bottom-0 w-full p-8 pb-16">
                                    <div className="flex items-center gap-4 mb-6">
                                        <Target className="w-12 h-12 text-amber-500" />
                                        <h2 className="text-3xl md:text-4xl font-bold text-white uppercase">War Room</h2>
                                    </div>

                                    <p className="text-gray-300 text-lg mb-8 border-l-2 border-gray-700 pl-6">
                                        Advanced analytics that act as your battlefield intelligence. Know your win rate, ideal hours, and worst mistakes.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-900 p-4 rounded-lg text-center border border-gray-800">
                                            <div className="text-2xl font-bold text-green-500">68%</div>
                                            <div className="text-xs text-gray-500 uppercase">Win Rate</div>
                                        </div>
                                        <div className="bg-gray-900 p-4 rounded-lg text-center border border-gray-800">
                                            <div className="text-2xl font-bold text-amber-500">2.4</div>
                                            <div className="text-xs text-gray-500 uppercase">Profit Factor</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Slide 5: Social Proof / Authority */}
                        {currentSlide === 4 && (
                            <div className="h-full bg-gray-900 p-8 flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute -right-24 -top-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />

                                <div className="space-y-6 relative z-10">
                                    <div className="bg-black/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-md">
                                        <div className="flex gap-1 text-amber-500 mb-3">
                                            {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                                        </div>
                                        <p className="text-gray-300 italic mb-4">&quot;It&apos;s like having a senior trader watching every move I make. My consistency has doubled in 30 days.&quot;</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-700 rounded-full" />
                                            <div>
                                                <div className="text-white font-bold">Alex M.</div>
                                                <div className="text-xs text-gray-500">Funded Trader</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-black rounded-3xl p-4 md:p-6 shadow-2xl mb-16 border border-amber-900/30">
                                        <Image
                                            src="/uploaded_image_4_1768708419574.png"
                                            alt="Knowledge Vault"
                                            width={1000}
                                            height={600}
                                            className="w-full h-auto rounded-2xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Slide 6: Call to Action */}
                        {currentSlide === 5 && (
                            <div className="h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black p-8 flex flex-col items-center justify-center text-center">
                                <Shield className="w-32 h-32 text-amber-500 mb-8" />

                                <h2 className="text-4xl md:text-6xl font-black text-white mb-8" style={{ fontFamily: 'Cinzel, serif' }}>
                                    JOIN THE<br />RANKS
                                </h2>

                                <p className="text-gray-400 mb-12 max-w-sm">
                                    The ultimate trading journal for those who take this seriously.
                                </p>

                                <div className="w-full max-w-xs bg-white text-black font-black py-4 px-8 rounded-full text-lg hover:scale-105 transition-transform cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                    GET EARLY ACCESS
                                </div>

                                <div className="absolute bottom-8 flex gap-3 opacity-50">
                                    <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                                    <Flame className="w-8 h-8 text-amber-500" />
                                    <Flame className="w-7 h-7 text-orange-600 animate-pulse" style={{ animationDelay: '0.3s' }} />
                                    <Flame className="w-8 h-8 text-amber-500" />
                                    <Flame className="w-6 h-6 text-orange-500 animate-pulse" style={{ animationDelay: '0.6s' }} />
                                </div>
                            </div>
                        )}
                    </>
                )}


                {/* ========================================== */}
                {/* POST 2 SLIDES (New Features) */}
                {/* ========================================== */}
                {activePost === 1 && (
                    <>
                        {/* Slide 1: Intro (REUSE from Post 1) */}
                        {currentSlide === 0 && (
                            <div className="min-h-full bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
                                {/* Fire particles */}
                                <div className="absolute inset-0">
                                    {[...Array(30)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-1 h-1 bg-amber-500 rounded-full opacity-60 animate-pulse"
                                            style={{
                                                top: `${Math.random() * 100}%`,
                                                left: `${Math.random() * 100}%`,
                                                animationDelay: `${Math.random() * 2}s`,
                                            }}
                                        />
                                    ))}
                                </div>

                                <Shield className="w-32 h-32 md:w-48 md:h-48 text-amber-500 mb-8 md:mb-12 drop-shadow-[0_0_50px_rgba(251,191,36,0.6)] z-10 animate-pulse" />
                                <h1 className="text-6xl md:text-9xl font-black text-amber-500 leading-none tracking-tighter mb-6 md:mb-8 z-10 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]" style={{ fontFamily: 'Cinzel, serif' }}>
                                    MEDYSA
                                </h1>

                                <div className="z-10 text-amber-500/80 font-bold text-xl md:text-3xl tracking-widest mb-8">
                                    (2/2)
                                </div>

                                <div className="absolute bottom-8 flex gap-3 opacity-50">
                                    <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                                    <Flame className="w-8 h-8 text-amber-500" />
                                    <Flame className="w-7 h-7 text-orange-600 animate-pulse" style={{ animationDelay: '0.3s' }} />
                                    <Flame className="w-8 h-8 text-amber-500" />
                                    <Flame className="w-6 h-6 text-orange-500 animate-pulse" style={{ animationDelay: '0.6s' }} />
                                </div>
                            </div>
                        )}

                        {/* Slide 2: Battle Command (Dashboard) */}
                        {currentSlide === 1 && (
                            <div className="h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black px-6 md:px-12 py-10 md:py-16 relative overflow-hidden flex flex-col">
                                {/* Background Particles */}
                                <div className="absolute inset-0 opacity-20">
                                    {[...Array(20)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-1 h-1 bg-amber-500 rounded-full animate-pulse"
                                            style={{
                                                top: `${Math.random() * 100}%`,
                                                left: `${Math.random() * 100}%`,
                                                animationDelay: `${Math.random() * 5}s`,
                                                opacity: Math.random() * 0.5 + 0.2
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 mb-4 shrink-0">
                                    <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                                        <span className="text-lg md:text-2xl">⚔️</span>
                                    </div>
                                </div>

                                <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2 shrink-0" style={{ fontFamily: 'Cinzel, serif' }}>
                                    Battle Command
                                </h2>
                                <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-transparent mb-4 rounded-full shrink-0" />

                                <p className="text-sm md:text-xl text-gray-300 mb-6 leading-relaxed shrink-0">
                                    Your central command. Track victories, defeats, and total battle power in real-time.
                                </p>

                                {/* Flexible Image Container - Clean, No Background */}
                                <div className="flex-1 relative min-h-0 w-full p-2 md:p-6">
                                    <div className="relative w-full h-full drop-shadow-[0_0_30px_rgba(251,191,36,0.2)]">
                                        <Image
                                            src="/post2_battle_command.png"
                                            alt="Battle Command"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Slide 3: The War Room (Analytics) */}
                        {currentSlide === 2 && (
                            <div className="h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black px-6 md:px-12 py-10 md:py-16 relative overflow-hidden flex flex-col">
                                {/* Background Particles */}
                                <div className="absolute inset-0 opacity-20">
                                    {[...Array(20)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-1 h-1 bg-amber-500 rounded-full animate-pulse"
                                            style={{
                                                top: `${Math.random() * 100}%`,
                                                left: `${Math.random() * 100}%`,
                                                animationDelay: `${Math.random() * 5}s`,
                                                opacity: Math.random() * 0.5 + 0.2
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 mb-4 shrink-0">
                                    <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                                        <span className="text-lg md:text-2xl">📈</span>
                                    </div>
                                </div>

                                <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2 shrink-0" style={{ fontFamily: 'Cinzel, serif' }}>
                                    The War Room
                                </h2>
                                <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-transparent mb-4 rounded-full shrink-0" />

                                <p className="text-sm md:text-xl text-gray-300 mb-6 leading-relaxed shrink-0">
                                    Know your numbers. Deep analytics and performance metrics that reveal your true edge.
                                </p>

                                {/* Flexible Image Container - Clean, No Background */}
                                <div className="flex-1 relative min-h-0 w-full p-2 md:p-6">
                                    <div className="relative w-full h-full drop-shadow-[0_0_30px_rgba(251,191,36,0.2)]">
                                        <Image
                                            src="/post2_dashboard_full.png"
                                            alt="The War Room"
                                            fill
                                            className="object-contain"
                                            style={{ objectFit: 'contain', objectPosition: 'center' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Slide 4: Protocol Enforcer (Rules) - Purple Theme */}
                        {currentSlide === 3 && (
                            <div className="h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-950/40 via-gray-950 to-black px-6 md:px-12 py-10 md:py-16 relative overflow-hidden flex flex-col">
                                {/* Purple Particles */}
                                <div className="absolute inset-0 opacity-30">
                                    {[...Array(25)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-1 h-1 bg-purple-500 rounded-full animate-pulse"
                                            style={{
                                                top: `${Math.random() * 100}%`,
                                                left: `${Math.random() * 100}%`,
                                                animationDelay: `${Math.random() * 5}s`,
                                                opacity: Math.random() * 0.5 + 0.3
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 mb-4 shrink-0">
                                    <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                        <span className="text-lg md:text-2xl">⚖️</span>
                                    </div>
                                </div>

                                <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2 shrink-0" style={{ fontFamily: 'Cinzel, serif' }}>
                                    Protocol Enforcer
                                </h2>
                                <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-transparent mb-4 rounded-full shrink-0" />

                                <p className="text-sm md:text-xl text-gray-300 mb-6 leading-relaxed shrink-0">
                                    Build discipline. Define your pre-trade rules and let the system hold you accountable.
                                </p>

                                {/* Flexible Image Container - Clean, No Background */}
                                <div className="flex-1 relative min-h-0 w-full p-2 md:p-6">
                                    <div className="relative w-full h-full drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                        <Image
                                            src="/post2_protocol.png"
                                            alt="Protocol Enforcer"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Slide 5: Forensic Unit (AI) - Purple Theme */}
                        {currentSlide === 4 && (
                            <div className="h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-950/40 via-gray-950 to-black px-6 md:px-12 py-10 md:py-16 relative overflow-hidden flex flex-col">
                                {/* Purple Particles */}
                                <div className="absolute inset-0 opacity-30">
                                    {[...Array(25)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-1 h-1 bg-purple-500 rounded-full animate-pulse"
                                            style={{
                                                top: `${Math.random() * 100}%`,
                                                left: `${Math.random() * 100}%`,
                                                animationDelay: `${Math.random() * 5}s`,
                                                // eslint-disable-next-line
                                                opacity: Math.random() * 0.5 + 0.3
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 mb-4 shrink-0">
                                    <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                        <span className="text-lg md:text-2xl">🔮</span>
                                    </div>
                                </div>

                                <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2 shrink-0" style={{ fontFamily: 'Cinzel, serif' }}>
                                    Forensic Unit
                                </h2>
                                <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-transparent mb-4 rounded-full shrink-0" />

                                <p className="text-sm md:text-xl text-gray-300 mb-6 leading-relaxed shrink-0">
                                    AI-powered trade analysis. Understand exactly why you won or lost every single battle.
                                </p>

                                {/* Flexible Image Container - Clean, No Background */}
                                <div className="flex-1 relative min-h-0 w-full p-2 md:p-6 overflow-hidden">
                                    <div className="relative w-full h-full drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                        <Image
                                            src="/post2_dashboard_full.png"
                                            alt="Forensic Unit"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Slide 6: Join the Waitlist */}
                        {currentSlide === 5 && (
                            <div className="min-h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black px-8 md:px-20 py-24 md:py-48 flex flex-col items-center justify-center text-center">
                                <Shield className="w-32 h-32 md:w-48 md:h-48 text-amber-500 mb-8 md:mb-12 drop-shadow-[0_0_50px_rgba(251,191,36,0.6)] animate-pulse" />

                                <h2 className="text-5xl md:text-8xl font-black text-amber-500 mb-8 md:mb-12" style={{ fontFamily: 'Cinzel, serif' }}>
                                    JOIN THE RANKS
                                </h2>

                                <p className="text-xl md:text-4xl text-gray-300 mb-12 md:mb-16 leading-relaxed max-w-2xl">
                                    The battlefield is opening soon. Secure your place in the beta and claim your glory.
                                </p>

                                <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-12 md:px-20 py-6 md:py-8 rounded-full text-2xl md:text-4xl font-bold shadow-[0_0_40px_rgba(251,191,36,0.4)] animate-bounce">
                                    Link in Bio
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ========================================== */}
                {/* POST 3 SLIDES (The Closer / Checklist) */}
                {/* ========================================== */}
                {activePost === 2 && (
                    <>
                        {/* Slide 1: The Hook/Checklist */}
                        {currentSlide === 0 && (
                            <div className="h-full bg-black flex flex-col items-center justify-center p-8 py-32 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black" />

                                <div className="scale-90 origin-center flex flex-col items-center">
                                    <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-8 relative z-10 leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                                        THE ONLY TOOL<br /><span className="text-amber-500">YOU NEED.</span>
                                    </h2>

                                    <div className="space-y-4 w-full max-w-xs relative z-10">
                                        {[
                                            'BATTLE COMMAND',
                                            'AI PSYCHOLOGIST',
                                            'TRADE JOURNAL',
                                            'DEEP ANALYTICS'
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800" style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s backwards` }}>
                                                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)] shrink-0">
                                                    <div className="text-green-500 font-black text-xs">✓</div>
                                                </div>
                                                <span className="font-bold text-gray-200 text-sm">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Slide 2: The Problem (Stop Subscribing) */}
                        {currentSlide === 1 && (
                            <div className="h-full bg-black flex flex-col items-center justify-center p-8 py-32 relative">
                                <div className="scale-90 origin-center flex flex-col items-center">
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-400 text-center mb-8 leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                                        STOP SUBSCRIBING TO<br /><span className="text-red-500 line-through decoration-red-500/50 decoration-4">5 DIFFERENT APPS</span>
                                    </h3>

                                    <div className="space-y-3 w-full max-w-xs opacity-50 mb-8 grayscale text-sm">
                                        <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 flex justify-between">
                                            <span>Journal App</span>
                                            <span className="line-through text-gray-600">$49/mo</span>
                                        </div>
                                        <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 flex justify-between">
                                            <span>Analytics Tool</span>
                                            <span className="line-through text-gray-600">$29/mo</span>
                                        </div>
                                        <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 flex justify-between">
                                            <span>Replay Sim</span>
                                            <span className="line-through text-gray-600">$39/mo</span>
                                        </div>
                                    </div>

                                    <div className="text-white text-4xl font-black text-center mb-2 animate-bounce">
                                        ❌
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Slide 3: The Solution (One Price) */}
                        {currentSlide === 2 && (
                            <div className="h-full bg-black flex flex-col items-center justify-center p-8 py-32 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-600/30 via-black to-black" />

                                <div className="scale-90 origin-center flex flex-col items-center">
                                    <Shield className="w-32 h-32 text-amber-500 mb-6 drop-shadow-[0_0_40px_rgba(251,191,36,0.5)] animate-pulse relative z-10" />

                                    <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-4 relative z-10" style={{ fontFamily: 'Cinzel, serif' }}>
                                        ONE PRICE.<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-400 to-amber-700">INFINITE POWER.</span>
                                    </h2>

                                    <p className="text-gray-400 text-center max-w-xs text-sm mb-8 relative z-10">
                                        The entire arsenal. One monthly sub.
                                    </p>

                                    <div className="relative z-10 px-6 py-3 bg-white text-black font-black text-lg rounded-full tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                        LINK IN BIO
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ========================================== */}
                {/* POST 4 SLIDES (Psychology Series) */}
                {/* ========================================== */}
                {activePost === 3 && (
                    <>
                        {/* Slide 1: Title Hook */}
                        {currentSlide === 0 && (
                            <div className="h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 to-black p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                {/* Medysa Header */}
                                <div className="absolute top-12 flex flex-col items-center opacity-80">
                                    <Shield className="w-8 h-8 text-amber-500 mb-2 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                                    <span className="text-white font-bold tracking-[0.2em] text-sm" style={{ fontFamily: 'Cinzel, serif' }}>MEDYSA</span>
                                </div>

                                <h1 className="text-5xl md:text-7xl font-black mb-6 mt-16 leading-[1.1]" style={{ fontFamily: 'Cinzel, serif' }}>
                                    <span className="text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">TRADING BREAKS</span><br />
                                    <span className="text-white">MOST PEOPLE.</span>
                                </h1>

                                <div className="w-16 h-1 bg-amber-500 my-8 rounded-full" />

                                <p className="text-gray-400 text-2xl md:text-3xl font-light mb-16">
                                    Here&apos;s why<br />(and how to fix it)
                                </p>

                                <div className="text-amber-500/80 font-medium tracking-widest text-lg animate-pulse">
                                    Swipe --&gt;
                                </div>

                                {/* Paginator Dots */}
                                <div className="absolute bottom-8 flex gap-2">
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-amber-500' : 'bg-gray-700'}`} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Slide 2: The Core Problem */}
                        {currentSlide === 1 && (
                            <div className="h-full bg-black p-8 px-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                {/* Medysa Header */}
                                <div className="absolute top-12 flex flex-col items-center opacity-80">
                                    <Shield className="w-6 h-6 text-amber-500 mb-1" />
                                    <span className="text-white font-bold tracking-[0.2em] text-xs" style={{ fontFamily: 'Cinzel, serif' }}>MEDYSA</span>
                                </div>

                                <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                                    It&apos;s not the losses.<br />
                                    It&apos;s not the blown accounts.
                                </h2>

                                <div className="w-16 h-1 bg-amber-500 my-4 rounded-full" />

                                <p className="text-gray-300 text-2xl md:text-3xl leading-relaxed mt-6 max-w-xl">
                                    It&apos;s that the market exposes every psychological weakness you didn&apos;t know you had.
                                </p>

                                {/* Paginator Dots */}
                                <div className="absolute bottom-8 flex gap-2">
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-amber-500' : 'bg-gray-700'}`} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Slide 3: The Four Horsemen */}
                        {currentSlide === 2 && (
                            <div className="h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gray-900 to-black p-8 flex flex-col items-center justify-center relative overflow-hidden">
                                {/* Medysa Header */}
                                <div className="absolute top-8 flex flex-col items-center opacity-80">
                                    <Shield className="w-6 h-6 text-amber-500 mb-1" />
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black text-amber-500 mb-12 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                                    SOUND FAMILIAR?
                                </h2>

                                <div className="w-full max-w-lg space-y-4">
                                    {/* Item 1 */}
                                    <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl flex items-start gap-4">
                                        <div className="w-4 h-4 rounded-full bg-red-500 mt-1 shadow-[0_0_10px_rgba(239,68,68,0.5)] shrink-0" />
                                        <div>
                                            <h3 className="text-2xl font-black text-white mb-1 tracking-wide">FEAR</h3>
                                            <p className="text-gray-400 text-lg leading-snug">Selling winners too early,<br />holding losers too long</p>
                                        </div>
                                    </div>
                                    {/* Item 2 */}
                                    <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl flex items-start gap-4">
                                        <div className="w-4 h-4 rounded-full bg-amber-500 mt-1 shadow-[0_0_10px_rgba(245,158,11,0.5)] shrink-0" />
                                        <div>
                                            <h3 className="text-2xl font-black text-white mb-1 tracking-wide">EGO</h3>
                                            <p className="text-gray-400 text-lg leading-snug">Doubling down because<br />admitting a mistake feels like failure</p>
                                        </div>
                                    </div>
                                    {/* Item 3 */}
                                    <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl flex items-start gap-4">
                                        <div className="w-4 h-4 rounded-full bg-orange-500 mt-1 shadow-[0_0_10px_rgba(249,115,22,0.5)] shrink-0" />
                                        <div>
                                            <h3 className="text-2xl font-black text-white mb-1 tracking-wide">IMPULSE</h3>
                                            <p className="text-gray-400 text-lg leading-snug">Chasing pumps,<br />revenge trading after losses</p>
                                        </div>
                                    </div>
                                    {/* Item 4 */}
                                    <div className="bg-gray-900/80 border border-gray-800 p-6 rounded-2xl flex items-start gap-4">
                                        <div className="w-4 h-4 rounded-full bg-purple-500 mt-1 shadow-[0_0_10px_rgba(168,85,247,0.5)] shrink-0" />
                                        <div>
                                            <h3 className="text-2xl font-black text-white mb-1 tracking-wide">IMPATIENCE</h3>
                                            <p className="text-gray-400 text-lg leading-snug">Entering before<br />the setup fully develops</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Paginator Dots */}
                                <div className="absolute bottom-8 flex gap-2">
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-amber-500' : 'bg-gray-700'}`} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Slide 4: The Solution / Conclusion */}
                        {currentSlide === 3 && (
                            <div className="h-full bg-black p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                {/* Medysa Header */}
                                <div className="absolute top-12 flex flex-col items-center opacity-80">
                                    <Shield className="w-6 h-6 text-amber-500 mb-1" />
                                    <span className="text-white font-bold tracking-[0.2em] text-xs" style={{ fontFamily: 'Cinzel, serif' }}>MEDYSA</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black text-amber-500 mb-4 tracking-wider uppercase">
                                    The Cheat Code<br />Everyone Ignores:
                                </h2>

                                <h1 className="text-5xl md:text-7xl font-black text-white mb-12 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                    Cut. Your. Losses.
                                </h1>

                                <div className="w-16 h-1 bg-amber-500 my-4 rounded-full" />

                                <p className="text-gray-300 text-2xl leading-relaxed mt-6">
                                    Every trader knows this.<br />
                                    Almost nobody actually does it.
                                </p>

                                <p className="text-gray-500 text-lg mt-12 mb-8 italic">
                                    Use Medysa to enforce your rules.
                                </p>

                                {/* Paginator Dots */}
                                <div className="absolute bottom-8 flex gap-2">
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className={`w-2 h-2 rounded-full ${i === 3 ? 'bg-amber-500' : 'bg-gray-700'}`} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Invisible tap zones for navigation */}
                <div
                    onClick={prevSlide}
                    className="fixed left-0 top-0 bottom-0 w-1/3 z-40 cursor-pointer"
                />
                <div
                    onClick={nextSlide}
                    className="fixed right-0 top-0 bottom-0 w-1/3 z-40 cursor-pointer"
                />
            </div>
        </div>
    );
}
