import { Response } from 'express';
import { PrismaClient, SubscriptionTier } from '@prisma/client';
import { getUserContext, generateCoachingResponse } from '../services/aiService';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

/**
 * POST /api/ai/chat
 * Send a message to the AI coach and get a response
 */
export async function chat(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check subscription tier
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { tier: true }
        });

        if (!user || user.tier !== SubscriptionTier.MEDYSA_AI) {
            return res.status(403).json({
                error: 'AI Coach access requires the Medysa AI plan. Please upgrade your subscription.'
            });
        }

        const { message, sessionId } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get or create session
        let session;
        if (sessionId) {
            session = await prisma.aiSession.findFirst({
                where: { id: sessionId, userId },
            });
        }

        if (!session) {
            session = await prisma.aiSession.create({
                data: { userId },
            });
        }

        // Save user message
        await prisma.aiMessage.create({
            data: {
                sessionId: session.id,
                role: 'user',
                content: message,
            },
        });

        // Get user context
        const context = await getUserContext(userId);

        // Generate AI response
        const { response, emotion } = await generateCoachingResponse(message, context);

        // Save AI response
        const aiMessage = await prisma.aiMessage.create({
            data: {
                sessionId: session.id,
                role: 'assistant',
                content: response,
                emotion,
            },
        });

        return res.json({
            sessionId: session.id,
            message: {
                id: aiMessage.id,
                content: response,
                emotion,
                createdAt: aiMessage.createdAt,
            },
        });
    } catch (error: any) {
        console.error('Chat error:', error);
        return res.status(500).json({ error: 'Failed to process message' });
    }
}

/**
 * GET /api/ai/session/:id
 * Get session history
 */
export async function getSession(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { id } = req.params;

        const session = await prisma.aiSession.findFirst({
            where: { id: String(id), userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        return res.json(session);
    } catch (error: any) {
        console.error('Get session error:', error);
        return res.status(500).json({ error: 'Failed to fetch session' });
    }
}

/**
 * GET /api/ai/sessions
 * Get all user sessions
 */
export async function getSessions(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const sessions = await prisma.aiSession.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1, // Just the last message for preview
                },
            },
        });

        return res.json(sessions);
    } catch (error: any) {
        console.error('Get sessions error:', error);
        return res.status(500).json({ error: 'Failed to fetch sessions' });
    }
}
