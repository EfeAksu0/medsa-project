import { prisma } from '../prisma';

async function main() {
    console.log("🔄 Setting up Supabase Auth Trigger...");

    try {
        // 1. Create the function
        await prisma.$executeRawUnsafe(`
      create or replace function public.handle_new_user()
      returns trigger
      language plpgsql
      security definer set search_path = public
      as $$
      begin
        insert into public.users (id, email, "passwordHash", name)
        values (new.id, new.email, 'supabase_managed', new.raw_user_meta_data->>'name');
        return new;
      end;
      $$;
    `);
        console.log("✅ Function 'handle_new_user' created.");

        // 2. Create the trigger
        // We drop it first to avoid "already exists" errors if run multiple times
        await prisma.$executeRawUnsafe(`
      drop trigger if exists on_auth_user_created on auth.users;
    `);

        await prisma.$executeRawUnsafe(`
      create trigger on_auth_user_created
        after insert on auth.users
        for each row execute procedure public.handle_new_user();
    `);
        console.log("✅ Trigger 'on_auth_user_created' created.");

    } catch (error) {
        console.error("❌ Error setting up trigger:", error);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
