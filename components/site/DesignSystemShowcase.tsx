"use client";

import React, { useState } from "react";
import { Button, Input, Modal, useToast, Lightbox, type LightboxImage } from "@/components/ui";

const sampleImages: LightboxImage[] = [
  {
    src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1800&auto=format&fit=crop",
    caption: "Plate 01 — Bespoke Tailoring & Marine Drive Silhouette, Mumbai 2026",
    category: "Editorial Lookbook",
  },
  {
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1800&auto=format&fit=crop",
    caption: "Plate 02 — High-Contrast Monochromatic Portraiture",
    category: "Portraits",
  },
  {
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1800&auto=format&fit=crop",
    caption: "Plate 03 — Private Wealth Syndicate & Founder Dialogue",
    category: "Ventures",
  },
];

export function DesignSystemShowcase() {
  const { success, error, info } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  return (
    <div className="bg-charcoal/50 border border-line p-8 md:p-12 space-y-8">
      {/* Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-6 gap-4">
        <div>
          <span className="editorial-label text-gold">Phase 04 / Interactive Component Suite</span>
          <h2 className="font-serif text-3xl text-ivory font-light mt-1">
            Design System Components in Action
          </h2>
        </div>
        <div className="flex items-center space-x-3 text-xs text-stone">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>All Tokens Active</span>
        </div>
      </div>

      {/* Button & Toast Triggers Grid */}
      <div className="space-y-4">
        <span className="editorial-label text-stone block">
          01 / Magnetic Buttons & Toast Triggers
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="gold"
            onClick={() =>
              success(
                "Inquiry received. Vipul Mota's management has been notified.",
                "Dispatched Successfully"
              )
            }
          >
            Trigger Success Toast
          </Button>

          <Button
            variant="primary"
            onClick={() =>
              info(
                "Accessing the private lookbook archive. Inner Circle session active.",
                "Member Archive"
              )
            }
          >
            Trigger Info Toast
          </Button>

          <Button
            variant="secondary"
            onClick={() =>
              error(
                "Invalid credentials provided. Please verify email and try again.",
                "Authentication Notice"
              )
            }
          >
            Trigger Error Toast
          </Button>

          <Button
            variant="outline"
            onClick={() => setModalOpen(true)}
          >
            Open Interactive Modal &rarr;
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
          >
            Launch Gallery Lightbox
          </Button>
        </div>
      </div>

      {/* Interactive Modal Component */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Direct Booking & Brand Inquiry"
        subtitle="Vipul Mota / Management Office"
        size="md"
      >
        <div className="space-y-6">
          <p className="text-stone text-xs leading-relaxed">
            Direct channel for screen casting, brand collaborations, high-value modeling campaigns, and Javi Groups syndication meetings.
          </p>

          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Rahul Sharma"
              defaultValue="Director / Casting Agency"
            />
            <Input
              label="Official Contact Email"
              type="email"
              placeholder="contact@agency.com"
              defaultValue="management@production.in"
            />
            <Input
              label="Subject / Project Title"
              placeholder="e.g. Feature Film Lead Role / Brand Endorsement"
              defaultValue="Upcoming Crime Series Script Review"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-4 border-t border-line">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gold"
              onClick={() => {
                setModalOpen(false);
                success("Inquiry drafted and dispatched to Vipul Mota's management office.");
              }}
            >
              Submit Dispatch &rarr;
            </Button>
          </div>
        </div>
      </Modal>

      {/* Lightbox Component */}
      <Lightbox
        isOpen={lightboxOpen}
        images={sampleImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
