import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import path from 'path';
import { prisma } from './prisma';

import authRoutes from './routes/authRoutes';
import tradeRoutes from './routes/tradeRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import accountRoutes from './routes/accountRoutes';
import modelRoutes from './routes/modelRoutes';
import trashRoutes from './routes/trashRoutes';
import journalRoutes from './routes/journalRoutes';
import aiRoutes from './routes/aiRoutes';
import todoRoutes from './routes/todoRoutes';
import uploadRoutes from './routes/uploadRoutes';
import bugRoutes from './routes/bugRoutes';
import debugRoutes from './routes/debugRoutes';

import paymentRoutes from './routes/paymentRoutes';
import { handleWebhook } from './controllers/paymentController';

const app = express();
// Server ready for payments

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://medysa-trading.vercel.app",
        "https://medysa-trading.vercel.app/"
    ],
    credentials: true,
}));
// app.options('*', cors()); // Potential crash source in serverless

// Stripe Webhook (Must be before express.json to get raw body)
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' })); // Increased limit for Base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files statically
// app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Disabled for DB storage

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/trash', trashRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/bugs', bugRoutes);
app.use('/api/debug', debugRoutes);

app.get('/api/debug/db-test', async (req: Request, res: Response) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            success: true,
            message: 'Database connection successful!'
        });
    } catch (error: any) {
        console.error('DB Test Error:', error);
        res.status(500).json({
            success: false,
            error: 'Database connection failed'
        });
    }
});

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found' });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

export default app;
