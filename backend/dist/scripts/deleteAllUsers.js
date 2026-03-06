"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../prisma");
async function main() {
    console.log("🔥 DELETING ALL USERS (Fresh Start)...");
    try {
        // 1. Delete from public.users (Application Data)
        const deletedPublic = await prisma_1.prisma.user.deleteMany({});
        console.log(`✅ Deleted ${deletedPublic.count} users from public.users`);
        // 2. Delete from auth.users (Supabase Auth System) via Raw SQL
        // This is required because Supabase stores the "Login" credentials here.
        // If you don't delete this, you can't reuse the email.
        await prisma_1.prisma.$executeRawUnsafe(`TRUNCATE TABLE auth.users CASCADE;`);
        console.log("✅ TRUNCATED auth.users (Cascading delete)");
    }
    catch (error) {
        console.error("❌ Error deleting users:", error.message);
    }
}
main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma_1.prisma.$disconnect());
