"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "./server";
import { getCurrentProfile } from "./user";

export interface SystemActionResult {
  success?: boolean;
  error?: string;
  message?: string;
}

async function ensureAdmin(): Promise<{
  authorized: boolean;
  userId?: string;
  userEmail?: string;
  error?: string;
}> {
  const { cookies } = await import("next/headers");
  const hasAdminCookie = cookies().get("vm_admin_session")?.value === "authenticated";
  if (hasAdminCookie) {
    return {
      authorized: true,
      userId: "admin-master",
      userEmail: "connect@javigroups.com",
    };
  }

  const { user, profile, isAdmin } = await getCurrentProfile();
  if (!user || !profile || !isAdmin) {
    return { authorized: false, error: "Unauthorized. Owner admin privileges required." };
  }
  return { authorized: true, userId: user.id, userEmail: user.email };
}

// -------------------------------------------------------------
// 1. SITE SETTINGS
// -------------------------------------------------------------
export async function updateSiteSettingsAction(data: {
  site_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  announcement_bar?: string | null;
  maintenance_mode: boolean;
  footer_text: string;
  finance_disclaimer: string;
}): Promise<SystemActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  const payload = {
    site_name: data.site_name.trim(),
    tagline: data.tagline.trim(),
    contact_email: data.contact_email.trim(),
    contact_phone: data.contact_phone.trim(),
    address: data.address.trim(),
    announcement_bar: data.announcement_bar?.trim() || null,
    maintenance_mode: data.maintenance_mode,
    footer_text: data.footer_text.trim(),
    finance_disclaimer: data.finance_disclaimer.trim(),
    updated_at: new Date().toISOString(),
  };

  try {
    const { error } = await (supabase.from("site_settings") as any)
      .update(payload)
      .eq("id", 1);
    if (error) throw error;

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    return { success: true, message: "General brand and operational settings updated." };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to update site settings." };
  }
}

// -------------------------------------------------------------
// 2. SEO SETTINGS
// -------------------------------------------------------------
export async function updateSeoSettingsAction(data: {
  default_title: string;
  title_template: string;
  default_description: string;
  og_image_url?: string | null;
  google_analytics_id?: string | null;
  search_console_tag?: string | null;
  meta_pixel_id?: string | null;
  robots_txt: string;
}): Promise<SystemActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  const payload = {
    default_title: data.default_title.trim(),
    title_template: data.title_template.trim(),
    default_description: data.default_description.trim(),
    og_image_url: data.og_image_url?.trim() || null,
    google_analytics_id: data.google_analytics_id?.trim() || null,
    search_console_tag: data.search_console_tag?.trim() || null,
    meta_pixel_id: data.meta_pixel_id?.trim() || null,
    robots_txt: data.robots_txt,
    updated_at: new Date().toISOString(),
  };

  try {
    const { error } = await (supabase.from("seo_settings") as any)
      .update(payload)
      .eq("id", 1);
    if (error) throw error;

    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    return { success: true, message: "Global SEO, telemetry tags, and robots.txt directives saved." };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to update SEO settings." };
  }
}

// -------------------------------------------------------------
// 3. PER-PAGE SEO OVERRIDES
// -------------------------------------------------------------
export async function savePageSeoAction(data: {
  id?: string;
  page_path: string;
  title?: string | null;
  description?: string | null;
  og_image_url?: string | null;
  canonical_url?: string | null;
  no_index: boolean;
}): Promise<SystemActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  const payload = {
    page_path: data.page_path.trim(),
    title: data.title?.trim() || null,
    description: data.description?.trim() || null,
    og_image_url: data.og_image_url?.trim() || null,
    canonical_url: data.canonical_url?.trim() || null,
    no_index: data.no_index,
    updated_at: new Date().toISOString(),
  };

  try {
    if (data.id) {
      const { error } = await (supabase.from("page_seo") as any)
        .update(payload)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await (supabase.from("page_seo") as any).insert(payload);
      if (error) throw error;
    }

    revalidatePath(payload.page_path);
    revalidatePath("/admin/settings");
    return { success: true, message: `SEO rules for "${payload.page_path}" saved.` };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to save page SEO." };
  }
}

export async function deletePageSeoAction(id: string): Promise<SystemActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  try {
    const { error } = await (supabase.from("page_seo") as any).delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/settings");
    return { success: true, message: "Page SEO override removed." };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to delete page SEO." };
  }
}

// -------------------------------------------------------------
// 4. MEDIA LIBRARY
// -------------------------------------------------------------
export async function saveMediaItemAction(data: {
  id?: string;
  url: string;
  storage_path: string;
  filename: string;
  size: number;
  mime_type: string;
}): Promise<SystemActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  const payload = {
    url: data.url.trim(),
    storage_path: data.storage_path.trim(),
    filename: data.filename.trim(),
    size: data.size,
    mime_type: data.mime_type.trim(),
    uploaded_by: auth.userId || null,
    created_at: new Date().toISOString(),
  };

  try {
    const { error } = await (supabase.from("media") as any).insert(payload);
    if (error) throw error;

    revalidatePath("/admin/media");
    return { success: true, message: `Asset "${payload.filename}" added to media library.` };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to log media asset." };
  }
}

export async function deleteMediaItemAction(
  id: string,
  storagePath?: string
): Promise<SystemActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  try {
    // 1. If storage path is provided, attempt deletion from bucket
    if (storagePath && storagePath.includes("/")) {
      const parts = storagePath.split("/");
      const bucket = parts[0];
      const filePath = parts.slice(1).join("/");
      await supabase.storage.from(bucket).remove([filePath]);
    }

    // 2. Remove record from media table
    const { error } = await (supabase.from("media") as any).delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/media");
    return { success: true, message: "Asset removed from storage register." };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to delete media asset." };
  }
}
