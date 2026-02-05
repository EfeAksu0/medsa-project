
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

    const isMatch = await bcrypt.compare(passwordToCheck, user.passwordHash);

    if (isMatch) {
        console.log('SUCCESS: Password matches!');
    } else {
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
