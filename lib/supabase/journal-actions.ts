"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "./server";

export interface ActionResult {
  success?: boolean;
  error?: string;
  message?: string;
  hasLiked?: boolean;
}

export async function toggleLikeAction(postId: string): Promise<ActionResult> {
  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: "Please sign in to your Inner Circle account to like dispatches.",
      };
    }

    // Check if like exists
    const { data: existingLike } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingLike) {
      // Remove like
      await (supabase.from("post_likes") as any).delete().eq("id", (existingLike as any).id);
      revalidatePath("/journal");
      return { success: true, hasLiked: false };
    } else {
      // Add like
      await (supabase.from("post_likes") as any).insert({
        post_id: postId,
        user_id: user.id,
      });
      revalidatePath("/journal");
      return { success: true, hasLiked: true };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle like.";
    return { error: message };
  }
}

export async function submitCommentAction(
  postId: string,
  body: string
): Promise<ActionResult> {
  try {
    const trimmed = body.trim();
    if (!trimmed || trimmed.length < 3) {
      return { error: "Comment must be at least 3 characters long." };
    }

    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: "Please sign in as a member to post a comment.",
      };
    }

    const { error: insertError } = await (supabase.from("comments") as any).insert({
      post_id: postId,
      user_id: user.id,
      body: trimmed,
      status: "pending",
    });

    if (insertError) {
      return { error: insertError.message };
    }

    revalidatePath("/journal");
    return {
      success: true,
      message:
        "Your comment has been submitted and will appear upon moderation review.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit comment.";
    return { error: message };
  }
}
