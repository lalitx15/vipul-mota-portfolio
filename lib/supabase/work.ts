import { createServerClient } from "./server";
import type { Database } from "@/types/supabase";

export type WorkItem = Database["public"]["Tables"]["work_items"]["Row"];

export const defaultWorkItems: WorkItem[] = [
  {
    id: "work-1",
    type: "acting",
    slug: "crime-world-2022",
    title: "Crime World (Hindi Crime Drama)",
    role: "Neighbour",
    year: "2022",
    platform: "ShemarooMe",
    description:
      'Hindi crime thriller episodic drama series. Vipul Mota portrays the pivotal character "Neighbour" in Episode 2-12. Streaming nationally on ShemarooMe. Characterized by psychological tension, measured delivery, and disciplined screen presence.',
    cover_url:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1400&auto=format&fit=crop",
    external_url: "https://www.shemaroome.com",
    is_featured: true,
    status: "published",
    sort_order: 1,
    meta: {
      episode: "Episode 2-12",
      genre: "Crime / Drama / Mystery",
      language: "Hindi",
      format: "Episodic Series",
      characterNotes:
        "The Neighbour serves as a catalyst in the unfolding investigation, demanding calm under intense questioning.",
    },
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
    description:
      "Privately held business enterprise founded by Vipul Mota. Focuses on strategic wealth stewardship, corporate capital syndication, and luxury lifestyle business development across Western India. Driven by the philosophy of living king size while maintaining disciplined risk parameters.",
    cover_url:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop",
    external_url: "https://instagram.com/javigroups",
    is_featured: true,
    status: "published",
    sort_order: 2,
    meta: {
      focus: "Capital & Strategic Business Development",
      reach: "1 Million+ Network",
      city: "Mumbai, India",
      sectors: "Private Syndication, Commercial Consulting, High-Value Brand Alliances",
    },
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
    description:
      "A curated personal fashion lookbook exploring sharp Italian tailoring, hand-woven luxury textiles, and Marine Drive twilight aesthetics. Designed as a living editorial portfolio open to luxury brand campaigns, runway collaborations, and haute horlogerie endorsements.",
    cover_url:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1400&auto=format&fit=crop",
    external_url: null,
    is_featured: true,
    status: "published",
    sort_order: 3,
    meta: {
      aesthetic: "Bespoke Suiting / Modern Luxury",
      location: "Marine Drive & South Mumbai",
      palette: "Monochrome, Charcoal, Ivory, Twilight Slate",
      tailoring: "Structured Double-Breasted & Lightweight Summer Wool",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getWorkItems(): Promise<WorkItem[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("work_items")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultWorkItems;
    }

    return data as unknown as WorkItem[];
  } catch {
    return defaultWorkItems;
  }
}

export async function getWorkItemBySlug(slug: string): Promise<WorkItem | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("work_items")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) {
      const fallback = defaultWorkItems.find((w) => w.slug === slug);
      return fallback || null;
    }

    return data as unknown as WorkItem;
  } catch {
    const fallback = defaultWorkItems.find((w) => w.slug === slug);
    return fallback || null;
  }
}

export async function getAllWorkSlugs(): Promise<string[]> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("work_items")
      .select("slug")
      .eq("status", "published");

    if (data && data.length > 0) {
      return (data as unknown as { slug: string }[]).map((d) => d.slug);
    }
    return defaultWorkItems.map((d) => d.slug);
  } catch {
    return defaultWorkItems.map((d) => d.slug);
  }
}
