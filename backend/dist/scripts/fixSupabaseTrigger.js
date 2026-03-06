"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../prisma");
async function main() {
    console.log("🛠️ Repairing Supabase Auth Trigger (Function + Hook)...");
    try {
        // 1. Dropping existing trigger to ensure clean slate
        // We use a DO block to safely drop if exists (Postgres < 9 doesn't support DROP TRIGGER IF EXISTS cleanly in all contexts, but SupabasePG is modern)
        await prisma_1.prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    `);
        console.log("Creation: Dropped old trigger (if any).");
        // 2. Create or Replace the Function (The Logic)
        // explicitly setting updatedAt to now() as verified in schema
        await prisma_1.prisma.$executeRawUnsafe(`
      create or replace function public.handle_new_user()
      returns trigger
      language plpgsql
      security definer set search_path = public
      as $$
      begin
        insert into public.users (id, email, "passwordHash", name, "updatedAt")
        values (
          new.id, 
          new.email, 
          'supabase_managed', 
          new.raw_user_meta_data->>'name',
          now()
        );
        return new;
      end;
      $$;
    `);
        console.log("Logic: Function 'handle_new_user' updated.");
        // 3. Create the Trigger (The Hook)
        // Firing AFTER INSERT on auth.users
        await prisma_1.prisma.$executeRawUnsafe(`
      CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    `);
        console.log("Hook: Trigger 'on_auth_user_created' created successfully.");
    }
    catch (error) {
        console.error("❌ Error fixing trigger:", error.message);
    }
}
main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma_1.prisma.$disconnect());
