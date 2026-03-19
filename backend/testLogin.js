const go = async () => {
    try {
        console.log("Testing Vercel Login API...");
        const req = await fetch("https://medysa-api.vercel.app/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "test@example.com", password: "wrongpassword123" })
        });

        const text = await req.text();
        console.log("Status:", req.status);
        console.log("Response:", text);
    } catch (e) {
        console.error(e);
    }
};
go();
