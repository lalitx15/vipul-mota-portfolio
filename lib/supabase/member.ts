"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "./server";
import type { Database } from "@/types/supabase";
import { defaultPosts, type Post } from "./journal";
import { defaultVideos, type VideoItem } from "./videos";
import { defaultGalleryItems } from "./gallery";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type EnquiryItem = Database["public"]["Tables"]["enquiries"]["Row"];
export type SavedItemRow = Database["public"]["Tables"]["saved_items"]["Row"];

export interface EnrichedSavedItem {
  id: string;
  item_type: "gallery" | "video" | "post";
  item_id: string;
  title: string;
  cover_url?: string;
  url: string;
  created_at: string;
}

export interface MemberDashboardData {
  profile: ProfileRow | null;
  savedItems: EnrichedSavedItem[];
  enquiries: EnquiryItem[];
  exclusivePosts: Post[];
  exclusiveVideos: VideoItem[];
}

export async function getMemberDashboardData(
  userId: string
): Promise<MemberDashboardData> {
  const supabase = createServerClient();

  try {
    const [
      profileRes,
      savedRes,
      enquiriesRes,
      exclusivePostsRes,
      exclusiveVideosRes,
    ] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase
        .from("saved_items")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("enquiries")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("posts")
        .select("*")
        .eq("members_only", true)
        .eq("status", "published"),
      supabase
        .from("videos")
        .select("*")
        .eq("members_only", true),
    ]);

    const profile = (profileRes.data as unknown as ProfileRow) || null;
    const rawSaved = (savedRes.data as unknown as SavedItemRow[]) || [];
    const enquiries = (enquiriesRes.data as unknown as EnquiryItem[]) || [];

    // Fallbacks for exclusive content
    const exclusivePosts =
      (exclusivePostsRes.data as unknown as Post[])?.length > 0
        ? (exclusivePostsRes.data as unknown as Post[])
        : defaultPosts.filter((p) => p.members_only);

    const exclusiveVideos =
      (exclusiveVideosRes.data as unknown as VideoItem[])?.length > 0
        ? (exclusiveVideosRes.data as unknown as VideoItem[])
        : defaultVideos.filter((v) => v.members_only);

    // Enrich saved items
    const enrichedSaved: EnrichedSavedItem[] = rawSaved.map((item) => {
      if (item.item_type === "post") {
        const post = defaultPosts.find((p) => p.id === item.item_id);
        return {
          id: item.id,
          item_type: "post",
          item_id: item.item_id,
          title: post?.title || "Journal Dispatch",
          cover_url: post?.cover_url || undefined,
          url: `/journal/${post?.slug || ""}`,
          created_at: item.created_at,
        };
      } else if (item.item_type === "video") {
        const video = defaultVideos.find((v) => v.id === item.item_id);
        return {
          id: item.id,
          item_type: "video",
          item_id: item.item_id,
          title: video?.title || "Motion Repertoire Clip",
          cover_url: video?.thumbnail_url || undefined,
          url: "/videos",
          created_at: item.created_at,
        };
      } else {
        const gallery = defaultGalleryItems.find((g) => g.id === item.item_id);
        return {
          id: item.id,
          item_type: "gallery",
          item_id: item.item_id,
          title: gallery?.caption || "Lookbook Plate",
          cover_url: gallery?.image_url,
          url: "/gallery",
          created_at: item.created_at,
        };
      }
    });

    return {
      profile,
      savedItems: enrichedSaved,
      enquiries,
      exclusivePosts,
      exclusiveVideos,
    };
  } catch {
    return {
      profile: null,
      savedItems: [],
      enquiries: [],
      exclusivePosts: defaultPosts.filter((p) => p.members_only),
      exclusiveVideos: defaultVideos.filter((v) => v.members_only),
    };
  }
}

export async function removeSavedItemAction(savedItemId: string) {
  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Authentication required." };
    }

    const { error } = await supabase
      .from("saved_items")
      .delete()
      .eq("id", savedItemId)
      .eq("user_id", user.id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/member");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to remove item.";
    return { error: message };
  }
}

export async function requestAccountDeletionAction() {
  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Authentication required." };
    }

    // Soft-delete: update profile status to 'suspended'
    await (supabase.from("profiles") as any)
      .update({ status: "suspended" })
      .eq("id", user.id);

    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Deletion request failed.";
    return { error: message };
  }
}

export async function sendPasswordResetEmailAction() {
  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return { error: "No user email found." };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password`,
    });

    if (error) {
      return { error: error.message };
    }

    return {
      success: true,
      message: "Password reset dispatch delivered to your registered email.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to dispatch reset email.";
    return { error: message };
  }
}
