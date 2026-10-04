"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { saveGalleryItemAction, deleteGalleryItemAction } from "@/lib/supabase/content-actions";
import type { GalleryItem } from "@/lib/supabase/gallery";
import { FileUploadInput } from "./FileUploadInput";

interface GalleryManagerProps {
  initialPlates: GalleryItem[];
}

export function GalleryManager({ initialPlates }: GalleryManagerProps) {
  const { success, error } = useToast();
  const [plates, setPlates] = useState<GalleryItem[]>(initialPlates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlate, setEditingPlate] = useState<GalleryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingPlate(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plate: GalleryItem) => {
    setEditingPlate(plate);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      id: editingPlate?.id,
      image_url: formData.get("image_url") as string,
      category: formData.get("category") as
        | "Portraits"
        | "Editorial"
        | "Lifestyle"
        | "Events"
        | "Behind the scenes",
      caption: (formData.get("caption") as string) || undefined,
      alt_text: (formData.get("alt_text") as string) || undefined,
      is_featured: formData.get("is_featured") === "on",
      sort_order: Number(formData.get("sort_order") || 1),
    };

    const res = await saveGalleryItemAction(payload);
    setIsSaving(false);

    if (res.error) {
      error(res.error, "Save Error");
    } else {
      success(res.message || "Lookbook plate saved.", "Success");
      setIsModalOpen(false);
      if (editingPlate) {
        setPlates((prev) =>
          prev.map((p) => (p.id === editingPlate.id ? ({ ...p, ...payload } as GalleryItem) : p))
        );
      } else {
        setPlates((prev) => [
          ...prev,
          { ...payload, id: `gal-${Date.now()}`, created_at: new Date().toISOString() } as GalleryItem,
        ]);
      }
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const res = await deleteGalleryItemAction(deletingId);
    if (res.error) {
      error(res.error, "Delete Error");
    } else {
      success("Lookbook plate removed.", "Success");
      setPlates((prev) => prev.filter((p) => p.id !== deletingId));
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="editorial-label text-gold text-xs">Section 04</span>
          <h2 className="font-serif text-3xl text-ivory font-light mt-1">
            Lookbook &amp; Photographic Gallery Manager
          </h2>
          <p className="text-stone text-xs pt-1">
            Curate high-contrast monochrome studio portraits, Marine Drive tailoring plates, and set stills.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lookbook Plate
        </Button>
      </div>

      {/* Plates Table */}
      <div className="border border-line bg-charcoal overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-ink border-b border-line text-stone editorial-label text-[10px]">
            <tr>
              <th className="py-3 px-4">Preview</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Caption / Title</th>
              <th className="py-3 px-4">Featured</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {plates.map((plate) => (
              <tr key={plate.id} className="hover:bg-ink/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="relative w-14 h-14 border border-line bg-ink overflow-hidden">
                    <Image src={plate.image_url} alt={plate.alt_text || "Plate"} fill className="object-cover" />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="editorial-label text-gold text-[10px] uppercase font-mono">
                    {plate.category}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-ivory font-serif text-sm block font-light">
                    {plate.caption || "Untitled Lookbook Plate"}
                  </span>
                  <span className="text-stone font-mono text-[10px]">Order: {plate.sort_order}</span>
                </td>
                <td className="py-3 px-4">
                  {plate.is_featured ? (
                    <span className="text-emerald-400 font-mono text-[10px] uppercase flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Featured</span>
                    </span>
                  ) : (
                    <span className="text-stone font-mono text-[10px] uppercase">Standard</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleOpenEdit(plate)}
                      className="p-1.5 border border-line text-stone hover:text-gold transition-colors"
                      title="Edit Plate"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(plate.id)}
                      className="p-1.5 border border-line text-stone hover:text-red-400 transition-colors"
                      title="Delete Plate"
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

      {/* Add / Edit Plate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlate ? "Edit Lookbook Plate" : "Add Lookbook Plate"}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <FileUploadInput
            label="Photographic Image (Direct Device Upload or Web URL)"
            name="image_url"
            defaultValue={editingPlate?.image_url || ""}
            required
            placeholder="/uploads/... or https://..."
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Classification Category</label>
              <select
                name="category"
                defaultValue={editingPlate?.category || "Editorial"}
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
              >
                <option value="Portraits">Portraits</option>
                <option value="Editorial">Editorial</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Events">Events</option>
                <option value="Behind the scenes">Behind the scenes</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Sort Order</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={editingPlate?.sort_order || 1}
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory font-mono focus:border-gold outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="editorial-label text-stone block text-[10px]">Editorial Caption / Plate Title</label>
            <input
              type="text"
              name="caption"
              defaultValue={editingPlate?.caption || ""}
              placeholder="Plate 01 — Monochrome Tailoring Study, Mumbai"
              className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="editorial-label text-stone block text-[10px]">Alt Text / Accessibility Description</label>
            <input
              type="text"
              name="alt_text"
              defaultValue={editingPlate?.alt_text || ""}
              placeholder="Vipul Mota in bespoke suit"
              className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={editingPlate?.is_featured ?? true}
              className="w-4 h-4 accent-[#B8965F]"
            />
            <span className="text-xs text-ivory">Feature in Lookbook Highlights</span>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-line">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Lookbook Plate"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Confirm Plate Deletion"
      >
        <div className="space-y-4 py-2 text-xs text-stone">
          <p>Are you sure you wish to delete this photographic plate from the archive?</p>
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
