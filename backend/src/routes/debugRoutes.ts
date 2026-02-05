import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

router.get('/db-test', async (req: Request, res: Response) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            success: true,
            message: 'Database connection successful!'
        });
    } catch (error: any) {
        console.error('DB Test Error:', error);
        res.status(500).json({
            success: false,
            error: 'Database connection failed'
        });
    }
});

router.get('/stripe-test', async (req: Request, res: Response) => {
    try {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key) throw new Error('STRIPE_SECRET_KEY missing in env');

        // Return first 8 chars safely
        const keyPrefix = key.substring(0, 8);

        // Try init
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Stripe = require('stripe');
        const stripe = new Stripe(key.trim());

        // List 1 product to test auth
        await stripe.products.list({ limit: 1 });

        res.json({
            success: true,
            message: 'Stripe connection successful',
            keyPrefix: keyPrefix + '...',
            envCheck: {
                hasStripeKey: !!key,
                nodeEnv: process.env.NODE_ENV
            }
        });
    } catch (error: any) {
        console.error('Stripe Debug Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack,
            receivedKeyDetails: {
                valuePrefix: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 3) + '...' : 'undefined',
                length: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0,
                isString: typeof process.env.STRIPE_SECRET_KEY === 'string',
                firstChar: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.charAt(0) : 'N/A'
            }
        });
    }
});

router.get('/gemini-test', async (req: Request, res: Response) => {
    try {
        const key = process.env.GEMINI_API_KEY;
        if (!key) throw new Error('GEMINI_API_KEY missing in env');

        const model = 'gemini-2.0-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

        const fetchRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Ping. Reply with 'Pong'." }] }]
            })
        });

        if (!fetchRes.ok) {
            const errText = await fetchRes.text();
            throw new Error(`Gemini API Error: ${fetchRes.status} ${fetchRes.statusText} - ${errText}`);
        }

        const data = await fetchRes.json();

        res.json({
            success: true,
            message: 'Gemini connection successful',
            response: data.candidates?.[0]?.content?.parts?.[0]?.text,
            keyPrefix: key.substring(0, 5) + '...'
        });

    } catch (error: any) {
        console.error('Gemini Debug Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            receivedKeyDetails: {
                valuePrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 3) + '...' : 'undefined',
                length: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0
            }
        });
    }
});

export default router;
