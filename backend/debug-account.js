const API_URL = 'http://localhost:4000/api';

async function testAccountCreation() {
    try {
        const email = `test.debug.fetch.${Date.now()}@example.com`;
        const password = 'Password@123';
        const name = 'DebugUser';

        console.log(`1. Registering user: ${email}`);

        let response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        });

        let data = await response.json();
        let token;

        if (response.ok) {
            token = data.token;
            console.log('   Registration successful. Token acquired.');
        } else {
            console.log('   Registration failed, trying login...');
            response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            data = await response.json();
            if (!response.ok) {
                console.error('   Login failed:', data);
                return;
            }
            token = data.token;
            console.log('   Login successful. Token acquired.');
        }

        // 2. Create Account
        console.log('\n2. Creating an account...');
        response = await fetch(`${API_URL}/accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: "Debug Account Fetch",
                type: "LIVE",
                currentBalance: 10000,
                goalBalance: 20000
            })
        });

        const account = await response.json();
        if (response.ok) {
            console.log('   Account creation SUCCESS!');
            console.log('   Response:', JSON.stringify(account, null, 2));
        } else {
            console.error('\n❌ Account creation FAILED!');
            console.error('   Status:', response.status);
            console.error('   Error:', JSON.stringify(account, null, 2));
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
}

testAccountCreation();
