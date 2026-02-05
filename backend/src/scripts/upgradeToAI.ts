import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function upgradeUser() {
    const email = 'efeaksu000@gmail.com'; // Update this if different

    console.log(`Looking for user: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    if (!user) {
        console.log('❌ User not found!');
        return;
    }

    console.log(`Found user: ${user.name} (Current tier: ${user.tier})`);

    const updated = await prisma.user.update({
        where: { id: user.id },
        data: { tier: 'MEDYSA_AI' }
    });

    console.log(`✅ User upgraded to: ${updated.tier}`);
}

upgradeUser()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
