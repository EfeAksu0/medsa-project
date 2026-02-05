import { PrismaClient, SubscriptionTier } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- UPGRADING ALL USERS TO MEDYSA AI TIER ---');

    const result = await prisma.user.updateMany({
        data: {
            tier: 'MEDYSA_AI'
        }
    });

    console.log(`Successfully upgraded ${result.count} users to Premium (MEDYSA_AI).`);
    console.log('You can now access Medysa AI with ANY account.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
