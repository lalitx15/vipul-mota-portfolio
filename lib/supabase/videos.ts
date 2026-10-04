import { createServerClient } from "./server";
import type { Database } from "@/types/supabase";

export type VideoItem = Database["public"]["Tables"]["videos"]["Row"];

const reelTitles = [
  "Signature Presence & Italian Sartorial Silhouette",
  "Screen Repertoire & Crime World Dramatic Focus",
  "Marine Drive Twilight Drive & Luxury Lifestyle",
  "Private Equity Syndication & Capital Stewardship",
  "High-Contrast Fashion Editorial Lookbook Reel",
  "Building Financial Authority Without Compromising Image",
  "Cinema Craft & Character Monologue Study",
  "Live King Size: Executive Networking & Presence",
  "Bespoke Tailoring & Evening Velvet Aesthetics",
  "Mumbai Harbor Horizon & Private Advisory",
  "Camera Stills & Directional Screen Discipline",
  "Inner Circle Briefing: Vision, Discipline, Equity",
  "Classic Double-Breasted Cut & Sarto Details",
  "Colonial Mumbai Architecture & Sartorial Promenade",
  "The Philosophy of Presence: Style is Discipline",
];

const reelCategories = [
  "Reels",
  "Screen Craft",
  "Lifestyle",
  "Wealth & Strategy",
  "Fashion & Lookbook",
  "Wealth & Strategy",
  "Screen Craft",
  "Lifestyle",
  "Fashion & Lookbook",
  "Lifestyle",
  "Screen Craft",
  "Inner Circle",
  "Fashion & Lookbook",
  "Lifestyle",
  "Wealth & Strategy",
];

export const defaultVideos: VideoItem[] = Array.from({ length: 15 }, (_, idx) => {
  const pad = String(idx + 1).padStart(2, "0");
  const posterPad = String((idx % 20) + 1).padStart(2, "0");

  return {
    id: `reel-${pad}`,
    title: `Reel #${pad} — ${reelTitles[idx]}`,
    platform: "instagram",
    video_id: `reel-${pad}`,
    url: `/videos/reel-${pad}.mp4`,
    thumbnail_url: `/library/vipul-${posterPad}.jpg`,
    category: reelCategories[idx] || "Reels",
    is_featured: idx === 0,
    members_only: false,
    sort_order: idx + 1,
    created_at: new Date().toISOString(),
  };
});

export async function getVideos(): Promise<VideoItem[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("sort_order", { ascending: true });

    if (
      error ||
      !data ||
      data.length === 0 ||
      data.some((v: any) => v.url?.includes("youtube") || v.thumbnail_url?.includes("unsplash"))
    ) {
      return defaultVideos;
    }

    return data as unknown as VideoItem[];
  } catch {
    return defaultVideos;
  }
}
