"use client";

import React, { useState, useRef } from "react";
import { Upload, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon, Video, X } from "lucide-react";

interface FileUploadInputProps {
  label: string;
  name: string;
  defaultValue?: string;
  accept?: string;
  placeholder?: string;
  required?: boolean;
  isVideo?: boolean;
  onChange?: (url: string) => void;
}

export function FileUploadInput({
  label,
  name,
  defaultValue = "",
  accept = "image/*",
  placeholder = "https://... or upload local file",
  required = false,
  isVideo = false,
  onChange,
}: FileUploadInputProps) {
  const [value, setValue] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Upload failed");
      }

      setValue(data.url);
      setUploadSuccess(true);
      if (onChange) onChange(data.url);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
      // reset file input value so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleClear = () => {
    setValue("");
    setUploadSuccess(false);
    setUploadError(null);
    if (onChange) onChange("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="editorial-label text-stone block text-[10px] uppercase tracking-wider font-mono">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[10px] text-stone hover:text-red-400 flex items-center gap-1 font-mono transition-colors"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* URL input field */}
      <div className="flex gap-2">
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (onChange) onChange(e.target.value);
          }}
          required={required}
          placeholder={placeholder}
          className="flex-1 bg-ink border border-line p-2.5 text-xs text-ivory font-mono focus:border-gold outline-none transition-colors"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2.5 bg-charcoal border border-line-gold text-gold hover:bg-gold hover:text-ink text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Device File</span>
            </>
          )}
        </button>
      </div>

      {/* Status Messages */}
      {uploadSuccess && (
        <div className="text-[11px] text-gold flex items-center gap-1.5 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
          <span>File uploaded directly to local storage!</span>
        </div>
      )}

      {uploadError && (
        <div className="text-[11px] text-red-400 flex items-center gap-1.5 font-mono">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Instant Preview */}
      {value && (
        <div className="mt-2 p-2 bg-charcoal/60 border border-line flex items-center gap-3">
          <div className="w-14 h-14 bg-ink border border-line overflow-hidden shrink-0 flex items-center justify-center relative">
            {isVideo || value.endsWith(".mp4") || value.endsWith(".webm") || value.endsWith(".mov") ? (
              <video src={value} className="w-full h-full object-cover" muted playsInline />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-stone font-mono uppercase tracking-wider block">
              Active Media Source
            </span>
            <p className="text-[11px] text-ivory/80 font-mono truncate">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
}
