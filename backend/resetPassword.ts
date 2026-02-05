
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
    const email = 'efeaksu000@gmail.com';
    const newPassword = 'password123';

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { passwordHash },
        });
        console.log(`Password reset successfully for: ${user.email}`);
        console.log(`New password: ${newPassword}`);
    } catch (error) {
        console.error('Error resetting password:', error);
    }
}

resetPassword()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
