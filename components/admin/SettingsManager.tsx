"use client";

import React, { useState } from "react";
import {
  Settings,
  Globe,
  FileText,
  Save,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Search,
  ExternalLink,
  ShieldAlert,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  updateSiteSettingsAction,
  updateSeoSettingsAction,
  savePageSeoAction,
  deletePageSeoAction,
} from "@/lib/supabase/system-actions";

export interface SiteSettingsData {
  site_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  announcement_bar: string | null;
  maintenance_mode: boolean;
  footer_text: string;
  finance_disclaimer: string;
}

export interface SeoSettingsData {
  default_title: string;
  title_template: string;
  default_description: string;
  og_image_url: string | null;
  google_analytics_id: string | null;
  search_console_tag: string | null;
  meta_pixel_id: string | null;
  robots_txt: string;
}

export interface PageSeoItem {
  id: string;
  page_path: string;
  title: string | null;
  description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  no_index: boolean;
  updated_at: string;
}

interface SettingsManagerProps {
  initialSettings: SiteSettingsData;
  initialSeo: SeoSettingsData;
  initialPageSeo: PageSeoItem[];
}

export function SettingsManager({
  initialSettings,
  initialSeo,
  initialPageSeo,
}: SettingsManagerProps) {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "pages">("general");

  // General Settings state
  const [generalForm, setGeneralForm] = useState<SiteSettingsData>(initialSettings);
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);

  // SEO Settings state
  const [seoForm, setSeoForm] = useState<SeoSettingsData>(initialSeo);
  const [isSavingSeo, setIsSavingSeo] = useState(false);

  // Page SEO state
  const [pageSeoList, setPageSeoList] = useState<PageSeoItem[]>(initialPageSeo);
  const [isPageSeoModalOpen, setIsPageSeoModalOpen] = useState(false);
  const [editingPageSeo, setEditingPageSeo] = useState<PageSeoItem | null>(null);
  const [isSavingPageSeo, setIsSavingPageSeo] = useState(false);

  // Save General Settings
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGeneral(true);
    const res = await updateSiteSettingsAction(generalForm);
    setIsSavingGeneral(false);

    if (res.error) {
      error(res.error);
    } else {
      success(res.message || "General settings updated.");
    }
  };

  // Save SEO Settings
  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSeo(true);
    const res = await updateSeoSettingsAction(seoForm);
    setIsSavingSeo(false);

    if (res.error) {
      error(res.error);
    } else {
      success(res.message || "SEO metadata configuration saved.");
    }
  };

  // Save Page SEO Form
  const handleSavePageSeo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingPageSeo(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      id: editingPageSeo?.id,
      page_path: formData.get("page_path") as string,
      title: (formData.get("title") as string) || null,
      description: (formData.get("description") as string) || null,
      og_image_url: (formData.get("og_image_url") as string) || null,
      canonical_url: (formData.get("canonical_url") as string) || null,
      no_index: formData.get("no_index") === "on",
    };

    const res = await savePageSeoAction(payload);
    setIsSavingPageSeo(false);

    if (res.error) {
      error(res.error);
    } else {
      success(res.message || "Page SEO override saved.");
      setIsPageSeoModalOpen(false);
      if (editingPageSeo) {
        setPageSeoList((prev) =>
          prev.map((item) =>
            item.id === editingPageSeo.id
              ? {
                  ...item,
                  page_path: payload.page_path,
                  title: payload.title,
                  description: payload.description,
                  og_image_url: payload.og_image_url,
                  canonical_url: payload.canonical_url,
                  no_index: payload.no_index,
                  updated_at: new Date().toISOString(),
                }
              : item
          )
        );
      } else {
        const newItem: PageSeoItem = {
          id: `seo-${Date.now()}`,
          page_path: payload.page_path,
          title: payload.title,
          description: payload.description,
          og_image_url: payload.og_image_url,
          canonical_url: payload.canonical_url,
          no_index: payload.no_index,
          updated_at: new Date().toISOString(),
        };
        setPageSeoList((prev) => [...prev, newItem]);
      }
    }
  };

  // Delete Page SEO
  const handleDeletePageSeo = async (id: string) => {
    const res = await deletePageSeoAction(id);
    if (res.error) {
      error(res.error);
    } else {
      success("Page SEO override removed.");
      setPageSeoList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-mono block mb-2">
            System Architecture & Search Engine Protocol
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-ivory tracking-tight">
            Site Settings & SEO
          </h1>
          <p className="text-stone text-sm mt-1 max-w-xl">
            Configure global branding identities, operational toggles, legal disclaimers, and search engine discoverability.
          </p>
        </div>

        {activeTab === "general" && (
          <Button
            onClick={handleSaveGeneral}
            variant="primary"
            disabled={isSavingGeneral}
            className="shrink-0 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSavingGeneral ? "Saving..." : "Save Brand Settings"}</span>
          </Button>
        )}

        {activeTab === "seo" && (
          <Button
            onClick={handleSaveSeo}
            variant="primary"
            disabled={isSavingSeo}
            className="shrink-0 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSavingSeo ? "Saving..." : "Save SEO Metadata"}</span>
          </Button>
        )}

        {activeTab === "pages" && (
          <Button
            onClick={() => {
              setEditingPageSeo(null);
              setIsPageSeoModalOpen(true);
            }}
            variant="primary"
            className="shrink-0 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Page Override</span>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-line">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-mono transition-colors border-b-2 ${
            activeTab === "general"
              ? "border-gold text-gold font-bold bg-charcoal/50"
              : "border-transparent text-stone hover:text-ivory"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>General & Operations</span>
        </button>

        <button
          onClick={() => setActiveTab("seo")}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-mono transition-colors border-b-2 ${
            activeTab === "seo"
              ? "border-gold text-gold font-bold bg-charcoal/50"
              : "border-transparent text-stone hover:text-ivory"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Global SEO & Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab("pages")}
          className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-mono transition-colors border-b-2 ${
            activeTab === "pages"
              ? "border-gold text-gold font-bold bg-charcoal/50"
              : "border-transparent text-stone hover:text-ivory"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Page SEO Overrides ({pageSeoList.length})</span>
        </button>
      </div>

      {/* TAB 1: GENERAL & OPERATIONS */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveGeneral} className="space-y-6">
          {/* Identity & Contact Card */}
          <div className="p-6 bg-charcoal border border-line space-y-5">
            <h3 className="font-serif text-lg text-ivory border-b border-line pb-3">
              Brand Identity &amp; Headquarters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                  Site Name / Primary Brand Identity *
                </label>
                <input
                  type="text"
                  required
                  value={generalForm.site_name}
                  onChange={(e) => setGeneralForm({ ...generalForm, site_name: e.target.value })}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                  Brand Tagline *
                </label>
                <input
                  type="text"
                  required
                  value={generalForm.tagline}
                  onChange={(e) => setGeneralForm({ ...generalForm, tagline: e.target.value })}
                  placeholder="Style. Wealth. Presence."
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                  Executive Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={generalForm.contact_email}
                  onChange={(e) =>
                    setGeneralForm({ ...generalForm, contact_email: e.target.value })
                  }
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                  Concierge Telephone *
                </label>
                <input
                  type="text"
                  required
                  value={generalForm.contact_phone}
                  onChange={(e) =>
                    setGeneralForm({ ...generalForm, contact_phone: e.target.value })
                  }
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                Official Studio / Headquarters Address *
              </label>
              <input
                type="text"
                required
                value={generalForm.address}
                onChange={(e) => setGeneralForm({ ...generalForm, address: e.target.value })}
                placeholder="Marine Drive, Mumbai, Maharashtra, India"
                className="w-full bg-ink border border-line px-3.5 py-2 text-xs text-ivory focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Operational Controls & Legal Disclaimers */}
          <div className="p-6 bg-charcoal border border-line space-y-5">
            <h3 className="font-serif text-lg text-ivory border-b border-line pb-3">
              Operational Banners &amp; Mandatory Disclaimers
            </h3>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                Top Announcement Bar (Optional ticker ribbon)
              </label>
              <input
                type="text"
                value={generalForm.announcement_bar || ""}
                onChange={(e) =>
                  setGeneralForm({ ...generalForm, announcement_bar: e.target.value })
                }
                placeholder="Founder of Javi Groups · Actor · Fashion Model · Mumbai"
                className="w-full bg-ink border border-line px-3.5 py-2 text-xs text-ivory focus:outline-none focus:border-gold"
              />
            </div>

            <div className="p-4 bg-ink border border-line flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono text-ivory block font-semibold">
                  Maintenance Mode Gate
                </span>
                <span className="text-[11px] text-stone">
                  When enabled, non-admin visitors will see an on-brand private standby curtain.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={generalForm.maintenance_mode}
                  onChange={(e) =>
                    setGeneralForm({ ...generalForm, maintenance_mode: e.target.checked })
                  }
                  className="w-5 h-5 rounded-none accent-gold bg-charcoal border-line"
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                Footer Copyright &amp; Signature Statement *
              </label>
              <input
                type="text"
                required
                value={generalForm.footer_text}
                onChange={(e) => setGeneralForm({ ...generalForm, footer_text: e.target.value })}
                className="w-full bg-ink border border-line px-3.5 py-2 text-xs text-ivory focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-wider text-gold font-mono font-bold">
                  Mandatory Finance &amp; Strategy Disclaimer *
                </label>
                <span className="text-[10px] text-stone font-mono uppercase">
                  Appears on all finance dispatches &amp; footer
                </span>
              </div>
              <textarea
                required
                rows={2}
                value={generalForm.finance_disclaimer}
                onChange={(e) =>
                  setGeneralForm({ ...generalForm, finance_disclaimer: e.target.value })
                }
                className="w-full bg-ink border border-line p-3 text-xs text-ivory focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: GLOBAL SEO & TELEMETRY */}
      {activeTab === "seo" && (
        <form onSubmit={handleSaveSeo} className="space-y-6">
          <div className="p-6 bg-charcoal border border-line space-y-5">
            <h3 className="font-serif text-lg text-ivory border-b border-line pb-3">
              Search Indexing &amp; Open Graph Presets
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                  Default Title *
                </label>
                <input
                  type="text"
                  required
                  value={seoForm.default_title}
                  onChange={(e) => setSeoForm({ ...seoForm, default_title: e.target.value })}
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                  Title Template String *
                </label>
                <input
                  type="text"
                  required
                  value={seoForm.title_template}
                  onChange={(e) => setSeoForm({ ...seoForm, title_template: e.target.value })}
                  placeholder="%s | Vipul Mota"
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                Default Meta Description *
              </label>
              <textarea
                required
                rows={3}
                value={seoForm.default_description}
                onChange={(e) =>
                  setSeoForm({ ...seoForm, default_description: e.target.value })
                }
                className="w-full bg-ink border border-line p-3 text-xs text-ivory focus:outline-none focus:border-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                Global Open Graph (Social Sharing) Image URL
              </label>
              <input
                type="url"
                value={seoForm.og_image_url || ""}
                onChange={(e) => setSeoForm({ ...seoForm, og_image_url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Telemetry Tracking IDs */}
          <div className="p-6 bg-charcoal border border-line space-y-5">
            <h3 className="font-serif text-lg text-ivory border-b border-line pb-3">
              Analytics &amp; Verification Tags
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                  Google Analytics 4 ID
                </label>
                <input
                  type="text"
                  value={seoForm.google_analytics_id || ""}
                  onChange={(e) =>
                    setSeoForm({ ...seoForm, google_analytics_id: e.target.value })
                  }
                  placeholder="G-XXXXXXXXXX"
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                  Google Search Console Tag
                </label>
                <input
                  type="text"
                  value={seoForm.search_console_tag || ""}
                  onChange={(e) =>
                    setSeoForm({ ...seoForm, search_console_tag: e.target.value })
                  }
                  placeholder="google-site-verification=..."
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-stone font-mono">
                  Meta Pixel ID
                </label>
                <input
                  type="text"
                  value={seoForm.meta_pixel_id || ""}
                  onChange={(e) => setSeoForm({ ...seoForm, meta_pixel_id: e.target.value })}
                  placeholder="1234567890"
                  className="w-full bg-ink border border-line px-3.5 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {/* Robots.txt Directives */}
          <div className="p-6 bg-charcoal border border-line space-y-3">
            <h3 className="font-serif text-lg text-ivory border-b border-line pb-3">
              Robots.txt Crawl Directives
            </h3>
            <textarea
              rows={5}
              value={seoForm.robots_txt}
              onChange={(e) => setSeoForm({ ...seoForm, robots_txt: e.target.value })}
              className="w-full bg-ink border border-line p-3 text-xs font-mono text-ivory focus:outline-none focus:border-gold leading-relaxed"
            />
          </div>
        </form>
      )}

      {/* TAB 3: PAGE SEO OVERRIDES */}
      {activeTab === "pages" && (
        <div className="space-y-6">
          <div className="bg-charcoal border border-line overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-ink/80 text-stone font-mono uppercase tracking-wider text-[10px] border-b border-line">
                <tr>
                  <th className="py-3.5 px-4">Route Path</th>
                  <th className="py-3.5 px-4">Custom Title</th>
                  <th className="py-3.5 px-4">Indexing</th>
                  <th className="py-3.5 px-4">Canonical Link</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {pageSeoList.map((item) => (
                  <tr key={item.id} className="hover:bg-ink/40 transition-colors">
                    <td className="py-4 px-4 font-mono text-gold text-xs font-semibold">
                      {item.page_path}
                    </td>
                    <td className="py-4 px-4 text-ivory max-w-xs truncate">
                      {item.title || "—"}
                    </td>
                    <td className="py-4 px-4">
                      {item.no_index ? (
                        <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-red-950 text-red-400 border border-red-800">
                          noindex
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                          index, follow
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-stone max-w-xs truncate">
                      {item.canonical_url || "Auto-resolved"}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingPageSeo(item);
                            setIsPageSeoModalOpen(true);
                          }}
                          className="p-1.5 text-stone hover:text-ivory border border-line bg-ink transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePageSeo(item.id)}
                          className="p-1.5 text-stone hover:text-red-400 border border-line bg-ink transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pageSeoList.length === 0 && (
              <div className="text-center py-16 bg-charcoal/30">
                <FileText className="w-10 h-10 text-stone/40 mx-auto mb-3" />
                <p className="text-ivory text-sm">No page-specific overrides defined.</p>
                <p className="text-stone text-xs mt-1">Default global presets apply to all routes.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAGE SEO MODAL */}
      <Modal
        isOpen={isPageSeoModalOpen}
        onClose={() => setIsPageSeoModalOpen(false)}
        title={editingPageSeo ? `Edit SEO: ${editingPageSeo.page_path}` : "New Route SEO Override"}
      >
        <form onSubmit={handleSavePageSeo} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] uppercase font-mono text-stone">Route Path *</label>
            <input
              type="text"
              name="page_path"
              required
              defaultValue={editingPageSeo?.page_path || "/"}
              placeholder="e.g. /work or /about"
              className="w-full bg-ink border border-line px-3 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-mono text-stone">Custom Page Title</label>
            <input
              type="text"
              name="title"
              defaultValue={editingPageSeo?.title || ""}
              placeholder="Custom heading displayed in browser tabs..."
              className="w-full bg-ink border border-line px-3 py-2 text-xs text-ivory focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-mono text-stone">Custom Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={editingPageSeo?.description || ""}
              placeholder="Targeted meta description for this specific path..."
              className="w-full bg-ink border border-line p-3 text-xs text-ivory focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-mono text-stone">Canonical URL</label>
            <input
              type="url"
              name="canonical_url"
              defaultValue={editingPageSeo?.canonical_url || ""}
              placeholder="https://vipulmota.com/..."
              className="w-full bg-ink border border-line px-3 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
            />
          </div>

          <div className="pt-2 border-t border-line">
            <label className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="checkbox"
                name="no_index"
                defaultChecked={editingPageSeo?.no_index ?? false}
                className="w-4 h-4 rounded-none accent-gold bg-ink border-line"
              />
              <span className="text-xs font-mono text-ivory">
                Prevent search engines from indexing this route (noindex, nofollow)
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
            <Button type="button" variant="outline" onClick={() => setIsPageSeoModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSavingPageSeo}>
              {isSavingPageSeo ? "Saving..." : "Save Route Override"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
