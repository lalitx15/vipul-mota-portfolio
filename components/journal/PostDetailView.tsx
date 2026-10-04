"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Heart,
  Share2,
  Lock,
  MessageSquare,
  Send,
  Check,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { toggleLikeAction, submitCommentAction } from "@/lib/supabase/journal-actions";
import type { PostDetailData } from "@/lib/supabase/journal";

interface PostDetailViewProps {
  data: PostDetailData;
}

export function PostDetailView({ data }: PostDetailViewProps) {
  const { post, isUserSignedIn, relatedPosts } = data;
  const { success, error, info } = useToast();

  // Scroll reading progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // State
  const [likesCount, setLikesCount] = useState(data.likesCount);
  const [hasLiked, setHasLiked] = useState(data.userHasLiked);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSubmittedMessage, setCommentSubmittedMessage] = useState(false);

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "2026 Archive";

  const isFinanceRelated = post.tags?.some((t) =>
    ["Finance", "Wealth", "Javi Groups"].includes(t)
  );

  const isLocked = post.members_only && !isUserSignedIn;

  const handleLike = async () => {
    if (!isUserSignedIn) {
      error("Please sign in as a member to like dispatches.", "Authentication Required");
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    // Optimistic UI
    const prevLiked = hasLiked;
    const prevCount = likesCount;
    setHasLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    const res = await toggleLikeAction(post.id);
    setIsLiking(false);

    if (res.error) {
      // Revert
      setHasLiked(prevLiked);
      setLikesCount(prevCount);
      error(res.error, "Error");
    } else {
      if (!prevLiked) {
        success("You liked this dispatch.", "Endorsed");
      }
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      success("Article link copied to clipboard.", "Link Copied");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUserSignedIn) {
      error("Please sign in to leave a comment.", "Authentication Required");
      return;
    }

    if (!commentText.trim() || commentText.trim().length < 3) {
      error("Comment must be at least 3 characters long.", "Validation Error");
      return;
    }

    setIsSubmittingComment(true);
    const res = await submitCommentAction(post.id, commentText);
    setIsSubmittingComment(false);

    if (res.error) {
      error(res.error, "Error");
    } else {
      setCommentText("");
      setCommentSubmittedMessage(true);
      success(
        "Your comment has been submitted and is pending moderation review.",
        "Comment Submitted"
      );
    }
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      success(`"${post.title}" saved to your Member Collection.`, "Saved to Archive");
    } else {
      info("Article removed from your Member Collection.", "Removed from Archive");
    }
  };

  return (
    <div className="relative min-h-screen bg-ink text-ivory pb-28">
      {/* Top Reading Progress Bar */}
      <m.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gold z-50 origin-left"
      />

      {/* Top Sub-Bar */}
      <div className="border-b border-line bg-charcoal/50 sticky top-16 z-20 backdrop-blur-md px-6 py-4">
        <div className="max-w-site mx-auto flex items-center justify-between">
          <Link
            href="/journal"
            className="flex items-center space-x-2 text-stone hover:text-gold transition-colors text-xs uppercase tracking-widest font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Journal</span>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="p-2 border border-line text-stone hover:text-ivory transition-colors text-xs flex items-center space-x-1.5"
              title="Share Dispatch"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={handleToggleSave}
              className={`py-1.5 px-3 border transition-colors text-xs flex items-center space-x-1.5 ${
                isSaved
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-line text-stone hover:text-gold"
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 pt-12 md:pt-20 space-y-12">
        {/* Article Meta Header */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="editorial-label text-[10px] text-gold bg-charcoal border border-line px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
            {post.members_only && (
              <span className="editorial-label text-[10px] text-ink bg-gold px-2.5 py-1 font-semibold flex items-center space-x-1">
                <Lock className="w-2.5 h-2.5" />
                <span>Inner Circle Exclusive</span>
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-ivory tracking-tight leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between border-y border-line py-4 gap-4 text-xs text-stone">
            <div className="flex items-center space-x-4">
              <span className="text-ivory font-medium">By Vipul Mota</span>
              <span>&middot;</span>
              <span className="font-mono">{formattedDate}</span>
            </div>

            <div className="flex items-center space-x-4 font-mono text-[11px]">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.reading_minutes || 4} min read</span>
              </span>
              <span>&middot;</span>
              <span>{post.views || 450} Views</span>
            </div>
          </div>
        </div>

        {/* Lead Excerpt */}
        <p className="font-serif text-xl sm:text-2xl text-stone italic font-light leading-relaxed">
          &ldquo;{post.excerpt}&rdquo;
        </p>

        {/* Cover Still */}
        {post.cover_url && (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-charcoal border border-line">
            <Image
              src={post.cover_url}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Article Content / Locked Teaser */}
        {isLocked ? (
          <div className="relative space-y-8 pt-4">
            <div
              className="prose prose-invert max-w-none text-stone line-clamp-3 select-none filter blur-[4px] pointer-events-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Inner Circle Gated Paywall / Gate */}
            <div className="relative z-10 bg-charcoal border border-gold/40 p-8 sm:p-12 text-center space-y-6">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold text-gold flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="editorial-label text-gold">Members Only Content</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-light">
                  Join the Inner Circle to Read this Dispatch
                </h3>
                <p className="text-stone text-xs sm:text-sm font-light">
                  This dispatch contains proprietary production breakdowns, private syndication memos, or behind-the-scenes camera stills reserved exclusively for authenticated members.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link href={`/login?next=/journal/${post.slug}`}>
                  <Button variant="gold" size="lg">
                    Sign In to Unlock &rarr;
                  </Button>
                </Link>
                <Link href={`/signup?next=/journal/${post.slug}`}>
                  <Button variant="outline" size="lg">
                    Request Member Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 pt-4">
            <div
              className="prose prose-invert prose-stone max-w-none text-stone font-light leading-relaxed space-y-6 [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:text-ivory [&>h2]:font-normal [&>h2]:pt-4 [&>p]:text-base [&>p]:leading-relaxed [&>p.lead]:text-lg [&>p.lead]:text-ivory [&>p.lead]:font-serif [&>blockquote]:border-l-2 [&>blockquote]:border-gold [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-ivory"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Mandatory Finance Disclaimer Note */}
            {isFinanceRelated && (
              <div className="p-4 border border-line bg-charcoal text-xs text-stone/90 italic">
                <p>
                  <strong>Disclaimer:</strong> Content is for inspiration and information only and is not financial advice.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Article Footer & Social Interaction Row */}
        <div className="border-y border-line py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center space-x-3 py-3 px-6 border transition-all text-xs uppercase tracking-widest ${
              hasLiked
                ? "bg-gold text-ink border-gold font-medium"
                : "bg-charcoal text-stone hover:text-ivory hover:border-gold/60 border-line"
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
            <span>{hasLiked ? "Endorsed" : "Endorse Dispatch"}</span>
            <span className="font-mono text-xs ml-1">({likesCount})</span>
          </button>

          {/* Social Share Group */}
          <div className="flex items-center space-x-3 text-xs text-stone">
            <span className="editorial-label text-[10px]">Share Dispatch:</span>
            <button
              onClick={handleShare}
              className="p-2 border border-line hover:text-ivory hover:border-gold transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Discussion / Comments Section */}
        <section className="space-y-8 pt-6">
          <div className="flex items-center space-x-3 border-b border-line pb-4">
            <MessageSquare className="w-5 h-5 text-gold" />
            <h3 className="font-serif text-2xl text-ivory font-light">
              Member Dialogue ({data.comments.length})
            </h3>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {data.comments.length === 0 ? (
              <p className="text-stone text-xs italic py-4">
                No public remarks on this dispatch yet. Be the first Inner Circle member to contribute.
              </p>
            ) : (
              data.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-charcoal border border-line p-5 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ivory font-medium">Inner Circle Member</span>
                    <span className="text-stone font-mono text-[10px]">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-stone text-sm font-light leading-relaxed">
                    {comment.body}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Comment Form */}
          {isUserSignedIn ? (
            <form onSubmit={handleCommentSubmit} className="space-y-4 pt-4 border-t border-line/60">
              <label className="editorial-label text-gold block text-xs">
                Leave a Thoughtful Contribution (Moderated)
              </label>
              <textarea
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your perspective on this dispatch..."
                required
                className="w-full bg-charcoal border border-line p-4 text-xs text-ivory placeholder-stone focus:outline-none focus:border-gold transition-colors resize-none"
              />

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone text-[11px]">
                  Comments are reviewed by management before public display.
                </span>

                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  disabled={isSubmittingComment}
                >
                  <Send className="w-3.5 h-3.5 mr-2" />
                  {isSubmittingComment ? "Submitting..." : "Submit Comment"}
                </Button>
              </div>

              {commentSubmittedMessage && (
                <p className="text-gold text-xs italic">
                  Thank you. Your comment has been received and is queued for moderation.
                </p>
              )}
            </form>
          ) : (
            <div className="bg-charcoal border border-line p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <span className="text-stone">
                Sign in to your member account to submit remarks and join the dialogue.
              </span>
              <Link href={`/login?next=/journal/${post.slug}`}>
                <Button variant="outline" size="sm">
                  Sign In to Comment &rarr;
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="pt-16 border-t border-line space-y-8">
            <div>
              <span className="editorial-label text-gold">Further Reading</span>
              <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-light mt-1">
                Recent Dispatches
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/journal/${rel.slug}`}
                  className="group bg-charcoal border border-line p-6 flex flex-col justify-between hover:border-gold/60 transition-colors space-y-4"
                >
                  <div className="space-y-2">
                    <span className="editorial-label text-gold text-[10px]">
                      {rel.tags?.[0] || "Dispatch"}
                    </span>
                    <h4 className="font-serif text-2xl text-ivory font-light group-hover:text-gold transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-stone text-xs line-clamp-2 font-light">
                      {rel.excerpt}
                    </p>
                  </div>

                  <span className="text-stone group-hover:text-ivory transition-colors text-xs font-mono">
                    Read Dispatch &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
