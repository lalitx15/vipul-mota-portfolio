import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/user";
import { getMemberDashboardData } from "@/lib/supabase/member";
import { MemberDashboardContainer } from "@/components/member";

export const metadata: Metadata = {
  title: "Member Sanctuary & Archive — Vipul Mota",
  description:
    "Inner Circle member dashboard. Manage executive profile parameters, review booking inquiries, inspect saved lookbook plates, and access exclusive media.",
};

export const dynamic = "force-dynamic";

export default async function MemberDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/member");
  }

  const data = await getMemberDashboardData(user.id);

  return <MemberDashboardContainer data={data} />;
}
