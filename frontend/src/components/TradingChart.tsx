'use client';

import { useEffect, useRef, memo } from 'react';

interface TradingChartProps {
    entryPrice: number;
    currentPrice: number;
    direction: 'LONG' | 'SHORT';
    progress: number;
    instrument: string;
}

type Candle = {
    open: number;
    high: number;
    low: number;
    close: number;
    timestamp: number;
};

function TradingChart({ entryPrice, currentPrice, direction, progress }: TradingChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const candlesRef = useRef<Candle[]>([]);
    const updateCountRef = useRef(0);
    const animationRef = useRef<number | null>(null);

    // Refs for props to avoid re-binding the drawing loop
    const entryPriceRef = useRef(entryPrice);
    const directionRef = useRef(direction);
    const progressRef = useRef(progress);

    useEffect(() => { entryPriceRef.current = entryPrice; }, [entryPrice]);
    useEffect(() => { directionRef.current = direction; }, [direction]);
    useEffect(() => { progressRef.current = progress; }, [progress]);

    // Initialize History
    useEffect(() => {
        // Reset candles when entry price (scenario) changes
        candlesRef.current = [];

        const initial: Candle[] = [];
        let price = entryPrice;
        const now = Date.now();

        // Generate 400 historical candles (fills > 6000px width)
        for (let i = 400; i > 0; i--) {
            const volatility = entryPrice * 0.0002; // Tight volatility for history
            const open = price;
            const close = open + (Math.random() - 0.5) * volatility;
            const high = Math.max(open, close) + Math.random() * volatility * 0.5;
            const low = Math.min(open, close) - Math.random() * volatility * 0.5;

            initial.push({
                open, high, low, close,
                timestamp: now - i * 1000
            });
            price = close;
        }
        candlesRef.current = initial;
    }, [entryPrice]);

    // Update Logic (Runs on every prop update, approx 60fps from page.tsx)
    useEffect(() => {
        if (progress === 0) return;

        const candles = candlesRef.current;
        if (candles.length === 0) return;

        // Update Last Candle
        const last = candles[candles.length - 1];
        last.close = currentPrice;
        last.high = Math.max(last.high, currentPrice);
        last.low = Math.min(last.low, currentPrice);

        // Advance Candle Rule: Every ~20 updates (approx 300-500ms at 60fps)
        updateCountRef.current++;
        if (updateCountRef.current > 20) {
            updateCountRef.current = 0;
            // Push new candle starting at current price
            candles.push({
                open: currentPrice,
                high: currentPrice,
                low: currentPrice,
                close: currentPrice,
                timestamp: Date.now()
            });

            // Keep array size manageable but large enough for wide screens
            if (candles.length > 500) {
                candles.shift();
            }
        }
    }, [currentPrice, progress]);

    // Drawing Loop (Decoupled from React renders)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for no transparency
        if (!ctx) return;

        const draw = () => {
            if (!canvasRef.current || !candlesRef.current.length) {
                animationRef.current = requestAnimationFrame(draw);
                return;
            }

            const width = canvas.width;
            const height = canvas.height;
            const candles = candlesRef.current;

            // Use refs for stable access inside the loop
            const entry = entryPriceRef.current;
            const dir = directionRef.current;
            const prog = progressRef.current;

            // Visual Settings
            const CANDLE_WIDTH = 12;
            const SPACING = 4;
            const TOTAL_BAR_WIDTH = CANDLE_WIDTH + SPACING;
            const RIGHT_MARGIN = 80; // Space for price scale

            // Calculate Scale based on VISIBLE candles only
            // We want the last candle to be at "width - RIGHT_MARGIN"
            const maxVisibleCandles = Math.ceil((width - RIGHT_MARGIN) / TOTAL_BAR_WIDTH) + 2;
            const startIndex = Math.max(0, candles.length - maxVisibleCandles);
            const visibleCandles = candles.slice(startIndex);

            let min = Infinity, max = -Infinity;
            for (const c of visibleCandles) {
                if (c.low < min) min = c.low;
                if (c.high > max) max = c.high;
            }

            // Add padding to price scale
            const range = max - min || 1;
            const padding = range * 0.15; // 15% padding
            min -= padding;
            max += padding;
            const effectiveRange = max - min;

            // Clear Background
            ctx.fillStyle = '#000000'; // Pure Black
            ctx.fillRect(0, 0, width, height);

            // Draw Grid
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 1;
            ctx.beginPath();

            // Horizontal Grid
            for (let i = 1; i < 6; i++) {
                const y = height - ((i * effectiveRange / 6) / effectiveRange) * height;
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
            }
            ctx.stroke();

            // Function to get Y coord
            const getY = (price: number) => height - ((price - min) / effectiveRange) * height;

            // Draw Candles
            candles.forEach((c, i) => {
                // Calculate X position: From Right to Left
                const offsetFromRight = candles.length - 1 - i;
                const x = width - RIGHT_MARGIN - (offsetFromRight * TOTAL_BAR_WIDTH) - (CANDLE_WIDTH / 2);

                if (x < -CANDLE_WIDTH) return; // Skip off-screen left

                const isUp = c.close >= c.open;
                const color = isUp ? '#22c55e' : '#ef4444'; // Bright Green/Red

                const yHigh = getY(c.high);
                const yLow = getY(c.low);
                const yOpen = getY(c.open);
                const yClose = getY(c.close);

                ctx.fillStyle = color;
                ctx.strokeStyle = color;

                // Wick
                ctx.beginPath();
                ctx.moveTo(x, yHigh);
                ctx.lineTo(x, yLow);
                ctx.lineWidth = 1;
                ctx.stroke();

                // Body
                const bodyTop = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(Math.abs(yOpen - yClose), 1);
                ctx.fillRect(x - CANDLE_WIDTH / 2, bodyTop, CANDLE_WIDTH, bodyHeight);
            });

            // Draw Entry Price Line
            if (prog > 0) {
                const yEntry = getY(entry);
                ctx.strokeStyle = dir === 'LONG' ? '#22c55e' : '#ef4444';
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(0, yEntry);
                ctx.lineTo(width, yEntry);
                ctx.stroke();
                ctx.setLineDash([]);

                // Entry Label
                ctx.fillStyle = dir === 'LONG' ? '#22c55e' : '#ef4444';
                ctx.font = 'bold 11px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(`${dir} ENTRY`, 10, yEntry - 8);
            }

            // Current Price Line
            const latestCandle = candles[candles.length - 1];
            if (latestCandle) {
                const currentPrice = latestCandle.close;
                const yCurrent = getY(currentPrice);

                ctx.strokeStyle = '#666';
                ctx.lineWidth = 1;
                ctx.setLineDash([2, 2]);
                ctx.beginPath();
                ctx.moveTo(0, yCurrent);
                ctx.lineTo(width, yCurrent);
                ctx.stroke();
                ctx.setLineDash([]);

                // Price Blob on Right Axis
                ctx.fillStyle = latestCandle.close >= latestCandle.open ? '#22c55e' : '#ef4444';

                // Draw arrow shape
                ctx.beginPath();
                ctx.moveTo(width - RIGHT_MARGIN, yCurrent);
                ctx.lineTo(width - RIGHT_MARGIN + 10, yCurrent - 10);
                ctx.lineTo(width, yCurrent - 10);
                ctx.lineTo(width, yCurrent + 10);
                ctx.lineTo(width - RIGHT_MARGIN + 10, yCurrent + 10);
                ctx.fill();

                ctx.fillStyle = '#000'; // Text color
                ctx.textAlign = 'center';
                ctx.font = 'bold 11px monospace';
                ctx.fillText(currentPrice.toFixed(2), width - RIGHT_MARGIN / 2 + 5, yCurrent + 4);
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        // Start Loop
        animationRef.current = requestAnimationFrame(draw);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []); // EMPTY DEPENDENCY ARRAY = Runs once, never restarts = NO LAG!

    // Resize Observer
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement;
        if (!parent) return;

        const resize = () => {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        };

        const observer = new ResizeObserver(resize);
        observer.observe(parent);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative h-full w-full bg-black">
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
}

export default memo(TradingChart);
