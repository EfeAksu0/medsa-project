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
    const newPassword = 'password123';
    console.log(`Checking for user: ${email}`);
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (user) {
        console.log('User found:', user);
        console.log(`Resetting password to: ${newPassword}`);
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(newPassword, salt);
        await prisma.user.update({
            where: { email },
            data: { passwordHash }
        });
        console.log('Password updated successfully.');
    }
    else {
        console.log('User NOT found.');
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
