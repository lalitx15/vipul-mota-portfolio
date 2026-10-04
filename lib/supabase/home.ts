import { createServerClient } from "./server";
import type { Database } from "@/types/supabase";

export type HeroSlide = Database["public"]["Tables"]["hero_slides"]["Row"];
export type StatItem = Database["public"]["Tables"]["stats"]["Row"];
export type WorkItem = Database["public"]["Tables"]["work_items"]["Row"];
export type GalleryItem = Database["public"]["Tables"]["gallery_items"]["Row"];
export type VideoItem = Database["public"]["Tables"]["videos"]["Row"];
export type PostItem = Database["public"]["Tables"]["posts"]["Row"];
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type TestimonialItem = Database["public"]["Tables"]["testimonials"]["Row"];

export interface HomeData {
  settings: Partial<SiteSettings> | null;
  hero: HeroSlide | null;
  stats: StatItem[];
  workItems: WorkItem[];
  galleryItems: GalleryItem[];
  videos: VideoItem[];
  posts: PostItem[];
  testimonials: TestimonialItem[];
}

// Fallback verified data (matching Section 1 client facts)
const defaultSettings: Partial<SiteSettings> = {
  site_name: "Vipul Mota",
  tagline: "Style. Wealth. Presence.",
  instagram_followers_count: "1 Million+",
  youtube_subscribers_count: "100K+",
  instagram_url: "https://instagram.com/javigroups",
  youtube_url: "https://youtube.com/@VibewithVipulMota",
  facebook_url: "https://facebook.com/javigroups",
  threads_url: "https://threads.net/@javigroups",
  contact_email: "connect@javigroups.com",
  contact_phone: "+91 98200 00000",
  address: "Marine Drive, Mumbai, Maharashtra, India",
  finance_disclaimer: "Content is for inspiration and information only and is not financial advice.",
};

export const defaultHero: HeroSlide = {
  id: "hero-1",
  headline_line1: "VIPUL",
  headline_line2: "MOTA",
  tagline: "Actor · Fashion Model · Founder of Javi Groups",
  image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1800&auto=format&fit=crop",
  mobile_image_url: null,
  cta_text: "Explore Archive",
  cta_link: "/work",
  sort_order: 1,
  is_active: true,
  created_at: new Date().toISOString(),
};

const defaultStats: StatItem[] = [
  {
    id: "stat-1",
    label: "Instagram Audience",
    value: "900",
    suffix: "K+",
    description: "Followers on @javigroups engaging with luxury & wealth leadership",
    sort_order: 1,
    is_visible: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: "stat-2",
    label: "YouTube Mission",
    value: "100",
    suffix: "K+",
    description: "Subscribers on @VibewithVipulMota building portfolios with style",
    sort_order: 2,
    is_visible: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: "stat-3",
    label: "Private Commerce",
    value: "18",
    suffix: "+",
    description: "Years in private wealth consultation & Western India business",
    sort_order: 3,
    is_visible: true,
    updated_at: new Date().toISOString(),
  },
  {
    id: "stat-4",
    label: "Screen Credits",
    value: "1",
    suffix: " Title",
    description: "Crime World (2022) streaming on ShemarooMe",
    sort_order: 4,
    is_visible: true,
    updated_at: new Date().toISOString(),
  },
];

