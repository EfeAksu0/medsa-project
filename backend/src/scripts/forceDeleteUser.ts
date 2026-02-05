
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndFix() {
    const email = 'efeaksu000@gmail.com';
    console.log(`Checking for user: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    if (user) {
        console.log(`❌ User FOUND (ID: ${user.id}). This is why registration fails.`);
        console.log('Attempting to FORCE DELETE now...');

        try {
            await prisma.user.delete({
                where: { id: user.id }
            });
            console.log('✅ User DELETED successfully. You can now register again.');
        } catch (err) {
            console.error('❌ Delete Failed:', err);
        }
    } else {
        console.log('✅ User NOT found. The email is free to use.');
    }
}

checkAndFix()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
