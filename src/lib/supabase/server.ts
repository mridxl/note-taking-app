import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type Database } from "./db.types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );
}

export async function getUser() {
  const { auth } = await createClient();
  const userObj = await auth.getUser();

  if (userObj.error) {
    return null;
  }

  return userObj.data.user;
}
