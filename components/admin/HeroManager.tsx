"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { saveHeroSlideAction, deleteHeroSlideAction } from "@/lib/supabase/content-actions";
import type { HeroSlide } from "@/lib/supabase/home";

interface HeroManagerProps {
  initialSlides: HeroSlide[];
}

export function HeroManager({ initialSlides }: HeroManagerProps) {
  const { success, error } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingSlide(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      id: editingSlide?.id,
      headline_line1: formData.get("headline_line1") as string,
      headline_line2: formData.get("headline_line2") as string,
      tagline: formData.get("tagline") as string,
      image_url: formData.get("image_url") as string,
      cta_text: formData.get("cta_text") as string,
      cta_link: formData.get("cta_link") as string,
      is_active: formData.get("is_active") === "on",
      sort_order: Number(formData.get("sort_order") || 1),
    };

    const res = await saveHeroSlideAction(payload);
    setIsSaving(false);

    if (res.error) {
      error(res.error, "Save Error");
    } else {
      success(res.message || "Hero slide saved.", "Success");
      setIsModalOpen(false);
      // Optimistic update
      if (editingSlide) {
        setSlides((prev) =>
          prev.map((s) => (s.id === editingSlide.id ? ({ ...s, ...payload } as HeroSlide) : s))
        );
      } else {
        setSlides((prev) => [
          ...prev,
          { ...payload, id: `hero-${Date.now()}`, created_at: new Date().toISOString() } as HeroSlide,
        ]);
      }
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const res = await deleteHeroSlideAction(deletingId);
    if (res.error) {
      error(res.error, "Delete Error");
    } else {
      success("Hero slide deleted.", "Success");
      setSlides((prev) => prev.filter((s) => s.id !== deletingId));
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="editorial-label text-gold text-xs">Section 01</span>
          <h2 className="font-serif text-3xl text-ivory font-light mt-1">
            Hero &amp; Showcase Manager
          </h2>
          <p className="text-stone text-xs pt-1">
            Manage the primary homepage viewport photography, typography reveals, and button targets.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Hero Slide
        </Button>
      </div>

      {/* Slides Table */}
      <div className="border border-line bg-charcoal overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-ink border-b border-line text-stone editorial-label text-[10px]">
            <tr>
              <th className="py-3 px-4">Preview</th>
              <th className="py-3 px-4">Headlines</th>
              <th className="py-3 px-4">Tagline</th>
              <th className="py-3 px-4">CTA Target</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {slides.map((slide) => (
              <tr key={slide.id} className="hover:bg-ink/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="relative w-16 h-10 border border-line bg-ink overflow-hidden">
                    <Image
                      src={slide.image_url}
                      alt={slide.headline_line1}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-ivory font-serif text-sm block">
                    {slide.headline_line1} {slide.headline_line2}
                  </span>
                  <span className="text-stone font-mono text-[10px]">Order: {slide.sort_order}</span>
                </td>
                <td className="py-3 px-4 text-stone max-w-xs truncate">
                  {slide.tagline}
                </td>
                <td className="py-3 px-4">
                  <span className="text-ivory font-mono text-[11px] block">{slide.cta_text || "Explore"}</span>
                  <span className="text-stone font-mono text-[10px]">{slide.cta_link || "/work"}</span>
                </td>
                <td className="py-3 px-4">
                  {slide.is_active ? (
                    <span className="flex items-center space-x-1 text-emerald-400 font-mono text-[10px] uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-stone font-mono text-[10px] uppercase">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Inactive</span>
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleOpenEdit(slide)}
                      className="p-1.5 border border-line text-stone hover:text-gold transition-colors"
                      title="Edit Slide"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(slide.id)}
                      className="p-1.5 border border-line text-stone hover:text-red-400 transition-colors"
                      title="Delete Slide"
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

      {/* Add / Edit Slide Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSlide ? "Edit Hero Slide" : "Create New Hero Slide"}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Headline Line 1</label>
              <input
                type="text"
                name="headline_line1"
                defaultValue={editingSlide?.headline_line1 || "VIPUL"}
                required
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Headline Line 2 (Italic)</label>
              <input
                type="text"
                name="headline_line2"
                defaultValue={editingSlide?.headline_line2 || "MOTA"}
                required
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="editorial-label text-stone block text-[10px]">Tagline / Roles Subtitle</label>
            <input
              type="text"
              name="tagline"
              defaultValue={editingSlide?.tagline || "Actor · Fashion Model · Founder of Javi Groups"}
              required
              className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="editorial-label text-stone block text-[10px]">Background Portrait Image URL</label>
            <input
              type="url"
              name="image_url"
              defaultValue={editingSlide?.image_url || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1800&auto=format&fit=crop"}
              required
              className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Button Label</label>
              <input
                type="text"
                name="cta_text"
                defaultValue={editingSlide?.cta_text || "Explore Archive"}
                required
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Button Link Destination</label>
              <input
                type="text"
                name="cta_link"
                defaultValue={editingSlide?.cta_link || "/work"}
                required
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Sort Order</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={editingSlide?.sort_order || 1}
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none font-mono"
              />
            </div>

            <div className="flex items-center space-x-3 pt-5">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={editingSlide ? editingSlide.is_active : true}
                className="w-4 h-4 accent-[#B8965F]"
              />
              <span className="text-xs text-ivory">Slide is Active on Homepage</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-line">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Hero Slide"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Confirm Slide Deletion"
      >
        <div className="space-y-4 py-2 text-xs text-stone">
          <p>Are you sure you wish to delete this hero slide? This action cannot be undone.</p>
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
