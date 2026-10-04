"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Quote,
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  saveTestimonialAction,
  deleteTestimonialAction,
  savePressItemAction,
  deletePressItemAction,
} from "@/lib/supabase/admin-actions";

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  body: string;
  avatar_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface PressItem {
  id: string;
  outlet: string;
  title: string;
  url: string;
  date: string;
  logo_url: string | null;
  is_published: boolean;
  sort_order: number;
}

interface TestimonialsPressManagerProps {
  initialTestimonials: TestimonialItem[];
  initialPressItems: PressItem[];
}

export function TestimonialsPressManager({
  initialTestimonials,
  initialPressItems,
}: TestimonialsPressManagerProps) {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<"testimonials" | "press">("testimonials");

  // Testimonials state
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [deletingTestimonialId, setDeletingTestimonialId] = useState<string | null>(null);
  const [isSavingTestimonial, setIsSavingTestimonial] = useState(false);

  // Press state
  const [pressItems, setPressItems] = useState<PressItem[]>(initialPressItems);
  const [isPressModalOpen, setIsPressModalOpen] = useState(false);
  const [editingPress, setEditingPress] = useState<PressItem | null>(null);
  const [deletingPressId, setDeletingPressId] = useState<string | null>(null);
  const [isSavingPress, setIsSavingPress] = useState(false);

  // Toggle Testimonial Publish
  const handleToggleTestimonialPublish = async (item: TestimonialItem) => {
    const nextState = !item.is_published;
    const res = await saveTestimonialAction({
      ...item,
      is_published: nextState,
    });

    if (res.error) {
      error(res.error);
    } else {
      success(nextState ? `"${item.name}" published live.` : `"${item.name}" reverted to draft.`);
      setTestimonials((prev) =>
        prev.map((t) => (t.id === item.id ? { ...t, is_published: nextState } : t))
      );
    }
  };

  // Toggle Press Publish
  const handleTogglePressPublish = async (item: PressItem) => {
    const nextState = !item.is_published;
    const res = await savePressItemAction({
      ...item,
      is_published: nextState,
    });

    if (res.error) {
      error(res.error);
    } else {
      success(nextState ? `"${item.outlet}" published live.` : `"${item.outlet}" reverted to draft.`);
      setPressItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, is_published: nextState } : p))
      );
    }
  };

  // Save Testimonial Form
  const handleSaveTestimonial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingTestimonial(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      id: editingTestimonial?.id,
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      body: formData.get("body") as string,
      avatar_url: (formData.get("avatar_url") as string) || null,
      is_published: formData.get("is_published") === "on",
      sort_order: Number(formData.get("sort_order") || 1),
    };

    const res = await saveTestimonialAction(payload);
    setIsSavingTestimonial(false);

    if (res.error) {
      error(res.error);
    } else {
      success(res.message || "Testimonial saved.");
      setIsTestimonialModalOpen(false);
      if (editingTestimonial) {
        setTestimonials((prev) =>
          prev.map((t) =>
            t.id === editingTestimonial.id
              ? {
                  ...t,
                  name: payload.name,
                  role: payload.role,
                  body: payload.body,
                  avatar_url: payload.avatar_url,
                  is_published: payload.is_published,
                  sort_order: payload.sort_order,
                }
              : t
          )
        );
      } else {
        const newItem: TestimonialItem = {
          id: `test-${Date.now()}`,
          name: payload.name,
          role: payload.role,
          body: payload.body,
          avatar_url: payload.avatar_url,
          is_published: payload.is_published,
          sort_order: payload.sort_order,
        };
        setTestimonials((prev) => [...prev, newItem]);
      }
    }
  };

  // Delete Testimonial
  const handleDeleteTestimonial = async (id: string) => {
    const res = await deleteTestimonialAction(id);
    if (res.error) {
      error(res.error);
    } else {
      success("Testimonial removed.");
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      setDeletingTestimonialId(null);
    }
  };

  // Save Press Form
  const handleSavePress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingPress(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      id: editingPress?.id,
      outlet: formData.get("outlet") as string,
      title: formData.get("title") as string,
      url: formData.get("url") as string,
      date: formData.get("date") as string,
      logo_url: (formData.get("logo_url") as string) || null,
      is_published: formData.get("is_published") === "on",
      sort_order: Number(formData.get("sort_order") || 1),
    };

    const res = await savePressItemAction(payload);
    setIsSavingPress(false);

    if (res.error) {
      error(res.error);
    } else {
      success(res.message || "Press item saved.");
      setIsPressModalOpen(false);
      if (editingPress) {
        setPressItems((prev) =>
          prev.map((p) =>
            p.id === editingPress.id
              ? {
                  ...p,
                  outlet: payload.outlet,
                  title: payload.title,
                  url: payload.url,
                  date: payload.date,
                  logo_url: payload.logo_url,
                  is_published: payload.is_published,
                  sort_order: payload.sort_order,
                }
              : p
          )
        );
      } else {
        const newItem: PressItem = {
          id: `press-${Date.now()}`,
          outlet: payload.outlet,
          title: payload.title,
          url: payload.url,
          date: payload.date,
          logo_url: payload.logo_url,
          is_published: payload.is_published,
          sort_order: payload.sort_order,
        };
        setPressItems((prev) => [...prev, newItem]);
      }
    }
  };

  // Delete Press Item
  const handleDeletePress = async (id: string) => {
    const res = await deletePressItemAction(id);
    if (res.error) {
      error(res.error);
    } else {
      success("Press mention removed.");
      setPressItems((prev) => prev.filter((p) => p.id !== id));
      setDeletingPressId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-mono block mb-2">
            Third-Party Validation & Press Repertoire
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-ivory tracking-tight">
            Testimonials & Press
          </h1>
          <p className="text-stone text-sm mt-1 max-w-xl">
            Curate verified endorsements and accredited media features. Unverified items remain quarantined until published.
          </p>
        </div>

        {activeTab === "testimonials" ? (
          <Button
            onClick={() => {
              setEditingTestimonial(null);
              setIsTestimonialModalOpen(true);
            }}
            variant="primary"
            className="shrink-0 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </Button>
        ) : (
          <Button
            onClick={() => {
              setEditingPress(null);
              setIsPressModalOpen(true);
            }}
            variant="primary"
            className="shrink-0 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Press Feature</span>
          </Button>
        )}
      </div>

      {/* Editorial Quarantine Notice */}
      <div className="p-4 bg-charcoal border border-line flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-stone">
          <strong className="text-ivory font-mono uppercase tracking-wider block mb-0.5">
            Strict Integrity Protocol
          </strong>
          In compliance with our brand guidelines, only items marked as{" "}
          <span className="text-emerald-400 font-mono font-bold">Published</span> will ever display on the public website. Placeholder and unverified entries remain draft-only.
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-line">
        <button
          onClick={() => setActiveTab("testimonials")}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-mono transition-colors border-b-2 ${
            activeTab === "testimonials"
              ? "border-gold text-gold font-bold bg-charcoal/50"
              : "border-transparent text-stone hover:text-ivory"
          }`}
        >
          <Quote className="w-4 h-4" />
          <span>Client Testimonials ({testimonials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("press")}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-mono transition-colors border-b-2 ${
            activeTab === "press"
              ? "border-gold text-gold font-bold bg-charcoal/50"
              : "border-transparent text-stone hover:text-ivory"
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Press & Media Mentions ({pressItems.length})</span>
        </button>
      </div>

      {/* TAB 1: TESTIMONIALS */}
      {activeTab === "testimonials" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-charcoal border border-line p-5 flex flex-col justify-between space-y-4 hover:border-line-gold transition-colors"
            >
              <div className="space-y-3">
                {/* Status Bar */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider border ${
                      test.is_published
                        ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                        : "bg-stone/20 text-stone border-stone/30"
                    }`}
                  >
                    {test.is_published ? "Live to Public" : "Draft (Hidden)"}
                  </span>

                  <span className="text-[10px] font-mono text-stone">Order: #{test.sort_order}</span>
                </div>

                {/* Quote Body */}
                <p className="text-ivory text-xs leading-relaxed italic bg-ink/50 p-4 border border-line/60">
                  &ldquo;{test.body}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-ink border border-line relative overflow-hidden shrink-0 flex items-center justify-center font-serif text-sm text-gold font-bold">
                    {test.avatar_url ? (
                      <Image
                        src={test.avatar_url}
                        alt={test.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      test.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="text-ivory text-sm font-semibold">{test.name}</h4>
                    <p className="text-stone text-[11px] font-mono">{test.role}</p>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-line/60">
                <button
                  onClick={() => handleToggleTestimonialPublish(test)}
                  className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 border transition-colors ${
                    test.is_published
                      ? "text-stone hover:text-amber-400 border-line bg-ink"
                      : "text-emerald-400 border-emerald-800 hover:bg-emerald-950 bg-ink"
                  }`}
                >
                  {test.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{test.is_published ? "Unpublish" : "Publish"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingTestimonial(test);
                      setIsTestimonialModalOpen(true);
                    }}
                    className="p-1.5 text-stone hover:text-ivory border border-line bg-ink transition-colors"
                    title="Edit Testimonial"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeletingTestimonialId(test.id)}
                    className="p-1.5 text-stone hover:text-red-400 border border-line bg-ink transition-colors"
                    title="Delete Testimonial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {testimonials.length === 0 && (
            <div className="col-span-full text-center py-16 bg-charcoal/30 border border-line">
              <Quote className="w-10 h-10 text-stone/40 mx-auto mb-3" />
              <p className="text-ivory text-sm">No testimonials registered.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRESS & MEDIA */}
      {activeTab === "press" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pressItems.map((press) => (
            <div
              key={press.id}
              className="bg-charcoal border border-line p-5 flex flex-col justify-between space-y-4 hover:border-line-gold transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider border ${
                      press.is_published
                        ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                        : "bg-stone/20 text-stone border-stone/30"
                    }`}
                  >
                    {press.is_published ? "Live to Public" : "Draft (Hidden)"}
                  </span>

                  <span className="text-[10px] font-mono text-stone">Order: #{press.sort_order}</span>
                </div>

                <div>
                  <div className="text-[11px] uppercase font-mono tracking-wider text-gold">
                    {press.outlet} &bull; {press.date}
                  </div>
                  <h3 className="font-display text-lg text-ivory mt-1 leading-snug">
                    {press.title}
                  </h3>
                </div>

                <div className="text-xs font-mono text-stone truncate bg-ink/50 p-2 border border-line">
                  <a
                    href={press.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gold flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{press.url}</span>
                  </a>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-line/60">
                <button
                  onClick={() => handleTogglePressPublish(press)}
                  className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 border transition-colors ${
                    press.is_published
                      ? "text-stone hover:text-amber-400 border-line bg-ink"
                      : "text-emerald-400 border-emerald-800 hover:bg-emerald-950 bg-ink"
                  }`}
                >
                  {press.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{press.is_published ? "Unpublish" : "Publish"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingPress(press);
                      setIsPressModalOpen(true);
                    }}
                    className="p-1.5 text-stone hover:text-ivory border border-line bg-ink transition-colors"
                    title="Edit Press Item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeletingPressId(press.id)}
                    className="p-1.5 text-stone hover:text-red-400 border border-line bg-ink transition-colors"
                    title="Delete Press Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {pressItems.length === 0 && (
            <div className="col-span-full text-center py-16 bg-charcoal/30 border border-line">
              <Newspaper className="w-10 h-10 text-stone/40 mx-auto mb-3" />
              <p className="text-ivory text-sm">No press features registered.</p>
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT TESTIMONIAL MODAL */}
      <Modal
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
        title={editingTestimonial ? "Edit Testimonial Endorsement" : "New Testimonial Endorsement"}
      >
        <form onSubmit={handleSaveTestimonial} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] uppercase font-mono text-stone">Endorser Name *</label>
            <input
              type="text"
              name="name"
              required
              defaultValue={editingTestimonial?.name || ""}
              placeholder="e.g. Senior Creative Director"
              className="w-full bg-ink border border-line px-3 py-2 text-xs text-ivory focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-mono text-stone">Title / Enterprise *</label>
            <input
              type="text"
              name="role"
              required
              defaultValue={editingTestimonial?.role || ""}
              placeholder="e.g. High-Fashion Production House"
              className="w-full bg-ink border border-line px-3 py-2 text-xs text-ivory focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-mono text-stone">Avatar Image URL</label>
            <input
              type="url"
              name="avatar_url"
              defaultValue={editingTestimonial?.avatar_url || ""}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-ink border border-line px-3 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-mono text-stone">Endorsement Quote *</label>
            <textarea
              name="body"
              required
              rows={4}
              defaultValue={editingTestimonial?.body || ""}
              placeholder="Vipul brings an unmatched aura of sophistication and poise to every frame..."
              className="w-full bg-ink border border-line p-3 text-xs text-ivory leading-relaxed focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-line">
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-mono text-stone">Sort Order</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={editingTestimonial?.sort_order || 1}
                className="w-full bg-ink border border-line px-3 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer py-2">
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={editingTestimonial?.is_published ?? false}
                  className="w-4 h-4 rounded-none accent-gold bg-ink border-line"
                />
                <span className="text-xs font-mono text-ivory">Publish to Public Site</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsTestimonialModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSavingTestimonial}>
              {isSavingTestimonial ? "Saving..." : "Save Testimonial"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CREATE / EDIT PRESS MODAL */}
      <Modal
        isOpen={isPressModalOpen}
        onClose={() => setIsPressModalOpen(false)}
        title={editingPress ? "Edit Press Feature" : "New Press Feature"}
      >
        <form onSubmit={handleSavePress} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] uppercase font-mono text-stone">Media Outlet *</label>
            <input
              type="text"
              name="outlet"
              required
              defaultValue={editingPress?.outlet || ""}
              placeholder="e.g. Entertainment Chronicle"
              className="w-full bg-ink border border-line px-3 py-2 text-xs text-ivory focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-mono text-stone">Headline Title *</label>
            <input
              type="text"
              name="title"
              required
              defaultValue={editingPress?.title || ""}
              placeholder="e.g. Spotlight on Mumbai Character Actors: The Crime World Ensemble"
              className="w-full bg-ink border border-line px-3 py-2 text-xs text-ivory focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-mono text-stone">Article URL *</label>
            <input
              type="url"
              name="url"
              required
              defaultValue={editingPress?.url || ""}
              placeholder="https://..."
              className="w-full bg-ink border border-line px-3 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-mono text-stone">Publication Date *</label>
              <input
                type="text"
                name="date"
                required
                defaultValue={editingPress?.date || "November 2022"}
                placeholder="e.g. November 2022"
                className="w-full bg-ink border border-line px-3 py-2 text-xs text-ivory focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase font-mono text-stone">Sort Order</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={editingPress?.sort_order || 1}
                className="w-full bg-ink border border-line px-3 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-line">
            <label className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={editingPress?.is_published ?? false}
                className="w-4 h-4 rounded-none accent-gold bg-ink border-line"
              />
              <span className="text-xs font-mono text-ivory">Publish to Public Site</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
            <Button type="button" variant="outline" onClick={() => setIsPressModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSavingPress}>
              {isSavingPress ? "Saving..." : "Save Press Feature"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE TESTIMONIAL MODAL */}
      <Modal
        isOpen={!!deletingTestimonialId}
        onClose={() => setDeletingTestimonialId(null)}
        title="Confirm Testimonial Removal"
      >
        <div className="space-y-5">
          <p className="text-stone text-sm leading-relaxed">
            Are you sure you wish to delete this testimonial endorsement?
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setDeletingTestimonialId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-red-700 hover:bg-red-800 text-white"
              onClick={() => deletingTestimonialId && handleDeleteTestimonial(deletingTestimonialId)}
            >
              Delete Testimonial
            </Button>
          </div>
        </div>
      </Modal>

      {/* DELETE PRESS MODAL */}
      <Modal
        isOpen={!!deletingPressId}
        onClose={() => setDeletingPressId(null)}
        title="Confirm Press Mention Removal"
      >
        <div className="space-y-5">
          <p className="text-stone text-sm leading-relaxed">
            Are you sure you wish to delete this press mention?
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setDeletingPressId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-red-700 hover:bg-red-800 text-white"
              onClick={() => deletingPressId && handleDeletePress(deletingPressId)}
            >
              Delete Press Mention
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
