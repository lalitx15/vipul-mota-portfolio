import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

export function createClient() {
  const cookieStore = cookies();

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://rgwajwjkakjqkwscyqwx.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnd2Fqd2prYWtqcWt3c2N5cXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMjQwNDEsImV4cCI6MjEwNjYwMDA0MX0.ueaBqs9XYmLS16oAwT214nm9RaUcBoujJDWvyluNqvc";

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as any)
          );
        } catch {
          // Can be safely ignored if called from a Server Component
        }
      },
    },
  });
}

export { createClient as createServerClient };

