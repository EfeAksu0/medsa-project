'use client';

import { useEffect, useRef, useState } from 'react';

interface KnightsBattleProps {
    wins: number;
    losses: number;
    className?: string;
}

type KnightState = 'IDLE' | 'WALKING' | 'ATTACKING' | 'BLOCKING' | 'HIT';

interface Knight {
    x: number;
    y: number;
    targetX: number;
    state: KnightState;
    stateTime: number;
    attackCooldown: number;
    walkCycle: number;
    health: number;
    isBlocking: boolean;
}

export function KnightsBattle({ wins, losses, className = '' }: KnightsBattleProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const total = wins + losses;
    const winRate = total > 0 ? (wins / total) * 100 : 50;
    const shakeRef = useRef({ x: 0, y: 0, intensity: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            const container = canvas.parentElement;
            if (container) {
                canvas.width = container.clientWidth;
                canvas.height = Math.min(400, container.clientWidth * 0.4);
            }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Animation variables
        let time = 0;

        const blueKnight: Knight = {
            x: canvas.width * 0.25,
            y: canvas.height * 0.6,
            targetX: canvas.width * 0.25,
            state: 'IDLE',
            stateTime: 0,
            attackCooldown: 0,
            walkCycle: 0,
            health: 100,
            isBlocking: false,
        };

        const redKnight: Knight = {
            x: canvas.width * 0.75,
            y: canvas.height * 0.6,
            targetX: canvas.width * 0.75,
            state: 'IDLE',
            stateTime: 0,
            attackCooldown: 0,
            walkCycle: 0,
            health: 100,
            isBlocking: false,
        };

        // Enhanced particle system
        const particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            life: number;
            maxLife: number;
            color: string;
            size: number;
            type: 'spark' | 'slash' | 'dust';
        }> = [];

        const createSparks = (x: number, y: number, color: string, count = 12) => {
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count;
                const speed = 3 + Math.random() * 4;
                particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 2,
                    life: 1,
                    maxLife: 1,
                    color,
                    size: 2 + Math.random() * 2,
                    type: 'spark',
                });
            }
        };



        const createDust = (x: number, y: number) => {
            for (let i = 0; i < 4; i++) {
                particles.push({
                    x: x + (Math.random() - 0.5) * 20,
                    y: y + 40,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -Math.random() * 2,
                    life: 1,
                    maxLife: 1,
                    color: 'rgba(100, 100, 100, 0.6)',
                    size: 4 + Math.random() * 4,
                    type: 'dust',
                });
            }
        };

        const drawKnight = (
            knight: Knight,
            facingRight: boolean,
            color: string,
            time: number
        ) => {
            const dir = facingRight ? 1 : -1;

            // Walking animation bob
            let bounce = 0;
            if (knight.state === 'WALKING') {
                bounce = Math.sin(knight.walkCycle * 0.3) * 4;
            } else if (knight.state === 'IDLE') {
                bounce = Math.sin(time * 1.5) * 2;
            }

            ctx.save();
            ctx.translate(knight.x, knight.y + bounce);
            ctx.scale(dir, 1);

            // Shadow with dynamic size
            const shadowScale = 1;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.ellipse(0, 50, 25 * shadowScale, 8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Legs with walking animation
            const legSwing = knight.state === 'WALKING' ? Math.sin(knight.walkCycle * 0.3) * 5 : 0;

            ctx.fillStyle = color;
            ctx.save();
            ctx.translate(-8, 40);
            ctx.rotate(legSwing * 0.05);
            ctx.fillRect(-4, 0, 8, 16);
            ctx.restore();

            ctx.save();
            ctx.translate(6, 40);
            ctx.rotate(-legSwing * 0.05);
            ctx.fillRect(-4, 0, 8, 16);
            ctx.restore();

            // Body (armor) with tilt during attack
            ctx.save();
            if (knight.state === 'ATTACKING') {
                ctx.rotate(0.1 * dir);
            }

            // Enhanced chest plate with metallic detail
            const chestGradient = ctx.createLinearGradient(-15, 0, 15, 40);
            chestGradient.addColorStop(0, color === '#1e40af' ? '#2563eb' : '#b91c1c');
            chestGradient.addColorStop(0.3, color);
            chestGradient.addColorStop(0.7, color);
            chestGradient.addColorStop(1, '#000');
            ctx.fillStyle = chestGradient;
            ctx.fillRect(-15, 0, 30, 40);

            // Metallic shine on armor
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.fillRect(-12, 2, 8, 15);

            // Armor plates and rivets
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 2;
            ctx.strokeRect(-15, 10, 30, 3);
            ctx.strokeRect(-15, 25, 30, 3);

            // Rivets on armor
            ctx.fillStyle = '#8b7355';
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(-10 + i * 10, 11, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(-10 + i * 10, 26, 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // Battle damage scratches
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-8, 15);
            ctx.lineTo(-3, 20);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(5, 30);
            ctx.lineTo(10, 35);
            ctx.stroke();
            ctx.restore();

            // Shield with blocking animation
            const shieldOffset = knight.isBlocking ? -5 : 0;
            ctx.save();
            ctx.translate(-20 + shieldOffset, 20);
            if (knight.isBlocking) {
                ctx.scale(1.1, 1.1);
            }

            const shieldGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
            shieldGradient.addColorStop(0, color);
            shieldGradient.addColorStop(1, '#000');
            ctx.fillStyle = shieldGradient;
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 3;

            ctx.beginPath();
            ctx.moveTo(-8, -10);
            ctx.lineTo(-8, 13);
            ctx.lineTo(0, 18);
            ctx.lineTo(8, 13);
            ctx.lineTo(8, -10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Shield emblem
            ctx.fillStyle = '#d4af37';
            ctx.beginPath();
            ctx.arc(0, 5, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Enhanced helmet with realistic metallics
            ctx.save();
            const headBob = knight.state === 'ATTACKING' ? 3 : 0;
            ctx.translate(0, -10 + headBob);

            // Helmet with depth and shine
            const helmGradient = ctx.createRadialGradient(-8, -8, 5, 0, 0, 20);
            helmGradient.addColorStop(0, '#f0f0f0');  // Bright highlight
            helmGradient.addColorStop(0.2, '#a0a0a0');
            helmGradient.addColorStop(0.5, color);
            helmGradient.addColorStop(1, '#000');
            ctx.fillStyle = helmGradient;
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.fill();

            // Helmet rim
            ctx.strokeStyle = color === '#1e40af' ? '#1e3a8a' : '#7f1d1d';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 17, Math.PI, Math.PI * 2);
            ctx.stroke();

            // Visor with menacing glow
            ctx.fillStyle = '#000';
            ctx.fillRect(-12, -2, 24, 12);
            const visorColor = color === '#1e40af' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(220, 38, 38, 0.5)';
            ctx.fillStyle = visorColor;
            ctx.fillRect(-11, -1, 22, 10);

            // Visor reflection
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(-10, 0, 8, 3);

            // Enhanced plume with shadow
            ctx.fillStyle = color === '#1e40af' ? '#fbbf24' : '#dc2626';
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.moveTo(-6, -15);
            ctx.bezierCurveTo(-12, -25, -10, -32, -10, -28);
            ctx.bezierCurveTo(-6, -34, 0, -38, 0, -38);
            ctx.bezierCurveTo(0, -38, 6, -34, 10, -28);
            ctx.bezierCurveTo(10, -32, 12, -25, 6, -15);
            ctx.closePath();
            ctx.fill();

            // Plume strands for detail
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath();
                ctx.moveTo(i * 3, -15);
                ctx.lineTo(i * 3, -30);
                ctx.stroke();
            }

            ctx.shadowBlur = 0;
            ctx.restore();

            // Sword with slow, cinematic attack animation
            const isDominating = (facingRight && winRate > 60) || (!facingRight && winRate < 40);
            const isLosing = (facingRight && winRate < 40) || (!facingRight && winRate > 60);

            let swordAngle = -Math.PI / 6; // Default neutral
            let swordX = 20;
            let swordY = -5;

            if (knight.state === 'ATTACKING') {
                // Slow, smooth attack animation with easing (60 frames = 1 second)
                const attackProgress = knight.stateTime / 60;



                // Three-phase attack: Windup -> Strike -> Recovery
                if (attackProgress < 0.35) {
                    // Phase 1: Windup (pull back and up)
                    const windupProgress = attackProgress / 0.35;
                    swordAngle = -Math.PI / 6 + windupProgress * (Math.PI / 6);
                    swordX = 20 - windupProgress * 8;
                    swordY = -5 - windupProgress * 15;
                } else if (attackProgress < 0.65) {
                    // Phase 2: Strike (fast forward swing)
                    const strikeProgress = (attackProgress - 0.35) / 0.3;
                    swordAngle = -Math.PI / 12 - strikeProgress * (Math.PI / 2.5);
                    swordX = 12 + strikeProgress * 25;
                    swordY = -20 + strikeProgress * 15;
                } else {
                    // Phase 3: Recovery (return to ready position)
                    const recoveryProgress = (attackProgress - 0.65) / 0.35;
                    swordAngle = -Math.PI / 2.9 + recoveryProgress * (Math.PI / 4);
                    swordX = 37 - recoveryProgress * 12;
                    swordY = -5;
                }
            } else if (isDominating) {
                // Threatening forward pose when winning
                swordAngle = -Math.PI / 4;
                swordX = 25;
                swordY = -10;
            } else if (isLosing || knight.isBlocking) {
                // Defensive/guarded pose
                swordAngle = -Math.PI / 8;
                swordX = 18;
                swordY = -3;
            }

            ctx.save();
            ctx.translate(swordX, swordY);
            ctx.rotate(swordAngle);

            // Subtle metallic shine - glows more during attack
            if (knight.state === 'ATTACKING') {
                const glowIntensity = Math.sin(knight.stateTime * 0.3) * 0.3 + 0.5;
                ctx.shadowColor = `rgba(255, 255, 255, ${glowIntensity})`;
                ctx.shadowBlur = 12;
            } else if (isDominating) {
                ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
                ctx.shadowBlur = 5;
            }

            // Blade with gradient
            const bladeGradient = ctx.createLinearGradient(-3, -45, 3, 0);
            bladeGradient.addColorStop(0, '#fff');
            bladeGradient.addColorStop(0.3, '#e0e0e0');
            bladeGradient.addColorStop(0.7, '#c0c0c0');
            bladeGradient.addColorStop(1, '#888');
            ctx.fillStyle = bladeGradient;
            ctx.fillRect(-2, -45, 4, 48);

            // Blade tip
            ctx.beginPath();
            ctx.moveTo(-2, -45);
            ctx.lineTo(0, -52);
            ctx.lineTo(2, -45);
            ctx.closePath();
            ctx.fill();

            // Blade edge highlight
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-1, -45);
            ctx.lineTo(-1, -10);
            ctx.stroke();

            ctx.shadowBlur = 0;

            // Hilt with detail
            const hiltGradient = ctx.createLinearGradient(-6, -2, 6, 2);
            hiltGradient.addColorStop(0, '#ffd700');
            hiltGradient.addColorStop(0.5, '#d4af37');
            hiltGradient.addColorStop(1, '#b8860b');
            ctx.fillStyle = hiltGradient;
            ctx.fillRect(-6, -2, 12, 5);

            // Grip
            ctx.fillStyle = '#654321';
            ctx.fillRect(-2, 3, 4, 10);
            // Grip wrapping
            ctx.strokeStyle = '#8b4513';
            ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(-2, 3 + i * 2);
                ctx.lineTo(2, 3 + i * 2);
                ctx.stroke();
            }

            // Pommel
            ctx.fillStyle = hiltGradient;
            ctx.beginPath();
            ctx.arc(0, 15, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
            ctx.restore();
        };

        const updateKnight = (knight: Knight, opponent: Knight, isBlue: boolean) => {
            knight.stateTime++;

            // Dramatic positioning - winner pushes loser to the wall
            if (isBlue) {
                // Blue knight advances based on win rate
                knight.targetX = canvas.width * (0.15 + (winRate / 100) * 0.55);
            } else {
                // Red knight retreats based on loss rate  
                knight.targetX = canvas.width * (0.85 - ((100 - winRate) / 100) * 0.55);
            }

            // Movement
            const dx = knight.targetX - knight.x;
            if (Math.abs(dx) > 2) {
                if (knight.state === 'IDLE') {
                    knight.state = 'WALKING';
                    knight.stateTime = 0;
                }
                knight.x += dx * 0.05;
                knight.walkCycle++;
                if (knight.walkCycle % 15 === 0) {
                    createDust(knight.x, knight.y);
                }
            } else if (knight.state === 'WALKING') {
                knight.state = 'IDLE';
                knight.stateTime = 0;
            }

            // Attack cooldown
            if (knight.attackCooldown > 0) {
                knight.attackCooldown--;
            }

            // State machine - slow, cinematic attacks
            switch (knight.state) {
                case 'IDLE':
                    // Random block animation for visual interest
                    if (Math.random() > 0.995 && !knight.isBlocking) {
                        knight.isBlocking = true;
                        setTimeout(() => knight.isBlocking = false, 1500);
                    }

                    // Slow, rare attacks (every ~8 seconds on average)
                    if (knight.attackCooldown === 0 && Math.random() > 0.994) {
                        if ((isBlue && wins > 0) || (!isBlue && losses > 0)) {
                            knight.state = 'ATTACKING';
                            knight.stateTime = 0;
                            knight.attackCooldown = 480; // 8 second cooldown
                        }
                    }
                    break;

                case 'ATTACKING':
                    // Slow 1-second attack animation
                    if (knight.stateTime === 30) {
                        // Impact moment - minimal effects
                        const midX = (knight.x + opponent.x) / 2;
                        const midY = knight.y - 20;
                        createSparks(midX, midY, '#d4af37', 3); // Just 3 gold sparks

                        // Gentle screen shake
                        shakeRef.current.intensity = 1;
                    }

                    if (knight.stateTime > 60) {
                        knight.state = 'IDLE';
                        knight.stateTime = 0;
                    }
                    break;

                case 'WALKING':
                    // Continue walking to target position
                    break;

                case 'BLOCKING':
                    // Defensive stance
                    break;
            }
        };

        const animate = () => {
            time += 0.016;

            // Apply and decay camera shake
            if (shakeRef.current.intensity > 0) {
                shakeRef.current.x = (Math.random() - 0.5) * shakeRef.current.intensity;
                shakeRef.current.y = (Math.random() - 0.5) * shakeRef.current.intensity;
                shakeRef.current.intensity *= 0.9;
            } else {
                shakeRef.current.x = 0;
                shakeRef.current.y = 0;
            }

            ctx.save();
            ctx.translate(shakeRef.current.x, shakeRef.current.y);

            // Enhanced atmospheric background with stars and moon
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#0f1419');  // Darker night sky
            gradient.addColorStop(0.4, '#1a2332');
            gradient.addColorStop(0.7, '#2d3748');
            gradient.addColorStop(1, '#475569');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Distant stars twinkling
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            for (let i = 0; i < 30; i++) {
                const starX = (i * 137.5) % canvas.width; // Pseudo-random
                const starY = (i * 73.3) % (canvas.height * 0.4);
                const twinkle = Math.sin(time * 2 + i) * 0.3 + 0.7;
                ctx.globalAlpha = twinkle;
                ctx.fillRect(starX, starY, 2, 2);
            }
            ctx.globalAlpha = 1;

            // Moon in the background
            const moonGradient = ctx.createRadialGradient(
                canvas.width * 0.8, canvas.height * 0.2, 0,
                canvas.width * 0.8, canvas.height * 0.2, 50
            );
            moonGradient.addColorStop(0, 'rgba(255, 255, 230, 0.9)');
            moonGradient.addColorStop(0.7, 'rgba(255, 255, 200, 0.5)');
            moonGradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
            ctx.fillStyle = moonGradient;
            ctx.beginPath();
            ctx.arc(canvas.width * 0.8, canvas.height * 0.2, 50, 0, Math.PI * 2);
            ctx.fill();

            // Distant mountains silhouette
            ctx.fillStyle = 'rgba(30, 40, 60, 0.6)';
            ctx.beginPath();
            ctx.moveTo(0, canvas.height * 0.65);
            for (let i = 0; i <= canvas.width; i += 50) {
                const height = Math.sin(i * 0.01) * 40 + canvas.height * 0.65;
                ctx.lineTo(i, height);
            }
            ctx.lineTo(canvas.width, canvas.height * 0.75);
            ctx.lineTo(0, canvas.height * 0.75);
            ctx.closePath();
            ctx.fill();

            // Realistic ground with depth and texture
            const groundGradient = ctx.createLinearGradient(0, canvas.height * 0.75, 0, canvas.height);
            groundGradient.addColorStop(0, '#0a4d3a');  // Darker green
            groundGradient.addColorStop(0.5, '#064e3b');
            groundGradient.addColorStop(1, '#042f1e');  // Almost black at bottom
            ctx.fillStyle = groundGradient;
            ctx.fillRect(0, canvas.height * 0.75, canvas.width, canvas.height * 0.25);

            // Ground grass texture
            ctx.strokeStyle = 'rgba(10, 77, 58, 0.4)';
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 8) {
                const offsetY = Math.sin(i * 0.1) * 3;
                ctx.beginPath();
                ctx.moveTo(i, canvas.height * 0.75 + offsetY);
                ctx.lineTo(i, canvas.height * 0.75 + 8 + offsetY);
                ctx.stroke();
            }

            // Ground shadows and depth lines
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 3;
            for (let i = 0; i < 4; i++) {
                ctx.globalAlpha = 0.3 - i * 0.05;
                ctx.beginPath();
                ctx.moveTo(0, canvas.height * 0.75 + i * 15);
                ctx.lineTo(canvas.width, canvas.height * 0.75 + i * 15);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;

            // Multi-layered fog with realistic movement
            for (let i = 0; i < 6; i++) {
                const fogY = canvas.height * 0.5 + Math.sin(time * 0.2 + i * 0.8) * 35;
                const fogX = Math.sin(time * 0.15 + i * 1.5) * 60;
                const fogAlpha = 0.08 + Math.sin(time * 0.3 + i) * 0.04;

                ctx.fillStyle = `rgba(148, 163, 184, ${fogAlpha})`;
                ctx.beginPath();
                ctx.ellipse(
                    canvas.width / 2 + fogX,
                    fogY,
                    canvas.width * 0.45,
                    45 + Math.sin(i) * 10,
                    0, 0, Math.PI * 2
                );
                ctx.fill();
            }

            // Atmospheric particles (fireflies/embers)
            ctx.fillStyle = 'rgba(255, 200, 100, 0.7)';
            for (let i = 0; i < 8; i++) {
                const embX = ((time * 30 + i * 80) % canvas.width);
                const embY = canvas.height * 0.6 + Math.sin(time * 2 + i) * 50;
                const pulse = Math.sin(time * 4 + i * 2) * 0.5 + 0.5;
                ctx.globalAlpha = pulse * 0.6;
                ctx.beginPath();
                ctx.arc(embX, embY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            // Update knights
            updateKnight(blueKnight, redKnight, true);
            updateKnight(redKnight, blueKnight, false);

            // Draw knights
            drawKnight(blueKnight, true, '#1e40af', time);
            drawKnight(redKnight, false, '#991b1b', time);

            // Update and draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.type !== 'slash') {
                    p.vy += 0.3; // gravity
                    p.vx *= 0.98; // air resistance
                }

                p.life -= 0.016;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                } else {
                    const alpha = p.life / p.maxLife;

                    if (p.type === 'slash') {
                        ctx.strokeStyle = p.color;
                        ctx.globalAlpha = alpha * 0.7;
                        ctx.lineWidth = p.size;
                        ctx.lineCap = 'round';
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
                        ctx.stroke();
                    } else {
                        ctx.fillStyle = p.color;
                        ctx.globalAlpha = alpha;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    ctx.globalAlpha = 1;
                }
            }


            ctx.restore();

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [winRate, wins, losses]);

    return (
        <div className={`relative ${className}`}>
            <canvas ref={canvasRef} className="w-full rounded-lg border-2 border-gray-700" />
            <div className="mt-2 flex justify-between items-center px-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span className="text-blue-400 font-semibold">Victories: {wins}</span>
                </div>
                <div className="text-gray-400 font-medium">
                    Win Rate: {winRate.toFixed(1)}%
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-red-400 font-semibold">Defeats: {losses}</span>
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                </div>
            </div>
        </div>
    );
}