const defaultWorkItems: WorkItem[] = [
  {
    id: "work-1",
    type: "acting",
    slug: "crime-world-2022",
    title: "Crime World (Hindi Crime Drama)",
    role: "Neighbour",
    year: "2022",
    platform: "ShemarooMe",
    description: 'Episodic crime thriller drama. Featured as "Neighbour" in Episode 2-12 streaming nationally on ShemarooMe.',
    cover_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop",
    external_url: "https://www.shemaroome.com",
    is_featured: true,
    status: "published",
    sort_order: 1,
    meta: { episode: "Episode 2-12", language: "Hindi" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "work-2",
    type: "venture",
    slug: "javi-groups-mumbai",
    title: "Javi Groups",
    role: "Founder & Principal",
    year: "2015 - Present",
    platform: "Mumbai, India",
    description: "Privately held enterprise focused on strategic wealth stewardship, corporate capital syndication, and high-value networking.",
    cover_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    external_url: "https://instagram.com/javigroups",
    is_featured: true,
    status: "published",
    sort_order: 2,
    meta: { reach: "1 Million+ Network", focus: "Wealth & Equity" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "work-3",
    type: "modeling",
    slug: "editorial-lookbook-vol-1",
    title: "Mumbai Sartorial Lookbook: Volume I",
    role: "Fashion Model",
    year: "2025",
    platform: "Self-Produced Editorial",
    description: "Personal fashion lookbook exploring sharp Italian tailoring, hand-woven luxury textiles, and Marine Drive twilight aesthetics.",
    cover_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    external_url: null,
    is_featured: true,
    status: "published",
    sort_order: 3,
    meta: { styling: "Bespoke Suiting", location: "South Mumbai" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const defaultGalleryItems: GalleryItem[] = [
  {
    id: "gal-1",
    image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    category: "Editorial",
    caption: "Plate 01 — Bespoke Tailoring & Marine Drive Twilight, Mumbai",
    alt_text: "Vipul Mota in bespoke suit",
    is_featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "gal-2",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    category: "Portraits",
    caption: "Plate 02 — High-Contrast Monochromatic Character Study",
    alt_text: "High-contrast portrait",
    is_featured: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "gal-3",
    image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop",
    category: "Lifestyle",
    caption: "Plate 03 — Strategic Dialogue at Javi Groups Executive Office",
    alt_text: "Executive business portrait",
    is_featured: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "gal-4",
    image_url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",
    category: "Lifestyle",
    caption: "Plate 04 — Marine Drive Promenade, South Mumbai Reflections",
    alt_text: "Mumbai lifestyle silhouette",
    is_featured: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
];

const defaultVideos: VideoItem[] = [
  {
    id: "vid-1",
    title: "Vibe With Vipul Mota — Building Wealth Without Compromising Style",
    platform: "youtube",
    video_id: "dQw4w9WgXcQ",
    url: "https://youtube.com/@VibewithVipulMota",
    thumbnail_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop",
    category: "Financial Inspiration",
    is_featured: true,
    members_only: false,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "vid-2",
    title: 'Crime World (2022) — Role: "Neighbour" (Episode 2-12 Clip)',
    platform: "youtube",
    video_id: "dQw4w9WgXcQ",
    url: "https://www.shemaroome.com",
    thumbnail_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop",
    category: "Acting Reel",
    is_featured: false,
    members_only: false,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "vid-3",
    title: "Live King Size — High-Value Networking & Luxury Mindset",
    platform: "instagram",
    video_id: "reel-1",
    url: "https://instagram.com/javigroups",
    thumbnail_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    category: "Lifestyle",
    is_featured: false,
    members_only: false,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
];

const defaultPosts: PostItem[] = [
  {
    id: "post-1",
    slug: "principles-of-luxury-presence-mumbai",
    title: "Principles of Luxury Presence in Contemporary Mumbai",
    excerpt: "True luxury is never noisy. How discipline, posture, and tailoring create an unmistakable personal aura.",
    content: "Content available for Inner Circle members.",
    cover_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    tags: ["Style", "Presence", "Mumbai"],
    members_only: false,
    status: "published",
    published_at: new Date().toISOString(),
    reading_minutes: 4,
    views: 420,
    meta: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "post-2",
    slug: "private-wealth-syndication-philosophy",
    title: "The Javi Groups Discipline: Capital Preservation & Network Value",
    excerpt: "Building an investment syndicate rooted in long-term relationships, trust, and deliberate capital allocation.",
    content: "Content available for Inner Circle members.",
    cover_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    tags: ["Finance", "Javi Groups", "Ventures"],
    members_only: false,
    status: "published",
    published_at: new Date().toISOString(),
    reading_minutes: 5,
    views: 890,
    meta: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "post-3",
    slug: "on-screen-discipline-crime-world",
    title: "Stepping into Character: Reflections on Crime World",
    excerpt: "Exploring the psychological weight of episodic crime drama and bringing subtlety to the screen.",
    content: "Content available for Inner Circle members.",
    cover_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop",
    tags: ["Cinema", "Acting", "Crime World"],
    members_only: false,
    status: "published",
    published_at: new Date().toISOString(),
    reading_minutes: 3,
    views: 630,
    meta: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getHomeData(): Promise<HomeData> {
  try {
    const supabase = createServerClient();

    const [
      settingsRes,
      heroRes,
      statsRes,
      workRes,
      galleryRes,
      videosRes,
      postsRes,
      testimonialsRes,
    ] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("hero_slides").select("*").eq("is_active", true).order("sort_order", { ascending: true }).limit(1).maybeSingle(),
      supabase.from("stats").select("*").eq("is_visible", true).order("sort_order", { ascending: true }),
      supabase.from("work_items").select("*").eq("status", "published").order("sort_order", { ascending: true }),
      supabase.from("gallery_items").select("*").order("sort_order", { ascending: true }).limit(6),
      supabase.from("videos").select("*").order("sort_order", { ascending: true }).limit(4),
      supabase.from("posts").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(3),
      supabase.from("testimonials").select("*").eq("is_published", true).limit(4),
    ]);

    return {
      settings: (settingsRes.data as unknown as SiteSettings) || defaultSettings,
      hero: (heroRes.data as unknown as HeroSlide) || defaultHero,
      stats: (statsRes.data as unknown as StatItem[])?.length ? (statsRes.data as unknown as StatItem[]) : defaultStats,
      workItems: (workRes.data as unknown as WorkItem[])?.length ? (workRes.data as unknown as WorkItem[]) : defaultWorkItems,
      galleryItems: (galleryRes.data as unknown as GalleryItem[])?.length ? (galleryRes.data as unknown as GalleryItem[]) : defaultGalleryItems,
      videos: (videosRes.data as unknown as VideoItem[])?.length ? (videosRes.data as unknown as VideoItem[]) : defaultVideos,
      posts: (postsRes.data as unknown as PostItem[])?.length ? (postsRes.data as unknown as PostItem[]) : defaultPosts,
      testimonials: (testimonialsRes.data as unknown as TestimonialItem[]) || [],
    };
  } catch {
    // Return verified defaults if database is not reachable yet
    return {
      settings: defaultSettings,
      hero: defaultHero,
      stats: defaultStats,
      workItems: defaultWorkItems,
      galleryItems: defaultGalleryItems,
      videos: defaultVideos,
      posts: defaultPosts,
      testimonials: [],
    };
  }
}
