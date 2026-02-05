'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

export function BattlefieldBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        if (!enabled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true }); // optimize
        if (!ctx) return;

        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateSize();

        // --- Ash System (Floating Up) ---
        // Optimization: Pre-allocate arrays
        const ashCount = 30; // Reduced count
        const ashParticles = new Float32Array(ashCount * 4); // x, y, size, alpha

        // Initialize Ash
        for (let i = 0; i < ashCount; i++) {
            const idx = i * 4;
            ashParticles[idx] = Math.random() * canvas.width;     // x
            ashParticles[idx + 1] = Math.random() * canvas.height; // y
            ashParticles[idx + 2] = Math.random() * 2 + 0.5;      // size
            ashParticles[idx + 3] = Math.random() * 0.5 + 0.1;    // alpha
        }

        // --- Fire Rain System (Dropping Down) ---
        const fireCount = 20; // Reduced count
        const fireParticles = new Float32Array(fireCount * 5); // x, y, vy, size, life
        const fireColors = ['#f59e0b', '#ef4444']; // Reduced color palette for performance

        // Initialize Fire
        for (let i = 0; i < fireCount; i++) {
            const idx = i * 5;
            fireParticles[idx] = Math.random() * canvas.width;      // x
            fireParticles[idx + 1] = -Math.random() * 100;          // y
            fireParticles[idx + 2] = Math.random() * 1.5 + 0.5;     // vy
            fireParticles[idx + 3] = Math.random() * 2 + 1;         // size
            fireParticles[idx + 4] = Math.random() * 100;           // life
        }

        let animationId: number;
        let lastTime = 0;
        const fpsInterval = 1000 / 30; // Cap at 30 FPS

        const animate = (time: number) => {
            if (!enabled) return;

            animationId = requestAnimationFrame(animate);

            const elapsed = time - lastTime;
            if (elapsed < fpsInterval) return;

            lastTime = time - (elapsed % fpsInterval);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Draw Ash (Simple circles, no composite)
            ctx.fillStyle = 'rgba(120, 130, 150, 0.4)';
            ctx.beginPath();
            for (let i = 0; i < ashCount; i++) {
                const idx = i * 4;
                // Update
                ashParticles[idx + 1] -= 0.2; // Float up
                ashParticles[idx] += (Math.random() - 0.5) * 0.2; // Wiggle

                // Reset
                if (ashParticles[idx + 1] < 0) {
                    ashParticles[idx + 1] = canvas.height + 10;
                    ashParticles[idx] = Math.random() * canvas.width;
                }

                // Draw path
                ctx.moveTo(ashParticles[idx], ashParticles[idx + 1]);
                ctx.arc(ashParticles[idx], ashParticles[idx + 1], ashParticles[idx + 2], 0, Math.PI * 2);
            }
            ctx.fill();

            // 2. Draw Fire (Batch drawing)
            // Use lighter composite for glow effect without expensive shadowBlur
            ctx.globalCompositeOperation = 'lighter';

            for (let i = 0; i < fireCount; i++) {
                const idx = i * 5;

                // Update
                fireParticles[idx + 1] += fireParticles[idx + 2]; // y += vy
                fireParticles[idx + 0] += (Math.random() - 0.5) * 0.5; // x drift
                fireParticles[idx + 4]++; // life++

                // Reset
                if (fireParticles[idx + 1] > canvas.height + 10 || fireParticles[idx + 4] > 200) {
                    fireParticles[idx + 1] = -10;
                    fireParticles[idx + 0] = Math.random() * canvas.width;
                    fireParticles[idx + 4] = 0;
                }

                const size = fireParticles[idx + 3];
                const x = fireParticles[idx];
                const y = fireParticles[idx + 1];

                // Draw Glow (Orange)
                ctx.fillStyle = '#f59e0b';
                ctx.globalAlpha = 0.4;
                ctx.beginPath();
                ctx.arc(x, y, size * 2, 0, Math.PI * 2);
                ctx.fill();

                // Draw Core (White/Yellow)
                ctx.fillStyle = '#fffbeb';
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1.0;
        };

        animationId = requestAnimationFrame(animate);
        window.addEventListener('resize', updateSize);

        return () => {
            window.removeEventListener('resize', updateSize);
            cancelAnimationFrame(animationId);
        };
    }, [enabled]);

    return (
        <>
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Dark Base */}
                <div className="absolute inset-0 bg-[#050810]" />

                {/* Background Image - Optimized: No filters, minimal transforms */}
                <Image
                    src="/hero-dragon-breath.png"
                    alt="Dragon Breath Background"
                    fill
                    className="object-cover opacity-80"
                    priority
                    quality={90} // Reduce quality slightly for performance
                    style={{
                        // Simple pan animation, removed heavy filters
                        animation: enabled ? 'battle-pan 30s ease-in-out infinite alternate' : 'none',
                        willChange: 'transform',
                        transform: 'scale(1.1)' // Initial scale
                    }}
                />

                {enabled && (
                    <>
                        {/* Static Overlay instead of animated fog for performance */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none" />

                        {/* Canvas Layer */}
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 pointer-events-none z-10"
                        />

                        {/* Static Vignette */}
                        <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,#050810_100%)] opacity-60" />
                    </>
                )}

                <style jsx>{`
                    @keyframes battle-pan {
                        0% { transform: scale(1.1) translate(0%, 0%); }
                        100% { transform: scale(1.1) translate(-2%, -1%); }
                    }
                `}</style>
            </div>

            {/* Light Toggle */}
            <button
                onClick={() => setEnabled(!enabled)}
                className="fixed bottom-6 right-6 z-[110] p-3 bg-gray-900/50 border border-white/5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-all backdrop-blur-sm"
                aria-label="Toggle Effects"
            >
                {enabled ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
        </>
    );
}
