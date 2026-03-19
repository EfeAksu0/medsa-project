"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const prisma_1 = require("./prisma");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const tradeRoutes_1 = __importDefault(require("./routes/tradeRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
const modelRoutes_1 = __importDefault(require("./routes/modelRoutes"));
const trashRoutes_1 = __importDefault(require("./routes/trashRoutes"));
const journalRoutes_1 = __importDefault(require("./routes/journalRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const todoRoutes_1 = __importDefault(require("./routes/todoRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const bugRoutes_1 = __importDefault(require("./routes/bugRoutes"));
const debugRoutes_1 = __importDefault(require("./routes/debugRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const paymentController_1 = require("./controllers/paymentController");
const app = (0, express_1.default)();
// Server ready for payments
// Middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (server-to-server, Postman, etc.)
        if (!origin)
            return callback(null, true);
        const allowed = [
            'http://localhost:3000',
            'https://medysa.com',
            'https://www.medysa.com',
            'http://medysa.com',
        ];
        // Allow all Vercel preview deployments for this project
        const isVercelPreview = /^https:\/\/medysa(-[a-z0-9]+)*\.vercel\.app$/.test(origin) ||
            /^https:\/\/medysa-trading(-[a-z0-9]+)*\.vercel\.app$/.test(origin);
        if (allowed.includes(origin) || isVercelPreview) {
            callback(null, true);
        }
        else {
            console.warn(`[CORS] Blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
// app.options('*', cors()); // Potential crash source in serverless
// Stripe Webhook (Must be before express.json to get raw body)
app.post('/api/payments/webhook', express_1.default.raw({ type: 'application/json' }), paymentController_1.handleWebhook);
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '50mb' })); // Increased limit for Base64 images
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// Serve uploaded files statically
// app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Disabled for DB storage
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/trades', tradeRoutes_1.default);
app.use('/api/analytics', analyticsRoutes_1.default);
app.use('/api/accounts', accountRoutes_1.default);
app.use('/api/models', modelRoutes_1.default);
app.use('/api/journal', journalRoutes_1.default);
app.use('/api/trash', trashRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.use('/api/todos', todoRoutes_1.default);
app.use('/api/bugs', bugRoutes_1.default);
app.use('/api/debug', debugRoutes_1.default);
app.get('/api/debug/db-test', async (req, res) => {
    try {
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        res.json({
            success: true,
            message: 'Database connection successful!'
        });
    }
    catch (error) {
        console.error('DB Test Error:', error);
        res.status(500).json({
            success: false,
            error: 'Database connection failed'
        });
    }
});
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});
exports.default = app;
