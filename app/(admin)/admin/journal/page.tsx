import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { JournalManager, type ExtendedComment } from "@/components/admin/JournalManager";
import { defaultPosts, type Post } from "@/lib/supabase/journal";

export const metadata: Metadata = {
  title: "Journal & Dispatch Manager — Vipul Mota Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminJournalPage() {
  const supabase = createServerClient();

  // 1. Fetch all posts (both published and drafts)
  const { data: postsData } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const posts: Post[] =
    postsData && postsData.length > 0 ? (postsData as unknown as Post[]) : defaultPosts;

  // 2. Fetch all comments for moderation
  const { data: commentsData } = await supabase
    .from("comments")
    .select("*, posts:post_id(title)")
    .order("created_at", { ascending: false });

  const initialComments: ExtendedComment[] = (commentsData || []).map((c: any) => ({
    id: c.id,
    post_id: c.post_id,
    user_id: c.user_id,
    body: c.body,
    status: c.status,
    created_at: c.created_at,
    postTitle: c.posts?.title || undefined,
  }));

  return <JournalManager initialPosts={posts} initialComments={initialComments} />;
}
