import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { AboutTimelineManager } from "@/components/admin/AboutTimelineManager";
import type { TimelineItem } from "@/lib/supabase/about";
import { defaultTimelineItems } from "@/lib/supabase/about";

export const metadata: Metadata = {
  title: "About & Journey Manager — Vipul Mota Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("timeline_items")
    .select("*")
    .order("sort_order", { ascending: true });

  const milestones =
    data && data.length > 0
      ? (data as unknown as TimelineItem[])
      : defaultTimelineItems;

  return <AboutTimelineManager initialMilestones={milestones} />;
}
