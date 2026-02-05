const { PrismaClient } = require('@prisma/client');
const bcryptJs = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
    const email = 'efeaksu000@gmail.com';
    const newPassword = 'newpassword123'; // Change this to whatever you want

    try {
        // Hash the new password
        const hashedPassword = await bcryptJs.hash(newPassword, 10);

        // Update the user's password
        const user = await prisma.user.update({
            where: { email },
            data: { passwordHash: hashedPassword },
        });

        console.log('✅ Password reset successful!');
        console.log(`Email: ${email}`);
        console.log(`New password: ${newPassword}`);
        console.log(`User ID: ${user.id}`);
    } catch (error) {
        console.error('❌ Error resetting password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetPassword();
