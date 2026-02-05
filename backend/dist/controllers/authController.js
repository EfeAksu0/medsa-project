"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
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
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, tier: user.tier } });
    }
    catch (error) {
        console.error("REGISTRATION ERROR:", error);
        // WRITE TO FILE DEBUGGING
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(__dirname, '../../backend_errors.log');
        const logMessage = `[${new Date().toISOString()}] REGISTRATION ERROR: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}\n`;
        fs.appendFileSync(logPath, logMessage);
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
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, tier: user.tier } });
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
        res.json({ user: { id: user.id, email: user.email, name: user.name, tier: user.tier } });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
