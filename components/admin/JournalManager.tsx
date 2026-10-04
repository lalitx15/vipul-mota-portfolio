"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Lock,
  Unlock,
  BookOpen,
  MessageSquare,
  Search,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  saveJournalPostAction,
  deleteJournalPostAction,
  moderateCommentAction,
} from "@/lib/supabase/admin-actions";
import type { Post, Comment } from "@/lib/supabase/journal";
import { FileUploadInput } from "./FileUploadInput";

export interface ExtendedComment extends Comment {
  postTitle?: string;
  authorEmail?: string;
}

interface JournalManagerProps {
  initialPosts: Post[];
  initialComments: ExtendedComment[];
}

export function JournalManager({ initialPosts, initialComments }: JournalManagerProps) {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");

  // Post states
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [postSearch, setPostSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [isSavingPost, setIsSavingPost] = useState(false);

  // Form field states for modal
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCover, setFormCover] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formMembersOnly, setFormMembersOnly] = useState(false);
  const [formStatus, setFormStatus] = useState<"draft" | "published">("published");

  // Comment states
  const [comments, setComments] = useState<ExtendedComment[]>(initialComments);
  const [commentFilter, setCommentFilter] = useState<"all" | "pending" | "approved" | "rejected">(
    "all"
  );
  const [isModerating, setIsModerating] = useState<string | null>(null);

  const pendingCommentsCount = comments.filter((c) => c.status === "pending").length;

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormTitle("");
    setFormSlug("");
    setFormExcerpt("");
    setFormContent("<p>Write dispatch narrative here...</p>");
    setFormCover(
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
    );
    setFormTags("Style, Presence, Editorial");
    setFormMembersOnly(false);
    setFormStatus("published");
    setIsPostModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (post: Post) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormCover(post.cover_url);
    setFormTags((post.tags || []).join(", "));
    setFormMembersOnly(post.members_only);
    setFormStatus(post.status);
    setIsPostModalOpen(true);
  };

  // Auto-slugify title
  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingPost) {
      setFormSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  // Quick insertion helpers for formatted text
  const insertFormatting = (prefix: string, suffix: string) => {
    setFormContent((prev) => `${prev}\n${prefix}New narrative block${suffix}`);
  };

  // Save Post
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPost(true);

    const tagsArray = formTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      id: editingPost?.id,
      title: formTitle,
      slug: formSlug,
      excerpt: formExcerpt,
      content: formContent,
      cover_url: formCover,
      tags: tagsArray,
      members_only: formMembersOnly,
      status: formStatus,
    };

    const res = await saveJournalPostAction(payload);
    setIsSavingPost(false);

    if (res.error) {
      error(res.error);
    } else {
      success(res.message || "Dispatch saved.");
      setIsPostModalOpen(false);

      if (editingPost) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === editingPost.id
              ? ({
                  ...p,
                  title: formTitle,
                  slug: formSlug,
                  excerpt: formExcerpt,
                  content: formContent,
                  cover_url: formCover,
                  tags: tagsArray,
                  members_only: formMembersOnly,
                  status: formStatus,
                } as Post)
              : p
          )
        );
      } else {
        const newPost: Post = {
          id: `post-${Date.now()}`,
          title: formTitle,
          slug: formSlug,
          excerpt: formExcerpt,
          content: formContent,
          cover_url: formCover,
          tags: tagsArray,
          members_only: formMembersOnly,
          status: formStatus,
          published_at: formStatus === "published" ? new Date().toISOString() : null,
          reading_minutes: Math.max(1, Math.round(formContent.split(/\s+/).length / 200)),
          views: 0,
          meta: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setPosts((prev) => [newPost, ...prev]);
      }
    }
  };

  // Delete Post
  const handleDeletePost = async (id: string) => {
    const res = await deleteJournalPostAction(id);
    if (res.error) {
      error(res.error);
    } else {
      success("Dispatch deleted.");
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setDeletingPostId(null);
    }
  };

  // Moderate Comment
  const handleModerateComment = async (
    commentId: string,
    action: "approved" | "rejected" | "delete"
  ) => {
    setIsModerating(commentId);
    const res = await moderateCommentAction(commentId, action);
    setIsModerating(null);

    if (res.error) {
      error(res.error);
    } else {
      success(res.message || "Comment status updated.");
      if (action === "delete") {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } else {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, status: action } : c))
        );
      }
    }
  };

  // Filtered Posts
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(postSearch.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Comments
  const filteredComments = comments.filter((c) => {
    if (commentFilter === "all") return true;
    return c.status === commentFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-mono block mb-2">
            Dispatches & Editorial Architecture
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-ivory tracking-tight">
            Journal Manager
          </h1>
          <p className="text-stone text-sm mt-1 max-w-xl">
            Publish thought-leadership articles, screen reflections, and manage moderated member dialogues.
          </p>
        </div>

        {/* Action button */}
        {activeTab === "posts" && (
          <Button onClick={handleOpenCreate} variant="primary" className="shrink-0 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>New Dispatch</span>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-line">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-mono transition-colors border-b-2 ${
            activeTab === "posts"
              ? "border-gold text-gold font-bold bg-charcoal/50"
              : "border-transparent text-stone hover:text-ivory"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Articles & Essays ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("comments")}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-mono transition-colors border-b-2 relative ${
            activeTab === "comments"
              ? "border-gold text-gold font-bold bg-charcoal/50"
              : "border-transparent text-stone hover:text-ivory"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Comment Moderation</span>
          {pendingCommentsCount > 0 && (
            <span className="ml-1.5 px-2 py-0.5 text-[10px] bg-gold text-ink font-bold rounded-full">
              {pendingCommentsCount} Pending
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ARTICLES */}
      {activeTab === "posts" && (
        <div className="space-y-6">
          {/* Filter / Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-charcoal/40 p-4 border border-line">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles by title, tag, slug..."
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                className="w-full bg-ink border border-line pl-10 pr-4 py-2 text-xs text-ivory placeholder:text-stone/60 focus:outline-none focus:border-gold"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] uppercase tracking-wider text-stone font-mono">Status:</span>
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 text-xs font-mono ${
                  statusFilter === "all" ? "bg-gold text-ink font-bold" : "text-stone hover:text-ivory"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("published")}
                className={`px-3 py-1 text-xs font-mono ${
                  statusFilter === "published"
                    ? "bg-gold text-ink font-bold"
                    : "text-stone hover:text-ivory"
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setStatusFilter("draft")}
                className={`px-3 py-1 text-xs font-mono ${
                  statusFilter === "draft"
                    ? "bg-gold text-ink font-bold"
                    : "text-stone hover:text-ivory"
                }`}
              >
                Drafts
              </button>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-charcoal border border-line hover:border-line-gold transition-all duration-300 flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  {/* Cover Image & Badges */}
                  <div className="relative h-48 w-full bg-ink overflow-hidden">
                    <Image
                      src={post.cover_url || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-black/30" />

                    {/* Status Pill */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase ${
                          post.status === "published"
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                            : "bg-stone/20 text-stone border border-stone/30"
                        }`}
                      >
                        {post.status}
                      </span>

                      {post.members_only && (
                        <span className="px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase bg-gold/90 text-ink font-bold flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Inner Circle
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2 right-3 flex items-center gap-2 text-[11px] font-mono text-stone bg-ink/80 px-2 py-0.5 border border-line">
                      <Clock className="w-3 h-3 text-gold" />
                      <span>{post.reading_minutes} min read</span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(post.tags || []).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-mono bg-ink text-gold border border-line"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-display text-xl text-ivory line-clamp-2 leading-snug group-hover:text-gold transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-stone text-xs line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="text-[11px] font-mono text-stone/80 pt-2 border-t border-line/60 flex items-center justify-between">
                      <span>/{post.slug}</span>
                      <span>{post.views} views</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-ink/50 border-t border-line flex items-center justify-between">
                  <Link
                    href={`/journal/${post.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs text-stone hover:text-gold transition-colors font-mono"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Live</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(post)}
                      className="p-1.5 text-stone hover:text-ivory border border-line hover:border-gold/50 bg-charcoal transition-colors"
                      title="Edit Dispatch"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeletingPostId(post.id)}
                      className="p-1.5 text-stone hover:text-red-400 border border-line hover:border-red-500/50 bg-charcoal transition-colors"
                      title="Delete Dispatch"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16 bg-charcoal/30 border border-line">
              <BookOpen className="w-10 h-10 text-stone/40 mx-auto mb-3" />
              <p className="text-ivory text-sm">No dispatches match your query.</p>
              <p className="text-stone text-xs mt-1">Create a new editorial piece to begin.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMMENT MODERATION QUEUE */}
      {activeTab === "comments" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4 bg-charcoal/40 p-4 border border-line">
            <span className="text-xs uppercase tracking-wider font-mono text-stone">
              Filter By Review Status:
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCommentFilter("all")}
                className={`px-3 py-1 text-xs font-mono ${
                  commentFilter === "all" ? "bg-gold text-ink font-bold" : "text-stone hover:text-ivory"
                }`}
              >
                All ({comments.length})
              </button>
              <button
                onClick={() => setCommentFilter("pending")}
                className={`px-3 py-1 text-xs font-mono relative ${
                  commentFilter === "pending"
                    ? "bg-gold text-ink font-bold"
                    : "text-stone hover:text-ivory"
                }`}
              >
                Pending ({pendingCommentsCount})
              </button>
              <button
                onClick={() => setCommentFilter("approved")}
                className={`px-3 py-1 text-xs font-mono ${
                  commentFilter === "approved"
                    ? "bg-gold text-ink font-bold"
                    : "text-stone hover:text-ivory"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setCommentFilter("rejected")}
                className={`px-3 py-1 text-xs font-mono ${
                  commentFilter === "rejected"
                    ? "bg-gold text-ink font-bold"
                    : "text-stone hover:text-ivory"
                }`}
              >
                Rejected
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-charcoal border border-line p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-line-gold transition-colors"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${
                        comment.status === "approved"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : comment.status === "rejected"
                          ? "bg-red-950 text-red-400 border border-red-800"
                          : "bg-amber-950 text-amber-300 border border-amber-800"
                      }`}
                    >
                      {comment.status}
                    </span>

                    <span className="text-xs font-mono text-stone">
                      {new Date(comment.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    {comment.postTitle && (
                      <span className="text-xs text-gold font-mono truncate max-w-xs">
                        &bull; on &quot;{comment.postTitle}&quot;
                      </span>
                    )}
                  </div>

                  <p className="text-ivory text-sm leading-relaxed bg-ink/40 p-3 border border-line/60">
                    &ldquo;{comment.body}&rdquo;
                  </p>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {comment.status !== "approved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModerateComment(comment.id, "approved")}
                      disabled={isModerating === comment.id}
                      className="border-emerald-700/60 text-emerald-400 hover:bg-emerald-950/60 text-xs py-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Approve
                    </Button>
                  )}

                  {comment.status !== "rejected" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModerateComment(comment.id, "rejected")}
                      disabled={isModerating === comment.id}
                      className="border-amber-700/60 text-amber-300 hover:bg-amber-950/60 text-xs py-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      Reject
                    </Button>
                  )}

                  <button
                    onClick={() => handleModerateComment(comment.id, "delete")}
                    disabled={isModerating === comment.id}
                    className="p-2 text-stone hover:text-red-400 border border-line bg-ink transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredComments.length === 0 && (
              <div className="text-center py-12 bg-charcoal/30 border border-line text-stone text-xs">
                No comments found in this queue.
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE / EDIT POST MODAL */}
      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title={editingPost ? "Edit Journal Dispatch" : "Draft New Journal Dispatch"}
      >
        <form onSubmit={handleSavePost} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
              Dispatch Title *
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. The Architecture of Personal Presence: Beyond Fashion"
              className="w-full bg-ink border border-line px-3.5 py-2.5 text-sm text-ivory focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                Slug (URL Identifier) *
              </label>
              <input
                type="text"
                required
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="the-architecture-of-personal-presence"
                className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                Tags (Comma-Separated)
              </label>
              <input
                type="text"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="Style, Presence, Editorial, Finance"
                className="w-full bg-ink border border-line px-3.5 py-2 text-xs text-ivory focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
              Editorial Excerpt (Teaser Summary) *
            </label>
            <textarea
              required
              rows={2}
              value={formExcerpt}
              onChange={(e) => setFormExcerpt(e.target.value)}
              placeholder="Brief 1-2 sentence lead statement displayed in cards and SEO meta..."
              className="w-full bg-ink border border-line px-3.5 py-2 text-xs text-ivory focus:outline-none focus:border-gold"
            />
          </div>

          <FileUploadInput
            label="Dispatch Cover Image (Direct Device Upload or Web URL)"
            name="cover_url"
            defaultValue={formCover}
            required
            accept="image/*"
            placeholder="/uploads/... or https://..."
            onChange={(url) => setFormCover(url)}
          />

          {/* Formatted Content Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                Dispatch Body (HTML / Editorial Formatter) *
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => insertFormatting("<h2>", "</h2>")}
                  className="px-2 py-0.5 bg-ink text-[10px] font-mono border border-line text-stone hover:text-gold"
                >
                  +H2
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("<p class='lead'>", "</p>")}
                  className="px-2 py-0.5 bg-ink text-[10px] font-mono border border-line text-stone hover:text-gold"
                >
                  +Lead
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("<blockquote>", "</blockquote>")}
                  className="px-2 py-0.5 bg-ink text-[10px] font-mono border border-line text-stone hover:text-gold"
                >
                  +Quote
                </button>
              </div>
            </div>

            <textarea
              required
              rows={8}
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              className="w-full bg-ink border border-line p-3 font-mono text-xs text-ivory leading-relaxed focus:outline-none focus:border-gold"
            />
          </div>

          {/* Settings Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-line">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                Publication Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as "draft" | "published")}
                className="w-full bg-ink border border-line px-3 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
              >
                <option value="published">Published (Live to public)</option>
                <option value="draft">Draft (Restricted to admin)</option>
              </select>
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-3 cursor-pointer py-2">
                <input
                  type="checkbox"
                  checked={formMembersOnly}
                  onChange={(e) => setFormMembersOnly(e.target.checked)}
                  className="w-4 h-4 rounded-none accent-gold bg-ink border-line"
                />
                <span className="text-xs text-ivory font-mono">
                  Members-Only Exclusive (Inner Circle Gate)
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPostModalOpen(false)}
              disabled={isSavingPost}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSavingPost}>
              {isSavingPost ? "Saving Dispatch..." : editingPost ? "Update Dispatch" : "Publish Dispatch"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!deletingPostId}
        onClose={() => setDeletingPostId(null)}
        title="Confirm Deletion of Dispatch"
      >
        <div className="space-y-5">
          <p className="text-stone text-sm leading-relaxed">
            Are you sure you wish to permanently delete this dispatch? This will remove its content, comment history, and member bookmarks from the live database.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeletingPostId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-red-700 hover:bg-red-800 text-white border-red-600"
              onClick={() => deletingPostId && handleDeletePost(deletingPostId)}
            >
              Confirm Permanent Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
