import { Request, Response } from 'express';
import { prisma } from '../prisma';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';
import { env } from '../utils/validateEnv';

const getStripe = () => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    return new Stripe(key.trim());
};

const getFrontendUrl = () => {
    let url = (process.env.FRONTEND_URL || 'http://localhost:3000').trim();
    // Remove trailing slash if present to avoid double slashes
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
    }
    return url;
};

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const stripe = getStripe();
        const FRONTEND_URL = getFrontendUrl();
        const { planId } = req.body;
        const userId = (req as any).user?.userId;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        let priceAmount = 0;
        let productName = '';
        let targetTier = '';

        if (planId === 'knight') {
            priceAmount = 999; // $9.99
            productName = 'Knighthood Plan';
            targetTier = 'KNIGHT';
        } else if (planId === 'ai') {
            priceAmount = 1499; // $14.99
            productName = 'Medysa AI Plan';
            targetTier = 'MEDYSA_AI';
        } else {
            return res.status(400).json({ error: 'Invalid plan mappping' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: productName,
                            description: 'Monthly Subscription to Medysa Trading Journal',
                        },
                        unit_amount: priceAmount,
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${FRONTEND_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${FRONTEND_URL}/#pricing`,
            metadata: {
                userId: userId,
                targetTier: targetTier,
            },
        });

        console.log(`Creating session for ${userId} -> ${productName}`);
        res.json({ url: session.url });

    } catch (error: any) {
        console.error('Stripe Checkout Error:', error.message, error);
        res.status(500).json({ error: `Payment initialization failed: ${error.message}` });
    }
};

export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
        return res.status(400).send('Webhook Error: Missing signature or secret');
    }

    let event: Stripe.Event;

    try {
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Signature Verification Failed: ${(err as Error).message}`);
    }

    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;
            const targetTier = session.metadata?.targetTier;
            const stripe = getStripe();

            if (userId && targetTier) {
                console.log(`✅ Payment Successful! Upgrading user ${userId} to ${targetTier}`);

                // Get subscription details
                const subscriptionId = session.subscription as string;
                let subscriptionEndsAt = null;

                if (subscriptionId) {
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    // TODO: current_period_end no longer exists in Stripe SDK
                    // Will use billing_cycle_anchor + 1 month for now
                    subscriptionEndsAt = null; // Temporary: need to calculate proper end date
                }

                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        tier: targetTier as any,
                        stripeCustomerId: session.customer as string,
                        stripeSubscriptionId: subscriptionId,
                        subscriptionStatus: 'active',
                        subscriptionEndsAt: subscriptionEndsAt,
                    },
                });
            }
        } else if (event.type === 'customer.subscription.updated') {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            const user = await prisma.user.findFirst({
                where: { stripeCustomerId: customerId },
            });

            if (user) {
                console.log(`🔄 Subscription updated for user: ${user.id}`);
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        subscriptionStatus: subscription.status,
                        // TODO: current_period_end no longer exists in Stripe SDK
                        subscriptionEndsAt: null,
                    },
                });
            }
        } else if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            const user = await prisma.user.findFirst({
                where: { stripeCustomerId: customerId },
            });

            if (user) {
                console.log(`❌ Subscription canceled for user: ${user.id}`);
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        subscriptionStatus: 'canceled',
                        // TODO: current_period_end no longer exists in Stripe SDK
                        subscriptionEndsAt: null,
                    },
                });
            }
        }
    } catch (error) {
        console.error('Webhook processing error:', error);
        return res.status(500).json({ error: 'Webhook processing failed' });
    }

    res.json({ received: true });
};

export const verifyPaymentSession = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.body;
        // User ID is no longer required via auth middleware since this can be an unauthenticated returning page
        // const userId = (req as any).user?.userId;

        if (!sessionId) {
            return res.status(400).json({ error: 'Missing session ID' });
        }

        const stripe = getStripe();
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const sessionUserId = session.metadata?.userId;
        if (!sessionUserId) {
            return res.status(400).json({ error: 'Session has no linked user metadata' });
        }

        if (session.payment_status === 'paid') {
            const targetTier = session.metadata?.targetTier;

            console.log(`✅ [Manual Verify] Payment Confirmed! Upgrading user ${sessionUserId} to ${targetTier}`);

            // Get user immediately
            let user = await prisma.user.findUnique({
                where: { id: sessionUserId }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found in DB' });
            }

            if (targetTier && user.tier !== targetTier) {
                user = await prisma.user.update({
                    where: { id: sessionUserId },
                    data: {
                        tier: targetTier as any,
                        stripeCustomerId: session.customer as string
                    }
                });
            }

            // Re-issue JWT securely so the user auto-logs in even if changing browsers/apps
            const token = jwt.sign(
                { userId: user.id },
                env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Strip sensitive password
            const safeUser = { ...user };
            delete (safeUser as any).password;

            return res.json({ success: true, tier: targetTier || safeUser.tier, token, user: safeUser });
        }

        return res.json({ success: false, status: session.payment_status });

    } catch (error: any) {
        console.error('Verify Session Error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const createPortalSession = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const userEmail = (req as any).user?.email; // Expecting email to be added to JWT or fetched

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        // Fetch fresh user data to get stripeCustomerId
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const stripe = getStripe();
        const FRONTEND_URL = getFrontendUrl();
        let customerId = user.stripeCustomerId;

        // Fallback: If no customer ID in DB, search Stripe by email (for legacy users)
        if (!customerId) {
            console.log(`Searching Stripe for customer: ${user.email}`);
            const customers = await stripe.customers.list({
                email: user.email,
                limit: 1
            });

            if (customers.data.length > 0) {
                customerId = customers.data[0].id;
                // Save it for next time
                await prisma.user.update({
                    where: { id: userId },
                    data: { stripeCustomerId: customerId }
                });
            }
        }

        if (!customerId) {
            return res.status(400).json({ error: 'No active subscription found to manage.' });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${FRONTEND_URL}/settings`,
        });

        res.json({ url: session.url });

    } catch (error: any) {
        console.error('Portal Session Error:', error);
        res.status(500).json({ error: 'Failed to create portal session' });
    }
};
