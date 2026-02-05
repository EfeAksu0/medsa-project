import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { setupDiscordBot } from './discord';

const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        // Initialize Discord Bot
        await setupDiscordBot();

        // Database connection will go here later

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
