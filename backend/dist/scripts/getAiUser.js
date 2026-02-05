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
    // Try to find an existing AI user
    const existingUser = await prisma.user.findFirst({
        where: { tier: aiTier }
    });
    if (existingUser) {
        console.log('--- EXISTING AI USER FOUND ---');
        console.log(`Email: ${existingUser.email}`);
        // If we found the specific user I created before, I know the password
        if (existingUser.email === 'ai_admin@medysa.com') {
            console.log('Password: password123');
        }
        else if (existingUser.email === 'medysa_ai@test.com') {
            console.log('Password: password123');
        }
        else {
            console.log('Password: Unknown (Found existing user, but not one I just created)');
        }
        return;
    }
    // If not found, create one
    console.log('--- NO AI USER FOUND. CREATING ONE... ---');
    const email = 'medysa_ai@test.com';
    const password = 'password123';
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            email,
            passwordHash: hashedPassword, // CORRECTED FIELD NAME based on common patterns, checking schema next to be sure
            name: 'Medysa Tester',
            tier: aiTier
        }
    });
    console.log('--- NEW AI USER CREATED ---');
    console.log(`Email: ${newUser.email}`);
    console.log(`Password: ${password}`);
}
main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
