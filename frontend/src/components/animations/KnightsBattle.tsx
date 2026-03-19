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

        const createSparks = (x: number, y: number, color: string, count = 6) => {
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
            for (let i = 0; i < 2; i++) {
                particles.push({
                    x: x + (Math.random() - 0.5) * 20,
                    y: y + 40,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -Math.random() * 2,
                    life: 1,
                    maxLife: 1,
                    color: 'rgba(100, 100, 100, 0.4)',
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

            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(0, 50, 25, 8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Legs
            const legSwing = knight.state === 'WALKING' ? Math.sin(knight.walkCycle * 0.3) * 5 : 0;
            ctx.fillStyle = color;
            ctx.fillRect(-12, 40 + (legSwing > 0 ? -2 : 0), 8, 16);
            ctx.fillRect(4, 40 + (legSwing < 0 ? -2 : 0), 8, 16);

            // Body
            ctx.save();
            if (knight.state === 'ATTACKING') {
                ctx.rotate(0.1 * dir);
            }
            ctx.fillStyle = color;
            ctx.fillRect(-15, 0, 30, 40);

            // Trim
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 1;
            ctx.strokeRect(-15, 10, 30, 1);
            ctx.strokeRect(-15, 25, 30, 1);
            ctx.restore();

            // Shield
            const shieldOffset = knight.isBlocking ? -5 : 0;
            ctx.fillStyle = color;
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-28 + shieldOffset, 10);
            ctx.lineTo(-28 + shieldOffset, 33);
            ctx.lineTo(-20 + shieldOffset, 38);
            ctx.lineTo(-12 + shieldOffset, 33);
            ctx.lineTo(-12 + shieldOffset, 10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Helmet
            ctx.save();
            const headBob = knight.state === 'ATTACKING' ? 3 : 0;
            ctx.translate(0, -10 + headBob);
            ctx.fillStyle = '#444';
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.fillRect(-12, -2, 24, 10);

            // Plume
            ctx.fillStyle = color === '#1e40af' ? '#fbbf24' : '#dc2626';
            ctx.beginPath();
            ctx.moveTo(-6, -15);
            ctx.quadraticCurveTo(0, -35, 6, -15);
            ctx.fill();
            ctx.restore();

            // Sword
            let swordAngle = -Math.PI / 6;
            let swordX = 20;
            let swordY = -5;

            if (knight.state === 'ATTACKING') {
                const attackProgress = knight.stateTime / 60;
                if (attackProgress < 0.35) {
                    swordAngle = -Math.PI / 6 + (attackProgress / 0.35) * (Math.PI / 6);
                } else if (attackProgress < 0.65) {
                    const strikeProgress = (attackProgress - 0.35) / 0.3;
                    swordAngle = -Math.PI / 12 - strikeProgress * (Math.PI / 2.5);
                    swordX = 12 + strikeProgress * 25;
                } else {
                    const recoveryProgress = (attackProgress - 0.65) / 0.35;
                    swordAngle = -Math.PI / 2.9 + recoveryProgress * (Math.PI / 4);
                }
            }

            ctx.save();
            ctx.translate(swordX, swordY);
            ctx.rotate(swordAngle);
            ctx.fillStyle = '#ccc';
            ctx.fillRect(-2, -45, 4, 48);
            ctx.fillStyle = '#d4af37';
            ctx.fillRect(-6, -2, 12, 5);
            ctx.restore();
            ctx.restore();
        };

        const updateKnight = (knight: Knight, opponent: Knight, isBlue: boolean) => {
            knight.stateTime++;
            if (isBlue) {
                knight.targetX = canvas.width * (0.15 + (winRate / 100) * 0.55);
            } else {
                knight.targetX = canvas.width * (0.85 - ((100 - winRate) / 100) * 0.55);
            }

            const dx = knight.targetX - knight.x;
            if (Math.abs(dx) > 2) {
                if (knight.state === 'IDLE') {
                    knight.state = 'WALKING';
                    knight.stateTime = 0;
                }
                knight.x += dx * 0.05;
                knight.walkCycle++;
                if (knight.walkCycle % 30 === 0) {
                    createDust(knight.x, knight.y);
                }
            } else if (knight.state === 'WALKING') {
                knight.state = 'IDLE';
                knight.stateTime = 0;
            }

            if (knight.attackCooldown > 0) knight.attackCooldown--;

            if (knight.state === 'IDLE' && knight.attackCooldown === 0 && Math.random() > 0.994) {
                if ((isBlue && wins > 0) || (!isBlue && losses > 0)) {
                    knight.state = 'ATTACKING';
                    knight.stateTime = 0;
                    knight.attackCooldown = 480;
                }
            }

            if (knight.state === 'ATTACKING') {
                if (knight.stateTime === 30) {
                    createSparks((knight.x + opponent.x) / 2, knight.y - 20, '#d4af37', 3);
                    shakeRef.current.intensity = 1;
                }
                if (knight.stateTime > 60) {
                    knight.state = 'IDLE';
                    knight.stateTime = 0;
                }
            }
        };

        const animate = () => {
            if (document.hidden) {
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            time += 0.016;

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

            // Sky
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#0f1419');
            gradient.addColorStop(1, '#2d3748');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Stars (reduced to 15)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            for (let i = 0; i < 15; i++) {
                ctx.fillRect((i * 137) % canvas.width, (i * 73) % (canvas.height * 0.4), 1, 1);
            }

            // Ground
            ctx.fillStyle = '#064e3b';
            ctx.fillRect(0, canvas.height * 0.75, canvas.width, canvas.height * 0.25);

            // Fog (reduced to 2 layers)
            for (let i = 0; i < 2; i++) {
                const fogY = canvas.height * 0.5 + Math.sin(time * 0.2 + i * 0.8) * 35;
                ctx.fillStyle = `rgba(148, 163, 184, 0.05)`;
                ctx.beginPath();
                ctx.ellipse(canvas.width / 2 + Math.sin(time * 0.15 + i * 1.5) * 60, fogY, canvas.width * 0.4, 40, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // Update & Draw
            updateKnight(blueKnight, redKnight, true);
            updateKnight(redKnight, blueKnight, false);
            drawKnight(blueKnight, true, '#2563eb', time);
            drawKnight(redKnight, false, '#dc2626', time);

            // Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx; p.y += p.vy;
                p.vy += 0.3; p.life -= 0.02;
                if (p.life <= 0) {
                    particles.splice(i, 1);
                } else {
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.life;
                    ctx.fillRect(p.x, p.y, p.size, p.size);
                    ctx.globalAlpha = 1;
                }
            }

            ctx.restore();
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
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
