"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, CheckCircle2, Lock, Unlock, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { saveVideoItemAction, deleteVideoItemAction } from "@/lib/supabase/content-actions";
import type { VideoItem } from "@/lib/supabase/videos";
import { FileUploadInput } from "./FileUploadInput";

interface VideoManagerProps {
  initialVideos: VideoItem[];
}

export function VideoManager({ initialVideos }: VideoManagerProps) {
  const { success, error } = useToast();
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingVideo(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (video: VideoItem) => {
    setEditingVideo(video);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      id: editingVideo?.id,
      title: formData.get("title") as string,
      platform: formData.get("platform") as "youtube" | "instagram",
      video_id: formData.get("video_id") as string,
      url: formData.get("url") as string,
      thumbnail_url: formData.get("thumbnail_url") as string,
      category: formData.get("category") as string,
      is_featured: formData.get("is_featured") === "on",
      members_only: formData.get("members_only") === "on",
      sort_order: Number(formData.get("sort_order") || 1),
    };

    const res = await saveVideoItemAction(payload);
    setIsSaving(false);

    if (res.error) {
      error(res.error, "Save Error");
    } else {
      success(res.message || "Video record saved.", "Success");
      setIsModalOpen(false);
      if (editingVideo) {
        setVideos((prev) =>
          prev.map((v) => (v.id === editingVideo.id ? ({ ...v, ...payload } as VideoItem) : v))
        );
      } else {
        setVideos((prev) => [
          ...prev,
          { ...payload, id: `vid-${Date.now()}`, created_at: new Date().toISOString() } as VideoItem,
        ]);
      }
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const res = await deleteVideoItemAction(deletingId);
    if (res.error) {
      error(res.error, "Delete Error");
    } else {
      success("Video record deleted.", "Success");
      setVideos((prev) => prev.filter((v) => v.id !== deletingId));
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="editorial-label text-gold text-xs">Section 05</span>
          <h2 className="font-serif text-3xl text-ivory font-light mt-1">
            Video &amp; Motion Repertoire Manager
          </h2>
          <p className="text-stone text-xs pt-1">
            Manage YouTube broadcasts, Crime World screen clips, and exclusive Inner Circle video briefings.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Video Record
        </Button>
      </div>

      {/* Videos Table */}
      <div className="border border-line bg-charcoal overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-ink border-b border-line text-stone editorial-label text-[10px]">
            <tr>
              <th className="py-3 px-4">Thumbnail</th>
              <th className="py-3 px-4">Platform &middot; Category</th>
              <th className="py-3 px-4">Title &amp; ID</th>
              <th className="py-3 px-4">Access Level</th>
              <th className="py-3 px-4">Featured</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {videos.map((vid) => (
              <tr key={vid.id} className="hover:bg-ink/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="relative w-16 h-10 border border-line bg-ink overflow-hidden">
                    <Image
                      src={
                        vid.thumbnail_url ||
                        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
                      }
                      alt={vid.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-ivory font-mono text-[11px] block uppercase font-medium">
                    {vid.platform}
                  </span>
                  <span className="editorial-label text-gold text-[9px]">{vid.category}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-ivory font-serif text-base block font-light">
                    {vid.title}
                  </span>
                  <span className="text-stone font-mono text-[10px]">ID: {vid.video_id}</span>
                </td>
                <td className="py-3 px-4">
                  {vid.members_only ? (
                    <span className="text-gold font-mono text-[10px] uppercase flex items-center space-x-1 border border-gold/40 px-2 py-0.5 w-fit">
                      <Lock className="w-3 h-3" />
                      <span>Inner Circle</span>
                    </span>
                  ) : (
                    <span className="text-stone font-mono text-[10px] uppercase">Public</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {vid.is_featured ? (
                    <span className="text-emerald-400 font-mono text-[10px] uppercase flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Featured</span>
                    </span>
                  ) : (
                    <span className="text-stone font-mono text-[10px]">Standard</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleOpenEdit(vid)}
                      className="p-1.5 border border-line text-stone hover:text-gold transition-colors"
                      title="Edit Video"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(vid.id)}
                      className="p-1.5 border border-line text-stone hover:text-red-400 transition-colors"
                      title="Delete Video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Video Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVideo ? "Edit Video Record" : "Add Video Record"}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="editorial-label text-stone block text-[10px]">Video Title</label>
            <input
              type="text"
              name="title"
              defaultValue={editingVideo?.title || ""}
              placeholder="e.g. Building Your Financial Portfolio Without Compromising Style"
              required
              className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Platform</label>
              <select
                name="platform"
                defaultValue={editingVideo?.platform || "youtube"}
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
              >
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram Reel</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Category</label>
              <input
                type="text"
                name="category"
                defaultValue={editingVideo?.category || "Wealth & Strategy"}
                required
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="editorial-label text-stone block text-[10px]">Video ID (YouTube/Reel ID)</label>
            <input
              type="text"
              name="video_id"
              defaultValue={editingVideo?.video_id || "dQw4w9WgXcQ"}
              required
              className="w-full bg-ink border border-line p-2.5 text-xs text-ivory font-mono focus:border-gold outline-none"
            />
          </div>

          <div className="space-y-4">
            <FileUploadInput
              label="Video File / Direct Stream URL (Upload MP4 from Device or enter YouTube/Reel URL)"
              name="url"
              defaultValue={editingVideo?.url || ""}
              required
              isVideo={true}
              accept="video/*"
              placeholder="/uploads/... or https://youtube.com/watch?v=..."
            />

            <FileUploadInput
              label="Video Thumbnail Image (Direct Device Upload or Web URL)"
              name="thumbnail_url"
              defaultValue={editingVideo?.thumbnail_url || ""}
              required
              accept="image/*"
              placeholder="/uploads/... or https://..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Sort Order</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={editingVideo?.sort_order || 1}
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory font-mono focus:border-gold outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={editingVideo?.is_featured ?? false}
                className="w-4 h-4 accent-[#B8965F]"
              />
              <span className="text-[11px] text-ivory">Featured Cinema</span>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                name="members_only"
                defaultChecked={editingVideo?.members_only ?? false}
                className="w-4 h-4 accent-[#B8965F]"
              />
              <span className="text-[11px] text-gold font-medium">Inner Circle Gated</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-line">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Video Record"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Confirm Video Deletion"
      >
        <div className="space-y-4 py-2 text-xs text-stone">
          <p>Are you sure you wish to delete this video record from the repertoire?</p>
          <div className="flex justify-end space-x-3 pt-4 border-t border-line">
            <Button variant="outline" size="sm" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white border-none">
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
