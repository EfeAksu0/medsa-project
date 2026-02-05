"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function verifySpecificUser() {
    const email = 'efeaksu000@gmail.com';
    const passwordToCheck = 'password123';
    console.log(`Checking credentials for: ${email}`);
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            console.error('USER NOT FOUND in DB!');
            return;
        }
        console.log(`User found. ID: ${user.id}`);
        console.log(`Stored Hash: ${user.passwordHash}`);
        const isMatch = await bcryptjs_1.default.compare(passwordToCheck, user.passwordHash);
        if (isMatch) {
            console.log('✅ SUCCESS: Database hash matches "password123".');
            console.log('If login still fails, the backend server is NOT connecting to this database or needs a restart.');
        }
        else {
            console.error('❌ FAILURE: Database hash DOES NOT match "password123".');
            console.log('The password reset did not persist or failed.');
        }
    }
    catch (e) {
        console.error('Error:', e);
    }
    finally {
        await prisma.$disconnect();
    }
}
verifySpecificUser();
