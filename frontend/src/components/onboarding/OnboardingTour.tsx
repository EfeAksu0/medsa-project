'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Shield, LayoutDashboard, BrainCircuit, Book, Sword } from 'lucide-react';

const TOUR_STEPS = [
    {
        id: 'welcome',
        title: 'Welcome to the Order',
        description: 'You have entered the Medysa Trading Ecosystem. This is not just a journal; it is your weapon against chaos.',
        icon: <Shield className="text-emerald-500" size={48} />,
        color: 'emerald'
    },
    {
        id: 'dashboard',
        title: 'Your Command Center',
        description: 'Track your PnL, Win Rate, and Equity Curve in real-time. The "Cockpit" gives you instant situational awareness.',
        icon: <LayoutDashboard className="text-blue-500" size={48} />,
        color: 'blue'
    },
    {
        id: 'ai',
        title: 'Neural AI Coach',
        description: 'Meet your specialized AI analysts: The Medic for trauma, The Sniper for discipline, and The Forensic Unit for deep analysis.',
        icon: <BrainCircuit className="text-purple-500" size={48} />,
        color: 'purple'
    },
    {
        id: 'journal',
        title: 'The Psychological Vault',
        description: 'Log not just your trades, but your emotions. Identify "Tilt", "Greed", and "Fear" before they destroy your account.',
        icon: <Book className="text-amber-500" size={48} />,
        color: 'amber'
    },
    {
        id: 'finish',
        title: 'Begin the Hunt',
        description: 'Your setup is complete. The markets await. Stay disciplined, stay sharp, and may your edge be ever in your favor.',
        icon: <Sword className="text-red-500" size={48} />,
        color: 'red'
    }
];

export interface OnboardingTourProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function OnboardingTour({ isOpen = false, onClose }: OnboardingTourProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Sync isVisible with external isOpen prop if provided
    useEffect(() => {
        if (isOpen) {
            // Only show and reset if we aren't already visible
            // This prevents resetting the step if parent re-renders pass true again
            if (!isVisible) {
                setTimeout(() => {
                    setIsVisible(true);
                    setCurrentStep(0);
                }, 0);
            }
        } else if (onClose) {
            // Only hide if onClose is provided (controlled mode)
            // Otherwise we stick to internal state logic
            setTimeout(() => {
                setIsVisible(false);
            }, 0);
        }
    }, [isOpen, onClose, isVisible]);

    // Cleanup internal state when component unmounts
    useEffect(() => {
        return () => setIsVisible(false);
    }, []);

    useEffect(() => {
        // Only run auto-check if NOT controlled externally
        if (onClose) return;

        // Check if user has already completed the tour
        const completed = localStorage.getItem('medysa_onboarding_completed');

        if (!completed) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [onClose]);

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        if (onClose) {
            onClose();
        } else {
            localStorage.setItem('medysa_onboarding_completed', 'true');
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const step = TOUR_STEPS[currentStep];

    // ... (keep rendering logic same)

    const getColorClasses = (color: string) => {
        const variants: Record<string, { bg: string, border: string, glow: string }> = {
            emerald: { bg: 'bg-emerald-950/40', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
            blue: { bg: 'bg-blue-950/40', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
            purple: { bg: 'bg-purple-950/40', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
            amber: { bg: 'bg-amber-950/40', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' },
            red: { bg: 'bg-red-950/40', border: 'border-red-500/30', glow: 'shadow-red-500/20' },
        };
        return variants[color] || variants.emerald;
    };

    const styles = getColorClasses(step.color);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        key={step.id}
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, type: "spring" }}
                        className={`relative w-full max-w-lg ${styles.bg} border-2 ${styles.border} shadow-[0_0_50px_rgba(0,0,0,0.5)] ${styles.glow} rounded-2xl p-8 overflow-hidden`}
                    >
                        {/* Background Texture */}
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none" />
                        <div className={`absolute top-0 right-0 w-64 h-64 bg-${step.color}-500 blur-[100px] opacity-10 rounded-full pointer-events-none`} />

                        {/* Close Button */}
                        <button
                            onClick={handleSkip}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center text-center">

                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                className={`mb-6 p-4 rounded-full bg-black/40 border ${styles.border}`}
                            >
                                {step.icon}
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl font-bold text-white mb-3"
                                style={{ fontFamily: 'Cinzel, serif' }}
                            >
                                {step.title}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-300 mb-8 leading-relaxed"
                            >
                                {step.description}
                            </motion.p>

                            {/* Navigation */}
                            <div className="flex items-center justify-between w-full mt-4">
                                <div className="flex gap-1">
                                    {TOUR_STEPS.map((s, i) => (
                                        <div
                                            key={s.id}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? `w-8 bg-${step.color}-500` : 'w-2 bg-gray-700'}`}
                                        />
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    {currentStep > 0 && (
                                        <button
                                            onClick={handlePrev}
                                            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                        >
                                            Back
                                        </button>
                                    )}
                                    <button
                                        onClick={handleNext}
                                        className={`px-6 py-2 rounded-lg bg-${step.color}-600 hover:bg-${step.color}-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-${step.color}-900/50 flex items-center gap-2 group`}
                                    >
                                        {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
