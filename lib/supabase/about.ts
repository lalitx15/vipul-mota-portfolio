import { createServerClient } from "./server";
import type { Database } from "@/types/supabase";

export type TimelineItem = Database["public"]["Tables"]["timeline_items"]["Row"];
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];

export interface AboutData {
  settings: Partial<SiteSettings> | null;
  timeline: TimelineItem[];
}

export const defaultTimelineItems: TimelineItem[] = [
  {
    id: "time-1",
    year: "1975",
    title: "Mumbai Heritage & Roots",
    description:
      "Born on 29 August 1975 in Mumbai, India. Raised amid the dynamic commercial heartbeat and architectural grandeur of the city, instilling a lifelong appreciation for timeless style and high-standard discipline.",
    image_url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1200&auto=format&fit=crop",
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "time-2",
    year: "2005",
    title: "Financial Advisory & Commerce",
    description:
      "Pioneering private wealth syndication, capital consulting, and corporate business development across Western India, establishing a reputation for discretion and capital preservation.",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "time-3",
    year: "2015",
    title: "Foundation of Javi Groups",
    description:
      "Established Javi Groups in Mumbai as an umbrella vehicle for wealth stewardship, commercial ventures, and style leadership. Built around the ethos of living king size while maintaining financial prudence.",
    image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop",
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "time-4",
    year: "2022",
    title: 'Screen Debut: "Crime World"',
    description:
      'Appeared on-screen in the Hindi crime thriller series "Crime World" (Episode 2-12) in the role of Neighbour, streaming nationally on ShemarooMe. A defining moment in cinematic narrative expression.',
    image_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop",
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "time-5",
    year: "2024",
    title: "Digital Authority & Influence",
    description:
      "Crossed 1 Million+ followers on Instagram (@javigroups) and launched the YouTube channel @VibewithVipulMota with the mission to build robust financial portfolios without compromising personal aesthetic.",
    image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "time-6",
    year: "2026",
    title: "The Editorial Presence & Modern Archive",
    description:
      "Unifying screen craft, bespoke fashion modeling, and high-value private network initiatives under one personal brand sanctuary, setting a new benchmark for Mumbai luxury editorial presence.",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
];

const defaultSettings: Partial<SiteSettings> = {
  site_name: "Vipul Mota",
  tagline: "Style. Wealth. Presence.",
  instagram_followers_count: "1 Million+",
  youtube_subscribers_count: "100K+",
  contact_email: "connect@javigroups.com",
  address: "Marine Drive, Mumbai, Maharashtra, India",
  finance_disclaimer:
    "Content is for inspiration and information only and is not financial advice.",
};

export async function getAboutData(): Promise<AboutData> {
  try {
    const supabase = createServerClient();

    const [settingsRes, timelineRes] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase
        .from("timeline_items")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);

    return {
      settings: (settingsRes.data as unknown as SiteSettings) || defaultSettings,
      timeline:
        (timelineRes.data as unknown as TimelineItem[])?.length
          ? (timelineRes.data as unknown as TimelineItem[])
          : defaultTimelineItems,
    };
  } catch {
    return {
      settings: defaultSettings,
      timeline: defaultTimelineItems,
    };
  }
}
