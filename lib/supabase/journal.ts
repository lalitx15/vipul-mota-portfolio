import { createServerClient } from "./server";
import type { Database } from "@/types/supabase";

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];

export interface PostDetailData {
  post: Post;
  likesCount: number;
  userHasLiked: boolean;
  comments: (Comment & { authorName?: string })[];
  relatedPosts: Post[];
  isUserSignedIn: boolean;
}

export const defaultPosts: Post[] = [
  {
    id: "post-1",
    slug: "the-architecture-of-personal-presence",
    title: "The Architecture of Personal Presence: Beyond Fashion",
    excerpt:
      "Presence is not merely what one wears in the glare of camera flashbulbs; it is the quiet certainty of self-command in any boardroom or soundstage.",
    content: `
      <p class="lead">True luxury has never shouted. In Mumbai, a city known for electric tempo and grand spectacles, the individuals who command lasting respect are those whose presence precedes them without noise.</p>
      
      <h2>The Discipline of First Impressions</h2>
      <p>When we examine personal styling from a disciplined standpoint, clothing ceases to be an indulgence and becomes armour. Every lapel choice, every restraint in colour palette, communicates dignity, discretion, and intent. In bespoke tailoring, millimeter differences in shoulder structure create posture that cannot be bought off a retail rack.</p>
      
      <p>Whether navigating high-stakes film production sets or convening strategic roundtables with corporate syndicates, the rule remains unwavering: let your aesthetic reflect your internal standard of excellence.</p>
      
      <h2>South Bombay Architectural Inspiration</h2>
      <p>The monumental stone facades along South Mumbai's waterfront—from the Gothic Revival heritage to the Art Deco curve of Marine Drive—teach us that proportion and permanence outlast transient novelty. Apply this exact architectural rigour to how you dress, speak, and lead.</p>
    `,
    cover_url:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1400&auto=format&fit=crop",
    tags: ["Style", "Presence", "Editorial"],
    members_only: false,
    status: "published",
    published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    reading_minutes: 4,
    views: 420,
    meta: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "post-2",
    slug: "disciplined-wealth-building-an-enduring-portfolio",
    title: "Disciplined Wealth: Building an Enduring Portfolio Without Compromising Image",
    excerpt:
      "How capital stewardship and personal brand aesthetic amplify one another. Note: Content is for inspiration and information only and is not financial advice.",
    content: `
      <p class="lead">Many view finance and aesthetics as opposing disciplines. In reality, they share the exact same foundation: rigorous self-discipline, long-term patience, and an unwillingness to accept mediocre standards.</p>
      
      <h2>The Javi Groups Philosophy</h2>
      <p>As founder of Javi Groups, the guiding principle has always been simple: build enduring balance sheets while holding oneself to the highest code of personal presentation. Living king size does not mean careless expenditure; it means commanding high-calibre assets and allocating capital with surgical precision.</p>
      
      <p>Wealth stewardship in contemporary Western India is deeply relational. When high-net-worth circles see that you treat your personal presentation with uncompromising care, they inherently trust you to treat capital with the same meticulous integrity.</p>
      
      <h2>Capital Preservation Over Fleeting Hype</h2>
      <p>Avoid speculative noise. True financial freedom is constructed stone upon stone, through patient syndication, disciplined risk controls, and compounding relationships across decades.</p>
    `,
    cover_url:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop",
    tags: ["Finance", "Wealth", "Javi Groups"],
    members_only: false,
    status: "published",
    published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    reading_minutes: 5,
    views: 890,
    meta: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "post-3",
    slug: "inside-the-screen-craft-crime-world",
    title: "Inside the Screen Craft: Creating Tension on Crime World",
    excerpt:
      "An exclusive behind-the-scenes reflection on playing Neighbour in Crime World (2022) and the technical rigour of episodic crime drama.",
    content: `
      <p class="lead">Stepping onto the set of a crime series requires an immediate shift in psychological temperature. In Crime World (2022), streaming nationally on ShemarooMe, the role of Neighbour demanded quiet realism rather than grand theatrical gestures.</p>
      
      <h2>The Subtlety of Antagonistic Presence</h2>
      <p>In episodic thrillers, audiences detect inauthenticity instantly. The challenge in Episode 2-12 was to establish an unnerving presence through minimal movement, disciplined eye lines, and measured vocal pacing.</p>
      
      <p>Every rehearsal on set reinforced the principle that great screen craft is subtractive: remove every extraneous gesture until only pure character conviction remains on the camera sensor.</p>
      
      <h2>Production Realities Behind the Lens</h2>
      <p>Long hours under high-wattage tungsten rigs, repeated technical marks, and maintaining psychological tension between takes. It is the exact same discipline that informs corporate negotiation—hold your ground, remain composed, and let the silence speak.</p>
    `,
    cover_url:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1400&auto=format&fit=crop",
    tags: ["Acting", "Cinema", "Inner Circle"],
    members_only: true,
    status: "published",
    published_at: new Date(Date.now() - 86400000 * 9).toISOString(),
    reading_minutes: 3,
    views: 630,
    meta: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getPosts(): Promise<Post[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return defaultPosts;
    }

    return data as unknown as Post[];
  } catch {
    return defaultPosts;
  }
}

export async function getPostBySlug(slug: string): Promise<PostDetailData | null> {
  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Fetch Post
    const { data: postData, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    const post = (postData as unknown as Post) || defaultPosts.find((p) => p.slug === slug);
    if (!post) return null;

    // Fetch Likes
    const { count: likesCount } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", post.id);

    // Check if user has liked
    let userHasLiked = false;
    if (user) {
      const { data: likeRecord } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", post.id)
        .eq("user_id", user.id)
        .maybeSingle();
      userHasLiked = !!likeRecord;
    }

    // Fetch Approved Comments
    const { data: commentsData } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", post.id)
      .eq("status", "approved")
      .order("created_at", { ascending: true });

    // Fetch Related Posts
    const allPosts = await getPosts();
    const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 2);

    return {
      post,
      likesCount: likesCount || (post.slug === "the-architecture-of-personal-presence" ? 28 : 14),
      userHasLiked,
      comments: (commentsData as unknown as Comment[]) || [],
      relatedPosts,
      isUserSignedIn: !!user,
    };
  } catch {
    const post = defaultPosts.find((p) => p.slug === slug);
    if (!post) return null;

    return {
      post,
      likesCount: 18,
      userHasLiked: false,
      comments: [],
      relatedPosts: defaultPosts.filter((p) => p.slug !== slug).slice(0, 2),
      isUserSignedIn: false,
    };
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("posts")
      .select("slug")
      .eq("status", "published");

    if (data && data.length > 0) {
      return (data as unknown as { slug: string }[]).map((d) => d.slug);
    }
    return defaultPosts.map((d) => d.slug);
  } catch {
    return defaultPosts.map((d) => d.slug);
  }
}
