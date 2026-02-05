"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const aiTier = 'MEDYSA_AI';
    const email = 'medysa_coach@medysa.com';
    const password = 'password123';
    // Clean up if exists
    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            console.log('Deleting existing user to reset...');
            await prisma.user.delete({ where: { email } });
        }
    }
    catch (e) {
        console.log('User did not exist or delete failed, continuing...');
    }
    console.log('Creating fresh AI User...');
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            email,
            passwordHash: hashedPassword,
            name: 'Medysa User',
            tier: aiTier
        }
    });
    console.log('--- USER CREATED SUCCESSFULLY ---');
    console.log(`Email: ${newUser.email}`);
    console.log(`Password: ${password}`);
    console.log(`Tier: ${newUser.tier}`);
}
main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
