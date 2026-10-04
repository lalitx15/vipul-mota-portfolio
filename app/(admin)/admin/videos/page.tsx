import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { VideoManager } from "@/components/admin/VideoManager";
import type { VideoItem } from "@/lib/supabase/videos";
import { defaultVideos } from "@/lib/supabase/videos";

export const metadata: Metadata = {
  title: "Video Manager — Vipul Mota Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("videos")
    .select("*")
    .order("sort_order", { ascending: true });

  const videos = (data && data.length > 0 ? (data as unknown as VideoItem[]) : defaultVideos);

  return <VideoManager initialVideos={videos} />;
}
