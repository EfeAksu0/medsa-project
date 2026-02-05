"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function grantFullAccess() {
    const email = 'efeaksu000@gmail.com';
    console.log(`Granting FULL ACCESS (MEDYSA_AI) to: ${email}`);
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            console.error('USER NOT FOUND in DB!');
            return;
        }
        console.log(`Current Tier: ${user.tier}`);
        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                tier: client_1.SubscriptionTier.MEDYSA_AI,
            },
        });
        console.log(`✅ SUCCESS: User upgraded to ${updatedUser.tier}`);
        console.log('User now has full access to all features.');
    }
    catch (e) {
        console.error('Error upgrading user:', e);
    }
    finally {
        await prisma.$disconnect();
    }
}
grantFullAccess();
