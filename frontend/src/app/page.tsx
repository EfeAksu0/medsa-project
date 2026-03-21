'use client';

import { useEffect, useState } from 'react';
import { Users, TrendingUp, ShieldCheck, Shield, Sword, Trophy, Zap, Scroll, Swords, Check, ArrowRight, ShieldAlert, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BattlefieldBackground } from '@/components/ui/BattlefieldBackground';
import { DemoSlideshow } from '@/components/DemoSlideshow';
import { UrgencyBanner } from '@/components/ui/UrgencyBanner';
import { LiveActivityFeed } from '@/components/ui/LiveActivityFeed';
import { SocialProofSection } from '@/components/ui/SocialProofSection';
import { TransformationSection } from '@/components/ui/TransformationSection';
import { FAQSection } from '@/components/ui/FAQSection';
import { TestimonialWall } from '@/components/ui/TestimonialWall';
import { StickyFomoBar } from '@/components/ui/StickyFomoBar';
import { AiRecapDemo } from '@/components/ui/AiRecapDemo';
import { ComparisonSection } from '@/components/ui/ComparisonSection';

import { OnboardingTour } from '@/components/onboarding/OnboardingTour';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050810] text-gray-100 selection:bg-amber-500/30">
      <div className="fixed top-0 w-full z-[60]">
        <UrgencyBanner />
      </div>
      <BattlefieldBackground />

      {/* Navbar */}
      <nav className={`fixed top-12 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/80 backdrop-blur-md border-b border-amber-600/20 py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-500/80 shadow-[0_0_10px_rgba(251,191,36,0.3)] shrink-0 bg-black/50">
              <Image src="/logo.png" alt="Medysa Logo" fill className="object-cover scale-[1.15]" />
            </div>
            <span className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600" style={{ fontFamily: 'Cinzel, serif' }}>
              MEDYSA
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-amber-100/70">
            <Link href="#why-us" className="hover:text-amber-400 transition-colors">WHY US</Link>
            <Link href="#features" className="hover:text-amber-400 transition-colors">Features</Link>
            <Link href="#autopsy" className="hover:text-red-500 transition-colors text-red-500/80">AUTOPSY</Link>
            <Link href="#ai" className="hover:text-amber-400 transition-colors">MEDYSA ALGO AI</Link>
            <Link href="#testimonials" className="hover:text-amber-400 transition-colors">Reviews</Link>
            <Link href="#pricing" className="hover:text-amber-400 transition-colors">Pricing</Link>
            <Link href="#faq" className="hover:text-amber-400 transition-colors">FAQ</Link>
            <button onClick={() => setShowTour(true)} className="hover:text-amber-400 transition-colors text-amber-500 font-bold">GUIDE</button>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-all uppercase tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
              Login
            </Link>
            <Link href="/register" className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-gray-900 font-bold rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(251,191,36,0.4)] hover:shadow-amber-500/60 uppercase tracking-widest text-xs" style={{ fontFamily: 'Cinzel, serif' }}>
              Start Journey
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-[0.2em] mb-8 animate-fade-in">
            <Trophy size={14} /> New Season: 2026 Rankings Open
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight" style={{ fontFamily: 'Cinzel, serif' }}>
            <span className="text-white">Stop Bleeding </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 via-amber-500 to-yellow-700 drop-shadow-[0_0_25px_rgba(251,191,36,0.3)]">
              Capital
            </span>
            <br />
            <span className="text-white">Claim Your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 via-amber-500 to-yellow-700 drop-shadow-[0_0_25px_rgba(251,191,36,0.3)]">
              Edge
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-8 font-medium leading-relaxed">
            Stop guessing on the battlefield. 95% of traders fail because they lack the data. Medysa provides the elite statistical arsenal you need to refine your edge and conquer the markets.
          </p>

          <div className="flex justify-center mb-12">
            <LiveActivityFeed />
          </div>

          {/* Video Trailer */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative group cursor-pointer rounded-2xl overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-amber-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative">
                <DemoSlideshow />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in [animation-delay:600ms]">
            <Link href="/register" className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-gray-900 font-black rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:scale-105 uppercase tracking-widest flex items-center justify-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
              Join the Order <ArrowRight size={20} />
            </Link>
            <button
              onClick={() => setShowTour(true)}
              className="w-full sm:w-auto px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 text-gray-200 font-bold rounded-xl transition-all duration-300 backdrop-blur-sm uppercase tracking-widest flex items-center justify-center gap-2 group"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Take a Tour <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Tour Overlay */}
          <OnboardingTour isOpen={showTour} onClose={() => setShowTour(false)} />

          {/* Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gray-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
              <div className="bg-gray-800/50 px-4 py-2 border-b border-white/5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/30"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/30"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/30"></div>
                </div>
                <div className="mx-auto text-[10px] text-gray-500 tracking-[0.3em] uppercase">Command Center - v2.5.0 (Vault Update)</div>
              </div>
              <Image
                src="/dashboard-preview-v3.png"
                alt="Medysa Battle Command Dashboard"
                width={1200}
                height={675}
                quality={100}
                priority
                className="w-full h-auto shadow-2xl rounded-lg border border-white/5"
              />
            </div>
          </div>
        </div>

        <div className="mt-24">
          <SocialProofSection />
        </div>
      </section>

      {/* Transformation Section */}
      <section className="bg-black/40">
        <TransformationSection />
      </section>

      {/* Comparison Section */}
      <ComparisonSection />

      {/* AI Trade Recap Autopsy */}
      <AiRecapDemo />

      {/* Social Proof Wall */}
      <TestimonialWall />

      {/* Features Bento Grid */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 italic" style={{ fontFamily: 'Cinzel, serif' }}>
              Forged for <span className="text-amber-500">Excellence</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Equip yourself with the tools used by successful warriors of the market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Large Feature */}
            <div className="md:col-span-2 md:row-span-2 relative group rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-8 overflow-hidden hover:border-amber-500/30 transition-all duration-500">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Swords size={180} className="text-amber-500" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 mb-6 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Zap size={24} />
                </div>
                <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Cinzel, serif' }}>Metrics & Vault System</h3>
                <p className="text-gray-400 max-w-sm leading-relaxed">
                  Deep stats meet privacy. Organize your trades into <strong>Folders</strong> and use our new <strong>Vault System</strong> to exclude specific folders from your main performance stats.
                </p>
              </div>
            </div>

            {/* Square Feature 1 */}
            <div className="relative group rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-8 overflow-hidden hover:border-amber-500/30 transition-all duration-500">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Cinzel, serif' }}>Drag & Drop Command</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Full tactical control. Drag and drop trades and journals into folders instantly to organize your battlefield.
              </p>
            </div>

            {/* Square Feature 2 */}
            <div className="relative group rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-8 overflow-hidden hover:border-amber-500/30 transition-all duration-500">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
                <Scroll size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Cinzel, serif' }}>Strategy Vault</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Build and store your trading playbooks. Test them against the arena.
              </p>
            </div>

            {/* Horizontal Feature */}
            <div className="md:col-span-3 h-[200px] relative group rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 p-8 overflow-hidden hover:border-amber-500/30 transition-all duration-500 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2 uppercase tracking-wide" style={{ fontFamily: 'Cinzel, serif' }}>Ready to climb the rankings?</h3>
                <p className="text-gray-400">Join 1,000+ warriors journals in Medysa.</p>
              </div>
              <Link href="/register" className="px-8 py-3 bg-white text-gray-900 font-bold rounded-xl transition-all hover:bg-gray-200 uppercase text-sm tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>
                Fast Track Entry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mental AI Section */}
      <section id="ai" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050810] via-purple-900/10 to-[#050810]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-[0.2em]">
                <Zap size={14} /> Live Now
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                Your Personal Trading <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Psychologist</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Harness the power of <strong>Medysa AI Coach</strong>. Our advanced AI analyzes your journals, trades, and performance patterns in real-time, detecting emotional pitfalls like Tilt and FOMO before they sabotage your account.
              </p>
              <ul className="space-y-4">
                {[
                  "Tilt Detection & Intervention",
                  "Post-Session Mental Debrief",
                  "Emotional Pattern Recognition",
                  "Real-Time Coaching Support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-300">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                      <Swords size={20} />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="#pricing" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-purple-500/30 text-purple-200 font-bold rounded-xl transition-all uppercase tracking-widest text-sm inline-block">
                Get Access
              </Link>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 bg-gray-900 border border-purple-500/30 rounded-2xl p-2 shadow-2xl shadow-purple-900/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent rounded-2xl pointer-events-none"></div>
                <div className="bg-[#050810] rounded-xl overflow-hidden aspect-video flex items-center justify-center relative">
                  {/* Placeholder for AI Visualization */}
                  <div className="absolute inset-0 opacity-50">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-center z-10">
                    <div className="text-5xl font-black text-white/10 mb-2">AI</div>
                    <div className="text-purple-500 font-mono text-xs tracking-[0.5em] animate-pulse">PROCESSING DATA...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative overflow-hidden bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 italic" style={{ fontFamily: 'Cinzel, serif' }}>
              Invest in your <span className="text-amber-500">Success</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Choose your weapon. Dominate the arena.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">

            {/* Tier 1: Knighthood (Standard) */}
            <div className="relative group transform hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute -inset-1 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-gray-900 backdrop-blur-xl rounded-3xl border border-yellow-500/50 p-8 shadow-2xl overflow-hidden h-full flex flex-col">

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

                <Link href="/register?plan=knight" className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-gray-900 font-black rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 text-center uppercase tracking-widest text-sm mb-3 group/btn flex items-center justify-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
                  Join the Order <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <p className="text-[10px] text-center text-gray-500 mb-2">Then $19.98/mo after first month</p>



                <div className="space-y-5 flex-grow">
                  {[
                    'Unknown Limits (Unlimited Accounts)',
                    'Vault System Access',
                    'Full Session Replays',
                    'Unlimited Data Retention',
                    'Priority Support',
                    'Advanced Analytics'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 flex-shrink-0">
                        <Check size={12} />
                      </div>
                      <span className="text-gray-200 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tier 2: Medysa AI (Ultimate) */}
            <div className="relative group transform hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute -inset-1 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative bg-gray-900 backdrop-blur-xl rounded-3xl border border-purple-500/50 p-8 shadow-2xl overflow-hidden h-full flex flex-col">
                <div className="absolute top-4 right-4 z-20">
                  <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                    Most Popular
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-6 w-fit">
                  <Zap size={12} /> Ultimate Power
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

                <Link href="/register?plan=ai" className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 text-center uppercase tracking-widest text-sm mb-3 group/btn flex items-center justify-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
                  Awaken AI <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <p className="text-[10px] text-center text-gray-500 mb-2">Then $29.98/mo after first month</p>

                <p className="text-[10px] text-center text-purple-400/60 font-bold uppercase tracking-widest mb-6">
                  Recommended for Professionals
                </p>

                <div className="space-y-5 flex-grow">
                  {[
                    'Everything in Knighthood',
                    'Medysa AI Coach Access',
                    'Emotional & Tilt Detection',
                    'Predictive Market Sentiment',
                    'Risk Management Sentinel',
                    'Personalized 1-on-1 Stats'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                        <Check size={12} />
                      </div>
                      <span className="text-gray-200 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tier 3: The Legion (Anchor - SOLD OUT) */}
            <div className="relative group opacity-60 grayscale scale-95 transition-all duration-500 hover:grayscale-0 hover:opacity-80">
              <div className="absolute -inset-1 bg-gradient-to-b from-gray-500 to-gray-800 rounded-3xl blur opacity-10"></div>

              <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 h-full flex flex-col">
                <div className="absolute top-6 right-6">
                  <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    SOLD OUT
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-2 text-gray-500" style={{ fontFamily: 'Cinzel, serif' }}>The Legion</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-black text-gray-600">$499</span>
                  <span className="text-gray-700 text-sm font-medium">/mo</span>
                </div>

                <div className="w-full py-4 bg-gray-800 text-gray-500 font-black rounded-xl text-center uppercase tracking-widest text-sm mb-10 cursor-not-allowed border border-white/5" style={{ fontFamily: 'Cinzel, serif' }}>
                  Waitlist Only
                </div>

                <div className="space-y-5 flex-grow">
                  {[
                    'Institutional Risk Protection',
                    'Direct Human Masterclass',
                    'Medysa API Integration',
                    'Custom Algo Building',
                    '24/7 Priority Concierge',
                    'Off-Shore Server Nodes'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-gray-600 flex-shrink-0">
                        <Check size={12} />
                      </div>
                      <span className="text-gray-600 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <footer className="pt-20 pb-44 border-t border-white/5 bg-black/40 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-600 grayscale opacity-50 shrink-0 bg-black/50">
              <Image src="/logo.png" alt="Medysa Logo" fill className="object-cover scale-[1.15]" />
            </div>
            <span className="text-xl font-bold tracking-widest text-gray-500" style={{ fontFamily: 'Cinzel, serif' }}>
              MEDYSA
            </span>
          </div>
          <p className="text-gray-300 text-xs italic font-serif mb-4 max-w-lg mx-auto leading-relaxed">
            &quot;In the arena of life, let humility be your shield, kindness your sword, and love your greatest victory.&quot;
          </p>
          <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-8">© 2026 Medysa Trading Journal. All rights reserved.</p>
          <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
            <Link href="#" className="hover:text-amber-500 transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-amber-500 transition-colors">Discord</Link>
            <Link href="/help" className="hover:text-amber-500 transition-colors">Manual</Link>
            <Link href="#" className="hover:text-amber-500 transition-colors">Support</Link>
          </div>
        </div>
      </footer>

      <StickyFomoBar />

      <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');
            `}</style>
    </div>
  );
}
