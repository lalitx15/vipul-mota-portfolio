import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import {
  TestimonialsPressManager,
  type TestimonialItem,
  type PressItem,
} from "@/components/admin/TestimonialsPressManager";

export const metadata: Metadata = {
  title: "Testimonials & Press Manager — Vipul Mota Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const supabase = createServerClient();

  // 1. Fetch all testimonials
  const { data: testimonialsData } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  // 2. Fetch all press mentions
  const { data: pressData } = await supabase
    .from("press_items")
    .select("*")
    .order("sort_order", { ascending: true });

  const initialTestimonials: TestimonialItem[] =
    (testimonialsData as unknown as TestimonialItem[]) || [];
  const initialPressItems: PressItem[] =
    (pressData as unknown as PressItem[]) || [];

  return (
    <TestimonialsPressManager
      initialTestimonials={initialTestimonials}
      initialPressItems={initialPressItems}
    />
  );
}
