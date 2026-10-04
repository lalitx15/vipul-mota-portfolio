import { createServerClient } from "./server";
import type { Database } from "@/types/supabase";

export type GalleryItem = Database["public"]["Tables"]["gallery_items"]["Row"];

const galleryCaptions = [
  "Monochrome Tailoring & High-Contrast Study",
  "Italian Bespoke Charcoal Blazer Silhouette",
  "Marine Drive Twilight Horizon & Linen",
  "Midnight Structured Lapel & Sarto Craft",
  "The Architecture of Private Capital & Advisory",
  "Daylight Study in Fine Stone & Ivory",
  "On-Screen Character Intensity & Screen Craft",
  "High-Value Executive Gathering & Networking",
  "Classic Black-Tie Evening Lookbook Plate",
  "Sartorial Precision & Luxury Horology",
  "Colonial South Mumbai Boulevard Promenade",
  "Dramatic Cinematic Focus & Presence",
  "Double-Breasted Bespoke Ensemble",
  "Production Stills & Character Immersion",
  "Structured Italian Overcoat & Wool Texture",
  "Arabian Sea Sunset & Golden Hour Light",
  "Editorial High-Contrast Chiaroscuro Portrait",
  "Private Venture Forum & Wealth Inspiration",
  "Expressive Dramatic Gaze & Actor Craft",
  "Signature Vipul Mota Master Visual Plate",
];

const galleryCategories: ("Portraits" | "Editorial" | "Lifestyle" | "Events" | "Behind the scenes")[] = [
  "Portraits",
  "Editorial",
  "Lifestyle",
  "Portraits",
  "Lifestyle",
  "Editorial",
  "Portraits",
  "Events",
  "Editorial",
  "Editorial",
  "Lifestyle",
  "Portraits",
  "Editorial",
  "Behind the scenes",
  "Editorial",
  "Lifestyle",
  "Portraits",
  "Events",
  "Portraits",
  "Editorial",
];

export const defaultGalleryItems: GalleryItem[] = Array.from({ length: 20 }, (_, idx) => {
  const pad = String(idx + 1).padStart(2, "0");
  return {
    id: `gal-${pad}`,
    image_url: `/library/vipul-${pad}.jpg`,
    category: galleryCategories[idx] || "Editorial",
    caption: `Plate ${pad} — ${galleryCaptions[idx]}`,
    alt_text: `Vipul Mota Visual Archive Plate ${pad}`,
    is_featured: idx < 6,
    sort_order: idx + 1,
    created_at: new Date().toISOString(),
  };
});

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0 || data.some((i: any) => i.image_url?.includes("unsplash"))) {
      return defaultGalleryItems;
    }

    return data as unknown as GalleryItem[];
  } catch {
    return defaultGalleryItems;
  }
}
