import { prisma } from '../prisma';

async function main() {
    console.log("🏓 Supabase Keep-Alive Ping...");

    try {
        // Simple query to keep the project active
        const userCount = await prisma.user.count();
        console.log(`✅ Database is alive! Current user count: ${userCount}`);

        // Also do a raw query to touch the database
        const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
        console.log("✅ DB timestamp:", result);

    } catch (error: any) {
        console.error("❌ Error:", error.message);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
