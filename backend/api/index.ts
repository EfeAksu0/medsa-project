// Vercel provides environment variables directly - no need for dotenv
// import dotenv from 'dotenv';
// dotenv.config();

import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';

export default async (req: VercelRequest, res: VercelResponse) => {
    return app(req, res);
};
