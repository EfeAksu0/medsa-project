import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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
    } catch (e) {
        console.log('User did not exist or delete failed, continuing...');
    }

    console.log('Creating fresh AI User...');
    const hashedPassword = await bcrypt.hash(password, 10);

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
