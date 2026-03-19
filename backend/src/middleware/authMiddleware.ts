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

    // --- ATTEMPT 2: Decode as Supabase JWT (decode payload without verifying signature) ---
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return res.status(401).json({ error: 'Unauthorized: Malformed token' });
        }

        // Base64url decode the payload
        const payloadRaw = Buffer.from(parts[1], 'base64url').toString('utf8');
        const payload = JSON.parse(payloadRaw);
        const supabaseUserId = payload.sub;
        const supabaseEmail = payload.email;

        if (!supabaseUserId) {
            return res.status(401).json({ error: 'Unauthorized: Unable to identify user' });
        }

        // Check token expiry from payload
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            return res.status(401).json({ error: 'Unauthorized: Token expired' });
        }

        // LOOKUP STRATEGY 1: Try by Supabase UUID (for users created via sync-supabase-user)
        let user = await prisma.user.findUnique({
            where: { id: supabaseUserId }
        });

        // LOOKUP STRATEGY 2: Try by email (for users created via our backend /auth/register)
        // Their DB id is different from the Supabase sub, but email must match
        if (!user && supabaseEmail) {
            user = await prisma.user.findUnique({
                where: { email: supabaseEmail.toLowerCase() }
            });
        }

        if (!user) {
            console.error(`[Auth] Supabase user not found in DB. sub=${supabaseUserId}, email=${supabaseEmail}`);
            return res.status(401).json({ error: 'Unauthorized: User not found. Please log out and log back in.' });
        }

        req.user = { userId: user.id };
        return next();

    } catch (err) {
        console.error('Auth error:', err);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
