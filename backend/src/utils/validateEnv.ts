import { z } from 'zod';
import dotenv from 'dotenv';

// Only load .env file in local development (Vercel provides env vars directly)
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}


const envSchema = z.object({
    PORT: z.string().default('4000'),
    DATABASE_URL: z.string(), // Relaxed validation to avoid boot crashes on format issues
    JWT_SECRET: z.string().min(1),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envSchema.parse(process.env);
