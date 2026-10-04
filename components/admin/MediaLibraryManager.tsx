"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  FileText,
  FileArchive,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  saveMediaItemAction,
  deleteMediaItemAction,
} from "@/lib/supabase/system-actions";
import { FileUploadInput } from "./FileUploadInput";

export interface MediaItem {
  id: string;
  url: string;
  storage_path: string;
  filename: string;
  size: number;
  mime_type: string;
  created_at: string;
}

interface MediaLibraryManagerProps {
  initialMedia: MediaItem[];
}

export function MediaLibraryManager({ initialMedia }: MediaLibraryManagerProps) {
  const { success, error } = useToast();

  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);
  const [searchQuery, setSearchQuery] = useState("");
  const [bucketFilter, setBucketFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadBucket, setUploadBucket] = useState("gallery");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadFilename, setUploadFilename] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Delete State
  const [deletingItem, setDeletingItem] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Copy to clipboard
  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    success("Asset direct URL copied to clipboard.");
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Upload Asset
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl.trim() || !uploadFilename.trim()) return;

    setIsUploading(true);
    const storagePath = `${uploadBucket}/${Date.now()}-${uploadFilename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const payload = {
      url: uploadUrl.trim(),
      storage_path: storagePath,
      filename: uploadFilename.trim(),
      size: 245000, // estimated asset size in bytes
      mime_type: uploadUrl.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
    };

    const res = await saveMediaItemAction(payload);
    setIsUploading(false);

    if (res.error) {
      error(res.error);
    } else {
      success(res.message || "Asset registered.");
      setIsUploadModalOpen(false);
      const newItem: MediaItem = {
        id: `media-${Date.now()}`,
        ...payload,
        created_at: new Date().toISOString(),
      };
      setMediaList((prev) => [newItem, ...prev]);
      setUploadUrl("");
      setUploadFilename("");
    }
  };

  // Delete Asset
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    setIsDeleting(true);
    const res = await deleteMediaItemAction(deletingItem.id, deletingItem.storage_path);
    setIsDeleting(false);

    if (res.error) {
      error(res.error);
    } else {
      success("Asset deleted permanently.");
      setMediaList((prev) => prev.filter((m) => m.id !== deletingItem.id));
      setDeletingItem(null);
    }
  };

  // Filter Assets
  const filteredMedia = mediaList.filter((m) => {
    const matchesBucket =
      bucketFilter === "all" || m.storage_path.startsWith(`${bucketFilter}/`);
    const matchesSearch =
      m.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBucket && matchesSearch;
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-mono block mb-2">
            Asset Infrastructure &amp; Storage Buckets
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-ivory tracking-tight">
            Media Library
          </h1>
          <p className="text-stone text-sm mt-1 max-w-xl">
            Central repository for lookbook photography, press kit documents, editorial imagery, and brand assets.
          </p>
        </div>

        <Button
          onClick={() => setIsUploadModalOpen(true)}
          variant="primary"
          className="shrink-0 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>Register / Upload Asset</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-charcoal/40 p-4 border border-line">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets by filename or directory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ink border border-line pl-10 pr-4 py-2 text-xs text-ivory placeholder:text-stone/60 focus:outline-none focus:border-gold"
          />
        </div>

        {/* Bucket Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] uppercase font-mono text-stone mr-1">Bucket:</span>
          {["all", "gallery", "journal", "press-kit", "site-assets"].map((b) => (
            <button
              key={b}
              onClick={() => setBucketFilter(b)}
              className={`px-3 py-1 text-xs font-mono whitespace-nowrap transition-colors ${
                bucketFilter === b
                  ? "bg-gold text-ink font-bold"
                  : "text-stone hover:text-ivory bg-ink"
              }`}
            >
              {b === "all" ? "All Buckets" : b}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((item) => {
          const isImage = item.mime_type.startsWith("image/");
          const isPdf = item.mime_type === "application/pdf";

          return (
            <div
              key={item.id}
              className="bg-charcoal border border-line hover:border-line-gold transition-colors flex flex-col justify-between group overflow-hidden"
            >
              {/* Preview Thumbnail */}
              <div className="relative h-36 w-full bg-ink overflow-hidden flex items-center justify-center">
                {isImage ? (
                  <Image
                    src={item.url}
                    alt={item.filename}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : isPdf ? (
                  <FileText className="w-12 h-12 text-gold/70" />
                ) : (
                  <FileArchive className="w-12 h-12 text-stone/50" />
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(item)}
                    className="p-2 bg-ink/90 text-ivory hover:text-gold border border-line transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-ink/90 text-ivory hover:text-gold border border-line transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => setDeletingItem(item)}
                    className="p-2 bg-ink/90 text-stone hover:text-red-400 border border-line transition-colors"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Asset Meta */}
              <div className="p-3 space-y-1">
                <div className="text-xs text-ivory truncate font-medium font-mono" title={item.filename}>
                  {item.filename}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-stone">
                  <span>{formatSize(item.size)}</span>
                  <span className="uppercase">{item.mime_type.split("/")[1]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-20 bg-charcoal/30 border border-line">
          <FolderOpen className="w-12 h-12 text-stone/40 mx-auto mb-3" />
          <p className="text-ivory text-sm">No storage assets found in this bucket.</p>
          <p className="text-stone text-xs mt-1">Register new assets or upload media above.</p>
        </div>
      )}

      {/* UPLOAD MODAL */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Register Media Asset into Storage Bucket"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] uppercase font-mono text-stone">
              Target Storage Bucket *
            </label>
            <select
              value={uploadBucket}
              onChange={(e) => setUploadBucket(e.target.value)}
              className="w-full bg-ink border border-line px-3 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
            >
              <option value="gallery">gallery (Lookbook & Editorial Plates)</option>
              <option value="journal">journal (Articles & BTS Dispatches)</option>
              <option value="press-kit">press-kit (PDF Media Biographies)</option>
              <option value="site-assets">site-assets (Logos, Hero & System)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-mono text-stone">Asset Filename *</label>
            <input
              type="text"
              required
              value={uploadFilename}
              onChange={(e) => setUploadFilename(e.target.value)}
              placeholder="e.g. vipul-mota-marine-drive-look-01.jpg"
              className="w-full bg-ink border border-line px-3 py-2 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
            />
          </div>

          <FileUploadInput
            label="Asset File (Direct Device Upload or Storage Public URL) *"
            name="uploadUrl"
            defaultValue={uploadUrl}
            required
            accept="image/*,video/*,application/pdf"
            placeholder="/uploads/... or https://..."
            onChange={(url) => {
              setUploadUrl(url);
              if (!uploadFilename) {
                const parts = url.split("/");
                setUploadFilename(parts[parts.length - 1] || "");
              }
            }}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isUploading}>
              {isUploading ? "Registering..." : "Add to Media Registry"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE ASSET CONFIRMATION */}
      <Modal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        title="Confirm Asset Deletion"
      >
        {deletingItem && (
          <div className="space-y-5">
            <div className="p-4 bg-amber-950/30 border border-amber-800 text-amber-200 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Warning:</strong> Deleting <span className="font-mono font-bold text-ivory">{deletingItem.filename}</span> will permanently purge it from storage. If this asset is actively referenced by hero slides, lookbook plates, or journal posts, broken images may result.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDeletingItem(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-700 hover:bg-red-800 text-white"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Purging..." : "Confirm Permanent Deletion"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
