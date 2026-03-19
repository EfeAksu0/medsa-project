import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../utils/validateEnv';
import { prisma } from '../prisma';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // --- ATTEMPT 1: Verify with our own backend JWT secret ---
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };

        // JWT is valid — now look up user in DB
        try {
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId }
            });

            if (user) {
                req.user = { userId: user.id };
                return next();
            }
            // Valid JWT but user not found — fall through to Supabase path
        } catch (dbErr) {
            // DB error during lookup (e.g., connection timeout)
            // The JWT itself was VALID so we know who they are — don't give a fake 401
            console.error('[Auth] DB error during user lookup (valid JWT):', dbErr);
            return res.status(503).json({ error: 'Service temporarily unavailable. Please try again in a moment.' });
        }
    } catch (err) {
        // JWT validation failed (invalid signature, wrong secret, etc.) — try Supabase token below
    }

    // --- ATTEMPT 2: Verify as Supabase JWT ---
    try {
        const supabaseSecret = env.SUPABASE_JWT_SECRET;

        if (!supabaseSecret) {
            // If secret is missing, we can't verify signature. 
            // This is a configuration gap.
            console.warn('[Auth] SUPABASE_JWT_SECRET is missing. Cannot verify Supabase tokens.');
            return res.status(401).json({ error: 'Unauthorized: Server configuration error (Missing Auth Secret)' });
        }

        const payload = jwt.verify(token, supabaseSecret) as { sub: string, email?: string };
        const supabaseUserId = payload.sub;
        const supabaseEmail = payload.email;

        if (!supabaseUserId) {
            return res.status(401).json({ error: 'Unauthorized: Unable to identify user from Supabase token' });
        }

        // LOOKUP STRATEGY 1: Try by Supabase UUID
        let user = await prisma.user.findUnique({
            where: { id: supabaseUserId }
        });

        // LOOKUP STRATEGY 2: Try by email
        if (!user && supabaseEmail) {
            user = await prisma.user.findUnique({
                where: { email: supabaseEmail.toLowerCase() }
            });
        }

        if (!user) {
            console.error(`[Auth] Supabase user not found in DB. sub=${supabaseUserId}, email=${supabaseEmail}`);
            return res.status(401).json({ error: 'Unauthorized: User record missing. Please re-register.' });
        }

        req.user = { userId: user.id };
        return next();

    } catch (err) {
        console.error('[Auth] Supabase Token Verification Failed:', (err as Error).message);
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
};
