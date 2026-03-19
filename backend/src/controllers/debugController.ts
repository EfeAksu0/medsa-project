import { Request, Response } from 'express';

export const checkEnv = (req: Request, res: Response) => {
    res.json({
        frontendUrl: process.env.FRONTEND_URL,
        nodeEnv: process.env.NODE_ENV,
        hasStripe: !!process.env.STRIPE_SECRET_KEY
    });
};
