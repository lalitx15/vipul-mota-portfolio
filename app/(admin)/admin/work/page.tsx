import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { WorkManager } from "@/components/admin/WorkManager";
import type { WorkItem } from "@/lib/supabase/work";
import { defaultWorkItems } from "@/lib/supabase/work";

export const metadata: Metadata = {
  title: "Work & Ventures Manager — Vipul Mota Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminWorkPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("work_items")
    .select("*")
    .order("sort_order", { ascending: true });

  const items =
    data && data.length > 0 ? (data as unknown as WorkItem[]) : defaultWorkItems;

  return <WorkManager initialItems={items} />;
}
