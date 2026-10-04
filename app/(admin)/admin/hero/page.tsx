import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { HeroManager } from "@/components/admin/HeroManager";
import type { HeroSlide } from "@/lib/supabase/home";
import { defaultHero } from "@/lib/supabase/home";

export const metadata: Metadata = {
  title: "Hero & Showcase Manager — Vipul Mota Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("hero_slides")
    .select("*")
    .order("sort_order", { ascending: true });

  const slides =
    data && data.length > 0 ? (data as unknown as HeroSlide[]) : [defaultHero];

  return <HeroManager initialSlides={slides} />;
}
