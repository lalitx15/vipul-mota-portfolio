"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "./server";
import { getCurrentProfile } from "./user";

export interface ContentActionResult {
  success?: boolean;
  error?: string;
  message?: string;
}

// Helper: Ensure authenticated owner admin
async function ensureAdmin(): Promise<{ authorized: boolean; error?: string }> {
  const { cookies } = await import("next/headers");
  const hasAdminCookie = cookies().get("vm_admin_session")?.value === "authenticated";
  if (hasAdminCookie) {
    return { authorized: true };
  }

  const { user, profile, isAdmin } = await getCurrentProfile();
  if (!user || !profile || !isAdmin) {
    return { authorized: false, error: "Unauthorized. Owner admin privileges required." };
  }
  return { authorized: true };
}

// -------------------------------------------------------------
// 1. HERO SLIDES
// -------------------------------------------------------------
export async function saveHeroSlideAction(data: {
  id?: string;
  headline_line1: string;
  headline_line2: string;
  tagline: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  is_active: boolean;
  sort_order?: number;
}): Promise<ContentActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();

  try {
    if (data.id) {
      const { error } = await (supabase.from("hero_slides") as any)
        .update({
          headline_line1: data.headline_line1,
          headline_line2: data.headline_line2,
          tagline: data.tagline,
          image_url: data.image_url,
          cta_text: data.cta_text,
          cta_link: data.cta_link,
          is_active: data.is_active,
          sort_order: data.sort_order ?? 1,
        })
        .eq("id", data.id);

      if (error) return { error: error.message };
    } else {
      const { error } = await (supabase.from("hero_slides") as any).insert({
        headline_line1: data.headline_line1,
        headline_line2: data.headline_line2,
        tagline: data.tagline,
        image_url: data.image_url,
        cta_text: data.cta_text,
        cta_link: data.cta_link,
        is_active: data.is_active,
        sort_order: data.sort_order ?? 1,
      });

      if (error) return { error: error.message };
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/hero");
    return { success: true, message: "Hero slide successfully persisted." };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to save hero slide." };
  }
}

export async function deleteHeroSlideAction(id: string): Promise<ContentActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin/hero");
  return { success: true, message: "Hero slide deleted." };
}

// -------------------------------------------------------------
// 2. TIMELINE ITEMS
// -------------------------------------------------------------
export async function saveTimelineItemAction(data: {
  id?: string;
  year: string;
  title: string;
  description: string;
  image_url?: string;
  sort_order?: number;
}): Promise<ContentActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();

  try {
    if (data.id) {
      const { error } = await (supabase.from("timeline_items") as any)
        .update({
          year: data.year,
          title: data.title,
          description: data.description,
          image_url: data.image_url || null,
          sort_order: data.sort_order ?? 1,
        })
        .eq("id", data.id);

      if (error) return { error: error.message };
    } else {
      const { error } = await (supabase.from("timeline_items") as any).insert({
        year: data.year,
        title: data.title,
        description: data.description,
        image_url: data.image_url || null,
        sort_order: data.sort_order ?? 1,
      });

      if (error) return { error: error.message };
    }

    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true, message: "Timeline milestone saved." };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to save timeline milestone." };
  }
}

export async function deleteTimelineItemAction(id: string): Promise<ContentActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  const { error } = await supabase.from("timeline_items").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/about");
  revalidatePath("/admin/about");
  return { success: true, message: "Timeline milestone deleted." };
}

// -------------------------------------------------------------
// 3. WORK ITEMS
// -------------------------------------------------------------
export async function saveWorkItemAction(data: {
  id?: string;
  type: "acting" | "modeling" | "venture";
  slug: string;
  title: string;
  role?: string;
  year?: string;
  platform?: string;
  description: string;
  cover_url: string;
  external_url?: string;
  is_featured: boolean;
  status: "draft" | "published";
  sort_order?: number;
}): Promise<ContentActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();

  try {
    const payload = {
      type: data.type,
      slug: data.slug,
      title: data.title,
      role: data.role || null,
      year: data.year || null,
      platform: data.platform || null,
      description: data.description,
      cover_url: data.cover_url,
      external_url: data.external_url || null,
      is_featured: data.is_featured,
      status: data.status,
      sort_order: data.sort_order ?? 1,
    };

    if (data.id) {
      const { error } = await (supabase.from("work_items") as any)
        .update(payload)
        .eq("id", data.id);

      if (error) return { error: error.message };
    } else {
      const { error } = await (supabase.from("work_items") as any).insert(payload);
      if (error) return { error: error.message };
    }

    revalidatePath("/", "layout");
    revalidatePath("/work");
    revalidatePath(`/work/${data.slug}`);
    revalidatePath("/admin/work");
    return { success: true, message: "Work portfolio case saved." };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to save work item." };
  }
}

export async function deleteWorkItemAction(id: string): Promise<ContentActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  const { error } = await supabase.from("work_items").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/work");
  revalidatePath("/admin/work");
  return { success: true, message: "Work item deleted." };
}

// -------------------------------------------------------------
// 4. GALLERY ITEMS
// -------------------------------------------------------------
export async function saveGalleryItemAction(data: {
  id?: string;
  image_url: string;
  category: "Portraits" | "Editorial" | "Lifestyle" | "Events" | "Behind the scenes";
  caption?: string;
  alt_text?: string;
  is_featured: boolean;
  sort_order?: number;
}): Promise<ContentActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();

  try {
    const payload = {
      image_url: data.image_url,
      category: data.category,
      caption: data.caption || null,
      alt_text: data.alt_text || null,
      is_featured: data.is_featured,
      sort_order: data.sort_order ?? 1,
    };

    if (data.id) {
      const { error } = await (supabase.from("gallery_items") as any)
        .update(payload)
        .eq("id", data.id);

      if (error) return { error: error.message };
    } else {
      const { error } = await (supabase.from("gallery_items") as any).insert(payload);
      if (error) return { error: error.message };
    }

    revalidatePath("/", "layout");
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true, message: "Lookbook plate saved." };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to save lookbook plate." };
  }
}

export async function deleteGalleryItemAction(id: string): Promise<ContentActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { success: true, message: "Lookbook plate deleted." };
}

// -------------------------------------------------------------
// 5. VIDEOS
// -------------------------------------------------------------
export async function saveVideoItemAction(data: {
  id?: string;
  title: string;
  platform: "youtube" | "instagram";
  video_id: string;
  url: string;
  thumbnail_url: string;
  category: string;
  is_featured: boolean;
  members_only: boolean;
  sort_order?: number;
}): Promise<ContentActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();

  try {
    const payload = {
      title: data.title,
      platform: data.platform,
      video_id: data.video_id,
      url: data.url,
      thumbnail_url: data.thumbnail_url,
      category: data.category,
      is_featured: data.is_featured,
      members_only: data.members_only,
      sort_order: data.sort_order ?? 1,
    };

    if (data.id) {
      const { error } = await (supabase.from("videos") as any)
        .update(payload)
        .eq("id", data.id);

      if (error) return { error: error.message };
    } else {
      const { error } = await (supabase.from("videos") as any).insert(payload);
      if (error) return { error: error.message };
    }

    revalidatePath("/", "layout");
    revalidatePath("/videos");
    revalidatePath("/admin/videos");
    return { success: true, message: "Video record saved." };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to save video." };
  }
}

export async function deleteVideoItemAction(id: string): Promise<ContentActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/videos");
  revalidatePath("/admin/videos");
  return { success: true, message: "Video record deleted." };
}
