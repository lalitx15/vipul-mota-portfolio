import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { GalleryManager } from "@/components/admin/GalleryManager";
import type { GalleryItem } from "@/lib/supabase/gallery";
import { defaultGalleryItems } from "@/lib/supabase/gallery";

export const metadata: Metadata = {
  title: "Lookbook Gallery Manager — Vipul Mota Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true });

  const plates =
    data && data.length > 0 ? (data as unknown as GalleryItem[]) : defaultGalleryItems;

  return <GalleryManager initialPlates={plates} />;
}
