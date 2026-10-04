import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export function createAdminClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://rgwajwjkakjqkwscyqwx.supabase.co";
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnd2Fqd2prYWtqcWt3c2N5cXd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTAyNDA0MSwiZXhwIjoyMTA2NjAwMDQxfQ.AlhjsdTTPL2y2W4yACPqCGn_8E3hEc_qte5-2j4r8G4";

  return createSupabaseClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
