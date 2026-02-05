
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
    const email = 'efeaksu000@gmail.com';
    console.log(`Checking for user: ${email}...`);

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user) {
            console.log("User FOUND:");
            console.log(`ID: ${user.id}`);
            console.log(`Email: ${user.email}`);
            console.log(`Name: ${user.name}`);
            console.log(`PasswordHash: ${user.passwordHash ? 'Present' : 'MISSING'}`);
            console.log(`Tier: ${user.tier}`);
        } else {
            console.log("User NOT FOUND in database.");
        }
    } catch (e) {
        console.error("Error checking user:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
