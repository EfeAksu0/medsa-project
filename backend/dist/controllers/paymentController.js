"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.createCheckoutSession = void 0;
const prisma_1 = require("../prisma");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3002';
const createCheckoutSession = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        let priceAmount = 0;
        let productName = '';
        let targetTier = '';
        if (planId === 'knight') {
            priceAmount = 999; // $9.99
            productName = 'Knighthood Plan';
            targetTier = 'KNIGHT';
        }
        else if (planId === 'ai') {
            priceAmount = 1499; // $14.99
            productName = 'Medysa AI Plan';
            targetTier = 'MEDYSA_AI';
        }
        else {
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
    }
    catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ error: 'Payment initialization failed' });
    }
};
exports.createCheckoutSession = createCheckoutSession;
const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!sig || !endpointSecret) {
        return res.status(400).send('Webhook Error: Missing signature or secret');
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        return res.status(400).send(`Webhook Signature Verification Failed: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const targetTier = session.metadata?.targetTier;
        if (userId && targetTier) {
            console.log(`✅ Payment Successful! Upgrading user ${userId} to ${targetTier}`);
            await prisma_1.prisma.user.update({
                where: { id: userId },
                data: {
                    tier: targetTier, // Cast to enum if needed
                },
            });
        }
    }
    res.json({ received: true });
};
exports.handleWebhook = handleWebhook;
