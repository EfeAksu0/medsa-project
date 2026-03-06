"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
// Only load .env file in local development (Vercel provides env vars directly)
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('4000'),
    DATABASE_URL: zod_1.z.string(), // Relaxed validation to avoid boot crashes on format issues
    JWT_SECRET: zod_1.z.string().min(1),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
});
exports.env = envSchema.parse(process.env);
