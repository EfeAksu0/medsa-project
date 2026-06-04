
import { PrismaClient, SubscriptionTier } from '@prisma/client';

const prisma = new PrismaClient();

async function grantAccess() {
    const userId = '46edc598-2d4d-4851-8c25-08d376e80e7a';
    const email = 'bmgriffs@gmail.com';

    console.log(`Granting 1 Month Access to User: ${email} (${userId})`);

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: userId },
                    { email: email }
                ]
            },
        });

        if (!user) {
            console.error('USER NOT FOUND in DB!');
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                tier: SubscriptionTier.MEDYSA_AI,
                subscriptionStatus: 'active',
                subscriptionEndsAt: nextMonth,
            },
        });

        console.log(`✅ SUCCESS: User ${updatedUser.email} upgraded to ${updatedUser.tier}`);
        console.log(`Access valid until: ${updatedUser.subscriptionEndsAt}`);

    } catch (e) {
        console.error('Error upgrading user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

grantAccess();
