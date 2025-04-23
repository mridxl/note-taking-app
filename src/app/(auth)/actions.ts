"use server";

import { createClient } from "@/lib/supabase/server";
import { handleError } from "@/lib/utils";
import { loginSchema, registerSchema } from "@/lib/schemas";

type AuthAction = {
  error: string | null;
};

export async function login(formData: FormData): Promise<AuthAction> {
  try {
    const supabase = await createClient();

    const { success, data, error } = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!success) {
      throw new Error(error.errors[0]!.message);
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (loginError) {
      throw loginError;
    }
    return { error: null };
  } catch (error) {
    return handleError(error);
  }
}

export async function signup(formData: FormData): Promise<AuthAction> {
  try {
    const supabase = await createClient();
    const { success, data, error } = registerSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!success) {
      throw new Error(error.errors[0]!.message);
    }

    const { error: signupError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (signupError) {
      throw signupError;
    }

    return {
      error: null,
    };
  } catch (error) {
    return handleError(error);
  }
}

export async function signInWithGoogle() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/notes`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      throw error;
    }
    return { error: null, url: data.url };
  } catch (error) {
    return {
      error: handleError(error).error,
      url: null,
    };
  }
}

export async function signout(formData: FormData): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
