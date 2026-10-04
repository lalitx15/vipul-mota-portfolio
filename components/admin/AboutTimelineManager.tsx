"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { saveTimelineItemAction, deleteTimelineItemAction } from "@/lib/supabase/content-actions";
import type { TimelineItem } from "@/lib/supabase/about";
import { FileUploadInput } from "./FileUploadInput";

interface AboutTimelineManagerProps {
  initialMilestones: TimelineItem[];
}

export function AboutTimelineManager({
  initialMilestones,
}: AboutTimelineManagerProps) {
  const { success, error } = useToast();
  const [milestones, setMilestones] = useState<TimelineItem[]>(initialMilestones);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<TimelineItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingMilestone(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TimelineItem) => {
    setEditingMilestone(item);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      id: editingMilestone?.id,
      year: formData.get("year") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image_url: (formData.get("image_url") as string) || undefined,
      sort_order: Number(formData.get("sort_order") || 1),
    };

    const res = await saveTimelineItemAction(payload);
    setIsSaving(false);

    if (res.error) {
      error(res.error, "Save Error");
    } else {
      success(res.message || "Timeline milestone saved.", "Success");
      setIsModalOpen(false);
      if (editingMilestone) {
        setMilestones((prev) =>
          prev.map((m) => (m.id === editingMilestone.id ? ({ ...m, ...payload } as TimelineItem) : m))
        );
      } else {
        setMilestones((prev) => [
          ...prev,
          { ...payload, id: `time-${Date.now()}`, created_at: new Date().toISOString() } as TimelineItem,
        ]);
      }
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const res = await deleteTimelineItemAction(deletingId);
    if (res.error) {
      error(res.error, "Delete Error");
    } else {
      success("Timeline milestone removed.", "Success");
      setMilestones((prev) => prev.filter((m) => m.id !== deletingId));
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="editorial-label text-gold text-xs">Section 02</span>
          <h2 className="font-serif text-3xl text-ivory font-light mt-1">
            Timeline Milestones &amp; Journey
          </h2>
          <p className="text-stone text-xs pt-1">
            Curate chronological milestones presented on the Biography (/about) page.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      {/* Milestones Table */}
      <div className="border border-line bg-charcoal overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-ink border-b border-line text-stone editorial-label text-[10px]">
            <tr>
              <th className="py-3 px-4">Year</th>
              <th className="py-3 px-4">Milestone Title</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Image Still</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {milestones.map((item) => (
              <tr key={item.id} className="hover:bg-ink/30 transition-colors">
                <td className="py-3 px-4">
                  <span className="editorial-label text-gold font-mono text-xs bg-ink border border-line px-2 py-1">
                    {item.year}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-ivory font-serif text-base block font-light">
                    {item.title}
                  </span>
                  <span className="text-stone font-mono text-[10px]">Order: {item.sort_order}</span>
                </td>
                <td className="py-3 px-4 text-stone max-w-sm line-clamp-2">
                  {item.description}
                </td>
                <td className="py-3 px-4">
                  {item.image_url ? (
                    <div className="relative w-14 h-9 border border-line bg-ink overflow-hidden">
                      <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <span className="text-stone font-mono text-[10px]">None</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 border border-line text-stone hover:text-gold transition-colors"
                      title="Edit Milestone"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(item.id)}
                      className="p-1.5 border border-line text-stone hover:text-red-400 transition-colors"
                      title="Delete Milestone"
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

      {/* Add / Edit Milestone Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMilestone ? "Edit Timeline Milestone" : "Add Timeline Milestone"}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Milestone Year</label>
              <input
                type="text"
                name="year"
                defaultValue={editingMilestone?.year || "2026"}
                required
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory font-mono focus:border-gold outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Sort Order</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={editingMilestone?.sort_order || 1}
                required
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory font-mono focus:border-gold outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="editorial-label text-stone block text-[10px]">Milestone Title</label>
            <input
              type="text"
              name="title"
              defaultValue={editingMilestone?.title || ""}
              placeholder="e.g. Screen Debut: Crime World"
              required
              className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="editorial-label text-stone block text-[10px]">Description &amp; Context</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={editingMilestone?.description || ""}
              required
              className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none resize-none leading-relaxed"
            />
          </div>

          <FileUploadInput
            label="Archive Milestone Image (Direct Device Upload or Web URL)"
            name="image_url"
            defaultValue={editingMilestone?.image_url || ""}
            accept="image/*"
            placeholder="/uploads/... or https://..."
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-line">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Milestone"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Confirm Milestone Deletion"
      >
        <div className="space-y-4 py-2 text-xs text-stone">
          <p>Are you sure you wish to delete this milestone? It will be permanently removed from the journey timeline.</p>
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
