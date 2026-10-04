import { createClient } from "./server";
import type { Database } from "@/types/supabase";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export async function getCurrentUser() {
  const supabase = createClient();
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export async function getCurrentProfile(): Promise<{
  user: Awaited<ReturnType<typeof getCurrentUser>>;
  profile: ProfileRow | null;
  isAdmin: boolean;
}> {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, profile: null, isAdmin: false };
  }

  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const profile = data as ProfileRow | null;
  const isAdmin = profile?.role === "admin" && profile?.status === "active";

  return { user, profile: profile || null, isAdmin };
}
