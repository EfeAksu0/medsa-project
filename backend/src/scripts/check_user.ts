
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { email },
            data: { passwordHash }
        });
        console.log('Password updated successfully.');

    } else {
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
