
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAuthFlow() {
    const testEmail = `test_auth_${Date.now()}@example.com`;
    const testPassword = 'SecurePassword123!';

    console.log(`Starting Auth Flow Verification`);
    console.log(`Test Email: ${testEmail}`);
    console.log(`Test Password: ${testPassword}`);

    // 1. Simulate Registration
    console.log('\n--- Step 1: Registration ---');
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(testPassword, salt);

        const user = await prisma.user.create({
            data: {
                email: testEmail, // Intentionally using mixed case logic to test validity if needed
                name: 'Test User',
                passwordHash: passwordHash,
                tier: 'KNIGHT'
            }
        });
        console.log(`[SUCCESS] User created with ID: ${user.id}`);
        console.log(`Stored Hash: ${user.passwordHash.substring(0, 20)}...`);

        // 2. Simulate Login (Success Case)
        console.log('\n--- Step 2: Login (Correct Password) ---');
        const retrievedUser = await prisma.user.findUnique({ where: { email: testEmail } });

        if (!retrievedUser) {
            console.error('[FAIL] User not found for login');
            return;
        }

        const isMatch = await bcrypt.compare(testPassword, retrievedUser.passwordHash);
        if (isMatch) {
            console.log('[SUCCESS] Password MATCHES');
        } else {
            console.error('[FAIL] Password DOES NOT MATCH');
        }

        // 3. Simulate Login (Wrong Password)
        console.log('\n--- Step 3: Login (Wrong Password) ---');
        const wrongMatch = await bcrypt.compare('WrongPassword', retrievedUser.passwordHash);
        if (!wrongMatch) {
            console.log('[SUCCESS] Wrong password correctly rejected');
        } else {
            console.error('[FAIL] Wrong password ACCEPTED (Security Risk!)');
        }

    } catch (e) {
        console.error('[ERROR] Auth flow failed:', e);
    } finally {
        // Cleanup
        await prisma.user.deleteMany({ where: { email: testEmail } });
        await prisma.$disconnect();
    }
}

testAuthFlow();
