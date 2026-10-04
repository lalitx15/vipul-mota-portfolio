"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, ArrowUpRight, CheckCircle2, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { saveWorkItemAction, deleteWorkItemAction } from "@/lib/supabase/content-actions";
import type { WorkItem } from "@/lib/supabase/work";
import { FileUploadInput } from "./FileUploadInput";

interface WorkManagerProps {
  initialItems: WorkItem[];
}

export function WorkManager({ initialItems }: WorkManagerProps) {
  const { success, error } = useToast();
  const [items, setItems] = useState<WorkItem[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: WorkItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      id: editingItem?.id,
      type: formData.get("type") as "acting" | "modeling" | "venture",
      slug: (formData.get("slug") as string).toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      title: formData.get("title") as string,
      role: (formData.get("role") as string) || undefined,
      year: (formData.get("year") as string) || undefined,
      platform: (formData.get("platform") as string) || undefined,
      description: formData.get("description") as string,
      cover_url: formData.get("cover_url") as string,
      external_url: (formData.get("external_url") as string) || undefined,
      is_featured: formData.get("is_featured") === "on",
      status: (formData.get("status") as "draft" | "published") || "published",
      sort_order: Number(formData.get("sort_order") || 1),
    };

    const res = await saveWorkItemAction(payload);
    setIsSaving(false);

    if (res.error) {
      error(res.error, "Save Error");
    } else {
      success(res.message || "Work portfolio case saved.", "Success");
      setIsModalOpen(false);
      if (editingItem) {
        setItems((prev) =>
          prev.map((i) => (i.id === editingItem.id ? ({ ...i, ...payload } as WorkItem) : i))
        );
      } else {
        setItems((prev) => [
          ...prev,
          {
            ...payload,
            id: `work-${Date.now()}`,
            meta: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as WorkItem,
        ]);
      }
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const res = await deleteWorkItemAction(deletingId);
    if (res.error) {
      error(res.error, "Delete Error");
    } else {
      success("Work item removed.", "Success");
      setItems((prev) => prev.filter((i) => i.id !== deletingId));
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="editorial-label text-gold text-xs">Section 03</span>
          <h2 className="font-serif text-3xl text-ivory font-light mt-1">
            Work, Credits &amp; Ventures Manager
          </h2>
          <p className="text-stone text-xs pt-1">
            Maintain screen acting credits (Crime World on ShemarooMe), bespoke sartorial lookbooks, and Javi Groups commercial dossiers.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Portfolio Case
        </Button>
      </div>

      {/* Table of Work Items */}
      <div className="border border-line bg-charcoal overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-ink border-b border-line text-stone editorial-label text-[10px]">
            <tr>
              <th className="py-3 px-4">Preview</th>
              <th className="py-3 px-4">Discipline</th>
              <th className="py-3 px-4">Title &amp; Role</th>
              <th className="py-3 px-4">Platform &middot; Year</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-ink/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="relative w-16 h-10 border border-line bg-ink overflow-hidden">
                    <Image src={item.cover_url} alt={item.title} fill className="object-cover" />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="editorial-label text-gold text-[10px] uppercase font-mono">
                    {item.type}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-ivory font-serif text-base block font-light">
                    {item.title}
                  </span>
                  {item.role && (
                    <span className="text-stone text-xs block">
                      Role: <span className="text-ivory/80">{item.role}</span>
                    </span>
                  )}
                  <span className="text-stone font-mono text-[10px]">Slug: /work/{item.slug}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-ivory font-mono text-xs block">{item.platform || "Direct"}</span>
                  <span className="text-stone font-mono text-[10px]">{item.year || "2026"}</span>
                </td>
                <td className="py-3 px-4">
                  {item.status === "published" ? (
                    <span className="text-emerald-400 font-mono text-[10px] uppercase flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Published</span>
                    </span>
                  ) : (
                    <span className="text-amber-400 font-mono text-[10px] uppercase flex items-center space-x-1">
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Draft</span>
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 border border-line text-stone hover:text-gold transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(item.id)}
                      className="p-1.5 border border-line text-stone hover:text-red-400 transition-colors"
                      title="Delete Item"
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

      {/* Add / Edit Work Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Work Case" : "Add Portfolio Case"}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Discipline Type</label>
              <select
                name="type"
                defaultValue={editingItem?.type || "acting"}
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
              >
                <option value="acting">Acting &amp; Cinema</option>
                <option value="modeling">Fashion Modeling Lookbook</option>
                <option value="venture">Javi Groups &amp; Commercial</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">URL Slug</label>
              <input
                type="text"
                name="slug"
                defaultValue={editingItem?.slug || ""}
                placeholder="crime-world-2022"
                required
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory font-mono focus:border-gold outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="editorial-label text-stone block text-[10px]">Project Title</label>
            <input
              type="text"
              name="title"
              defaultValue={editingItem?.title || ""}
              required
              className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Role / Character</label>
              <input
                type="text"
                name="role"
                defaultValue={editingItem?.role || ""}
                placeholder="e.g. Neighbour"
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Year / Timeline</label>
              <input
                type="text"
                name="year"
                defaultValue={editingItem?.year || "2022"}
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory font-mono focus:border-gold outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Platform / Network</label>
              <input
                type="text"
                name="platform"
                defaultValue={editingItem?.platform || "ShemarooMe"}
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
              />
            </div>
          </div>

          <FileUploadInput
            label="Cover Poster / Still Asset (Direct Device Upload or Web URL)"
            name="cover_url"
            defaultValue={editingItem?.cover_url || ""}
            required
            accept="image/*"
            placeholder="/uploads/... or https://..."
          />

          <div className="space-y-1">
            <label className="editorial-label text-stone block text-[10px]">External Watch / Reference Link</label>
            <input
              type="url"
              name="external_url"
              defaultValue={editingItem?.external_url || ""}
              placeholder="https://..."
              className="w-full bg-ink border border-line p-2.5 text-xs text-ivory font-mono focus:border-gold outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="editorial-label text-stone block text-[10px]">Narrative Description</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={editingItem?.description || ""}
              required
              className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Publication Status</label>
              <select
                name="status"
                defaultValue={editingItem?.status || "published"}
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory focus:border-gold outline-none"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="editorial-label text-stone block text-[10px]">Sort Order</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={editingItem?.sort_order || 1}
                className="w-full bg-ink border border-line p-2.5 text-xs text-ivory font-mono focus:border-gold outline-none"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={editingItem?.is_featured ?? true}
                className="w-4 h-4 accent-[#B8965F]"
              />
              <span className="text-[11px] text-ivory">Featured Item</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-line">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Work Case"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Confirm Work Deletion"
      >
        <div className="space-y-4 py-2 text-xs text-stone">
          <p>Are you sure you wish to delete this portfolio case? Public links to this slug will cease to function.</p>
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
