"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "./server";
import { getCurrentProfile } from "./user";
import { sendAdminReplyEmail } from "@/lib/email";

export interface AdminActionResult {
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
// 1. JOURNAL POSTS (CRUD)
// -------------------------------------------------------------
export async function saveJournalPostAction(data: {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string;
  tags: string[];
  members_only: boolean;
  status: "draft" | "published";
  published_at?: string | null;
  reading_minutes?: number;
}): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();

  const readingTime =
    data.reading_minutes ||
    Math.max(1, Math.round(data.content.replace(/<[^>]*>?/gm, "").split(/\s+/).length / 200));

  const payload = {
    slug: data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    title: data.title.trim(),
    excerpt: data.excerpt.trim(),
    content: data.content,
    cover_url: data.cover_url,
    tags: data.tags,
    members_only: data.members_only,
    status: data.status,
    published_at: data.status === "published" ? data.published_at || new Date().toISOString() : null,
    reading_minutes: readingTime,
    updated_at: new Date().toISOString(),
  };

  try {
    if (data.id) {
      const { error } = await (supabase.from("posts") as any)
        .update(payload)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await (supabase.from("posts") as any).insert(payload);
      if (error) throw error;
    }

    revalidatePath("/journal");
    revalidatePath(`/journal/${payload.slug}`);
    revalidatePath("/");
    return { success: true, message: `Dispatch "${payload.title}" saved successfully.` };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to save journal post." };
  }
}

export async function deleteJournalPostAction(id: string): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  try {
    const { error } = await (supabase.from("posts") as any).delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/journal");
    revalidatePath("/");
    return { success: true, message: "Dispatch removed permanently." };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to delete post." };
  }
}

// -------------------------------------------------------------
// 2. COMMENT MODERATION (APPROVE / REJECT / DELETE)
// -------------------------------------------------------------
export async function moderateCommentAction(
  commentId: string,
  action: "approved" | "rejected" | "delete"
): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  try {
    if (action === "delete") {
      const { error } = await (supabase.from("comments") as any).delete().eq("id", commentId);
      if (error) throw error;
    } else {
      const { error } = await (supabase.from("comments") as any)
        .update({ status: action })
        .eq("id", commentId);
      if (error) throw error;
    }

    revalidatePath("/journal");
    return {
      success: true,
      message:
        action === "delete"
          ? "Comment removed from registry."
          : `Comment marked as ${action}.`,
    };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to moderate comment." };
  }
}

// -------------------------------------------------------------
// 3. ENQUIRIES INBOX (STATUS / NOTES / EMAIL REPLY)
// -------------------------------------------------------------
export async function updateEnquiryStatusAction(
  id: string,
  status: "new" | "in_review" | "replied" | "closed"
): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  try {
    const { error } = await (supabase.from("enquiries") as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/enquiries");
    return { success: true, message: `Inquiry status changed to ${status.replace("_", " ")}.` };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to update inquiry status." };
  }
}

export async function addEnquiryNoteAction(
  enquiryId: string,
  note: string
): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const cleanNote = note.trim();
  if (!cleanNote) return { error: "Note content cannot be empty." };

  const supabase = createServerClient();
  try {
    const { error } = await (supabase.from("enquiry_notes") as any).insert({
      enquiry_id: enquiryId,
      note: cleanNote,
      created_by: auth.userEmail || "Executive Office",
    });
    if (error) throw error;

    revalidatePath("/admin/enquiries");
    return { success: true, message: "Internal note logged." };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to log note." };
  }
}

export async function replyEnquiryAction(data: {
  enquiryId: string;
  toEmail: string;
  recipientName: string;
  subject: string;
  replyMessage: string;
  originalMessage?: string;
}): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const cleanMessage = data.replyMessage.trim();
  if (!cleanMessage) return { error: "Reply message cannot be empty." };

  const supabase = createServerClient();
  try {
    // 1. Dispatch email via Resend
    const emailResult = await sendAdminReplyEmail({
      toEmail: data.toEmail,
      recipientName: data.recipientName,
      subject: data.subject,
      replyMessage: cleanMessage,
      originalMessage: data.originalMessage,
    });

    if (!emailResult.success) {
      throw new Error(emailResult.error || "Email delivery failed.");
    }

    // 2. Mark enquiry as replied
    await (supabase.from("enquiries") as any)
      .update({ status: "replied", updated_at: new Date().toISOString() })
      .eq("id", data.enquiryId);

    // 3. Log reply note
    await (supabase.from("enquiry_notes") as any).insert({
      enquiry_id: data.enquiryId,
      note: `[Official Email Reply Sent]: "${cleanMessage.slice(0, 150)}${cleanMessage.length > 150 ? "..." : ""}"`,
      created_by: auth.userEmail || "Executive Office",
    });

    revalidatePath("/admin/enquiries");
    return { success: true, message: `Executive reply dispatched to ${data.toEmail}.` };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to dispatch reply." };
  }
}

