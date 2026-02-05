"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const email = 'medysa_coach@medysa.com';
    const passwordToCheck = 'password123';
    console.log(`Verifying login for: ${email}`);
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        console.log('User NOT found.');
        return;
    }
    console.log('User found.');
    console.log('Stored Hash:', user.passwordHash);
    const isMatch = await bcryptjs_1.default.compare(passwordToCheck, user.passwordHash);
    if (isMatch) {
        console.log('SUCCESS: Password matches!');
    }
    else {
        console.log('FAILURE: Password does NOT match.');
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
