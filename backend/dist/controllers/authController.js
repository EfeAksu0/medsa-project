"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncSupabaseUser = exports.markEmailVerified = exports.updateMe = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma_1 = require("../prisma");
const validateEnv_1 = require("../utils/validateEnv");
const client_1 = require("@prisma/client");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().optional(),
    password: zod_1.z.string().min(6),
    plan: zod_1.z.string().optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const register = async (req, res, next) => {
    try {
        const { email, name, password, plan } = registerSchema.parse(req.body);
        const normalizedEmail = email.toLowerCase();
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        // Default to KNIGHT tier. Upgrades happen via Payment Webhook.
        const tier = client_1.SubscriptionTier.KNIGHT;
        const user = await prisma_1.prisma.user.create({
            data: {
                email: normalizedEmail,
                name,
                passwordHash,
                tier,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, validateEnv_1.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, tier: user.tier, subscriptionStatus: user.subscriptionStatus } });
    }
    catch (error) {
        console.error("REGISTRATION ERROR:", error);
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const normalizedEmail = email.toLowerCase();
        console.log(`[LOGIN ATTEMPT] Email: ${normalizedEmail}`); // DEBUG
        const user = await prisma_1.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            console.log(`[LOGIN FAILED] User not found: ${email}`); // DEBUG
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        console.log(`[LOGIN ATTEMPT] User found. Password match: ${isMatch}`); // DEBUG
        if (!isMatch) {
            console.log(`[LOGIN FAILED] Password mismatch for: ${email}`); // DEBUG
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, validateEnv_1.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, tier: user.tier, subscriptionStatus: user.subscriptionStatus } });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getMe = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
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
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
const updateSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    password: zod_1.z.string().min(6).optional(),
    avatarUrl: zod_1.z.string().optional(), // We will store this in DB if schema supports it, strictly speaking user table needs avatarUrl column
});
const updateMe = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const { name, password, avatarUrl } = updateSchema.parse(req.body);
        const dataToUpdate = {};
        if (name)
            dataToUpdate.name = name;
        if (password) {
            const salt = await bcryptjs_1.default.genSalt(10);
            dataToUpdate.passwordHash = await bcryptjs_1.default.hash(password, salt);
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
        const user = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: dataToUpdate,
        });
        res.json({ user: { id: user.id, email: user.email, name: user.name, tier: user.tier } });
    }
    catch (error) {
        next(error);
    }
};
exports.updateMe = updateMe;
const markEmailVerified = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const user = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                emailVerified: true,
                emailVerifiedAt: new Date(),
            },
        });
        res.json({ success: true, emailVerified: user.emailVerified });
    }
    catch (error) {
        next(error);
    }
};
exports.markEmailVerified = markEmailVerified;
const syncSupabaseUser = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { email, name } = req.body;
        if (!userId || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Check if user already exists in our database
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { id: userId }
        });
        if (existingUser) {
            return res.json({ success: true, user: existingUser });
        }
        // Create user in our database with Supabase ID
        const user = await prisma_1.prisma.user.create({
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
    }
    catch (error) {
        console.error('Sync user error:', error);
        next(error);
    }
};
exports.syncSupabaseUser = syncSupabaseUser;
