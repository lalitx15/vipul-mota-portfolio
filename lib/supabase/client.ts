import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (clientInstance) return clientInstance;

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://rgwajwjkakjqkwscyqwx.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnd2Fqd2prYWtqcWt3c2N5cXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMjQwNDEsImV4cCI6MjEwNjYwMDA0MX0.ueaBqs9XYmLS16oAwT214nm9RaUcBoujJDWvyluNqvc";

  clientInstance = createBrowserClient<Database>(url, key);
  return clientInstance;
}

export { createClient as createBrowserClient };

