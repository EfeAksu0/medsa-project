"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBugs = exports.reportBug = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const reportBug = async (req, res) => {
    try {
        const { description, steps } = req.body;
        // User ID is optional (could be anonymous if not logged in, but usually we have req.user)
        const userId = req.user?.userId || null;
        if (!description) {
            res.status(400).json({ error: 'Description is required' });
            return;
        }
        const bug = await prisma.bugReport.create({
            data: {
                userId,
                description,
                steps: steps || '',
            },
        });
        res.status(201).json({ message: 'Bug reported successfully', bug });
    }
    catch (error) {
        console.error('Error reporting bug:', error);
        res.status(500).json({ error: 'Failed to submit bug report' });
    }
};
exports.reportBug = reportBug;
const getBugs = async (req, res) => {
    try {
        // Simple admin-like endpoint to view bugs
        const bugs = await prisma.bugReport.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(bugs);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch bugs' });
    }
};
exports.getBugs = getBugs;
