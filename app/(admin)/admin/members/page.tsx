import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/user";
import { MemberManager, type MemberProfile } from "@/components/admin/MemberManager";

export const metadata: Metadata = {
  title: "Member Roster & Registry — Vipul Mota Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const supabase = createServerClient();
  const { user } = await getCurrentProfile();

  // Fetch all registered user profiles
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const initialMembers: MemberProfile[] = (profilesData as unknown as MemberProfile[]) || [];

  return <MemberManager initialMembers={initialMembers} currentAdminId={user?.id} />;
}