// -------------------------------------------------------------
// 4. MEMBERS (STATUS & ROLES)
// -------------------------------------------------------------
export async function updateMemberStatusAction(
  userId: string,
  status: "active" | "suspended"
): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  try {
    const { error } = await (supabase.from("profiles") as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", userId);
    if (error) throw error;

    revalidatePath("/admin/members");
    return { success: true, message: `Member account status set to ${status}.` };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to update member status." };
  }
}

export async function updateMemberRoleAction(
  targetUserId: string,
  newRole: "member" | "admin"
): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  // Guard: Avoid self-demotion from active session
  if (targetUserId === auth.userId && newRole === "member") {
    return { error: "Security restriction: You cannot demote your own active administrator account." };
  }

  const supabase = createServerClient();
  try {
    const { error } = await (supabase.from("profiles") as any)
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("id", targetUserId);
    if (error) throw error;

    revalidatePath("/admin/members");
    return { success: true, message: `Account authority set to ${newRole.toUpperCase()}.` };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to update member role." };
  }
}

// -------------------------------------------------------------
// 5. TESTIMONIALS (CRUD)
// -------------------------------------------------------------
export async function saveTestimonialAction(data: {
  id?: string;
  name: string;
  role: string;
  body: string;
  avatar_url?: string | null;
  is_published: boolean;
  sort_order: number;
}): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  const payload = {
    name: data.name.trim(),
    role: data.role.trim(),
    body: data.body.trim(),
    avatar_url: data.avatar_url || null,
    is_published: data.is_published,
    sort_order: data.sort_order,
  };

  try {
    if (data.id) {
      const { error } = await (supabase.from("testimonials") as any)
        .update(payload)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await (supabase.from("testimonials") as any).insert(payload);
      if (error) throw error;
    }

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true, message: `Testimonial for ${payload.name} saved successfully.` };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to save testimonial." };
  }
}

export async function deleteTestimonialAction(id: string): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  try {
    const { error } = await (supabase.from("testimonials") as any).delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true, message: "Testimonial removed." };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to delete testimonial." };
  }
}

// -------------------------------------------------------------
// 6. PRESS ITEMS (CRUD)
// -------------------------------------------------------------
export async function savePressItemAction(data: {
  id?: string;
  outlet: string;
  title: string;
  url: string;
  date: string;
  logo_url?: string | null;
  is_published: boolean;
  sort_order: number;
}): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  const payload = {
    outlet: data.outlet.trim(),
    title: data.title.trim(),
    url: data.url.trim(),
    date: data.date.trim(),
    logo_url: data.logo_url || null,
    is_published: data.is_published,
    sort_order: data.sort_order,
  };

  try {
    if (data.id) {
      const { error } = await (supabase.from("press_items") as any)
        .update(payload)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await (supabase.from("press_items") as any).insert(payload);
      if (error) throw error;
    }

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/testimonials");
    return { success: true, message: `Press mention from ${payload.outlet} saved.` };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to save press mention." };
  }
}

export async function deletePressItemAction(id: string): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  try {
    const { error } = await (supabase.from("press_items") as any).delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/testimonials");
    return { success: true, message: "Press item removed." };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to delete press item." };
  }
}

// -------------------------------------------------------------
// 7. SOCIAL PRESENCE & FOLLOWER COUNTS
// -------------------------------------------------------------
export async function updateSocialSettingsAction(data: {
  instagram_url: string;
  youtube_url: string;
  facebook_url: string;
  threads_url: string;
  x_url?: string | null;
  linkedin_url?: string | null;
  whatsapp_url?: string | null;
  instagram_followers_count: string;
  youtube_subscribers_count: string;
}): Promise<AdminActionResult> {
  const auth = await ensureAdmin();
  if (!auth.authorized) return { error: auth.error };

  const supabase = createServerClient();
  const payload = {
    instagram_url: data.instagram_url.trim(),
    youtube_url: data.youtube_url.trim(),
    facebook_url: data.facebook_url.trim(),
    threads_url: data.threads_url.trim(),
    x_url: data.x_url?.trim() || null,
    linkedin_url: data.linkedin_url?.trim() || null,
    whatsapp_url: data.whatsapp_url?.trim() || null,
    instagram_followers_count: data.instagram_followers_count.trim(),
    youtube_subscribers_count: data.youtube_subscribers_count.trim(),
    updated_at: new Date().toISOString(),
  };

  try {
    const { error } = await (supabase.from("site_settings") as any)
      .update(payload)
      .eq("id", 1);

    if (error) throw error;

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/admin/social");
    return { success: true, message: "Social links and verified audience statistics updated." };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to update social settings." };
  }
}
