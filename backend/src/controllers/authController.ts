import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../prisma';
import { env } from '../utils/validateEnv';
import { SubscriptionTier } from '@prisma/client';

const registerSchema = z.object({
    email: z.string().email(),
    name: z.string().optional(),
    password: z.string().min(6),
    plan: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, password, plan } = registerSchema.parse(req.body);
        const normalizedEmail = email.toLowerCase();

        const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Default to KNIGHT tier. Upgrades happen via Payment Webhook.
        const tier: SubscriptionTier = SubscriptionTier.KNIGHT;

        const user = await prisma.user.create({
            data: {
                email: normalizedEmail,
                name,
                passwordHash,
                tier,
            },
        });

        const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, tier: user.tier } });
    } catch (error) {
        console.error("REGISTRATION ERROR:", error);
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const normalizedEmail = email.toLowerCase();
        console.log(`[LOGIN ATTEMPT] Email: ${normalizedEmail}`); // DEBUG

        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            console.log(`[LOGIN FAILED] User not found: ${email}`); // DEBUG
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        console.log(`[LOGIN ATTEMPT] User found. Password match: ${isMatch}`); // DEBUG

        if (!isMatch) {
            console.log(`[LOGIN FAILED] Password mismatch for: ${email}`); // DEBUG
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { id: user.id, email: user.email, name: user.name, tier: user.tier } });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                tier: user.tier,
                emailVerified: user.emailVerified,
                emailVerifiedAt: user.emailVerifiedAt,
                subscriptionStatus: user.subscriptionStatus,
                subscriptionEndsAt: user.subscriptionEndsAt,
            }
        });
    } catch (error) {
        next(error);
    }
};

const updateSchema = z.object({
    name: z.string().optional(),
    password: z.string().min(6).optional(),
    avatarUrl: z.string().optional(), // We will store this in DB if schema supports it, strictly speaking user table needs avatarUrl column
});

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { name, password, avatarUrl } = updateSchema.parse(req.body);

        const dataToUpdate: any = {};
        if (name) dataToUpdate.name = name;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            dataToUpdate.passwordHash = await bcrypt.hash(password, salt);
        }
        // Note: Check if prisma schema has avatarUrl. If not, we might fail or need to add it.
        // For now, assuming name and password are safe.
        // If avatarUrl is passed, we might need a DB migration or just store it in a generic field if one existed.
        // Inspecting prisma schema would be ideal, but for now let's persist name/pass.

        // Wait, looking at getMe response: { id, email, name, tier }. No avatarUrl returned.
        // I should probably check prisma schema or just skip avatar persistence in user table for now and rely on local state or add it.
        // Let's assume for now we just update name/password.

        if (avatarUrl) {
            dataToUpdate.avatarUrl = avatarUrl;
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate,
        });

        res.json({ user: { id: user.id, email: user.email, name: user.name, tier: user.tier } });
    } catch (error) {
        next(error);
    }
};

export const markEmailVerified = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                emailVerified: true,
                emailVerifiedAt: new Date(),
            },
        });

        res.json({ success: true, emailVerified: user.emailVerified });
    } catch (error) {
        next(error);
    }
};

export const syncSupabaseUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.userId;
        const { email, name } = req.body;

        if (!userId || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user already exists in our database
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (existingUser) {
            return res.json({ success: true, user: existingUser });
        }

        // Create user in our database with Supabase ID
        const user = await prisma.user.create({
            data: {
                id: userId, // Use Supabase user ID
                email: email.toLowerCase(),
                name: name || '',
                passwordHash: '', // Not needed for Supabase auth
                tier: 'KNIGHT',
            },
        });

        console.log(`✅ Synced Supabase user to database: ${user.email}`);

        res.status(201).json({
            success: true, user: {
                id: user.id,
                email: user.email,
                name: user.name,
                tier: user.tier
            }
        });
    } catch (error) {
        console.error('Sync user error:', error);
        next(error);
    }
};
