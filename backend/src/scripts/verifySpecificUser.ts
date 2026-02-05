
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

        const isMatch = await bcrypt.compare(passwordToCheck, user.passwordHash);

        if (isMatch) {
            console.log('✅ SUCCESS: Database hash matches "password123".');
            console.log('If login still fails, the backend server is NOT connecting to this database or needs a restart.');
        } else {
            console.error('❌ FAILURE: Database hash DOES NOT match "password123".');
            console.log('The password reset did not persist or failed.');
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

verifySpecificUser();
