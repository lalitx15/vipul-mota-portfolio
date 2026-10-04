"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, Clock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { EnquiryItem } from "@/lib/supabase/member";

interface MemberEnquiriesTabProps {
  enquiries: EnquiryItem[];
}

export function MemberEnquiriesTab({ enquiries }: MemberEnquiriesTabProps) {
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);

  const getStatusBadge = (status: EnquiryItem["status"]) => {
    switch (status) {
      case "new":
        return {
          label: "New / In Queue",
          classes: "border-gold text-gold bg-gold/10",
        };
      case "in_review":
        return {
          label: "Under Executive Review",
          classes: "border-blue-500 text-blue-400 bg-blue-500/10",
        };
      case "replied":
        return {
          label: "Replied by Office",
          classes: "border-emerald-500 text-emerald-400 bg-emerald-500/10",
        };
      case "closed":
        return {
          label: "Closed / Archived",
          classes: "border-stone text-stone bg-charcoal",
        };
      default:
        return {
          label: "Logged",
          classes: "border-line text-stone",
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="font-serif text-2xl text-ivory font-light">
            Inquiry &amp; Booking Pipeline
          </h2>
          <p className="text-stone text-xs pt-1">
            Real-time status tracking for screen casting, brand alliances, and syndication dialogues.
          </p>
        </div>

        <Link href="/contact">
          <Button variant="gold" size="sm">
            Initiate New Inquiry &rarr;
          </Button>
        </Link>
      </div>

      {/* Enquiries List */}
      {enquiries.length > 0 ? (
        <div className="border border-line divide-y divide-line bg-charcoal">
          {enquiries.map((item) => {
            const statusConfig = getStatusBadge(item.status);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedEnquiry(item)}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-ink/40 cursor-pointer transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-3 text-xs">
                    <span
                      className={`py-0.5 px-2.5 text-[10px] uppercase tracking-widest border font-mono ${statusConfig.classes}`}
                    >
                      {statusConfig.label}
                    </span>
                    <span className="editorial-label text-gold uppercase text-[10px]">
                      {item.type}
                    </span>
                    <span className="text-stone font-mono text-[10px]">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl text-ivory font-light hover:text-gold transition-colors">
                    {item.subject}
                  </h3>

                  <p className="text-stone text-xs line-clamp-1 font-light">
                    {item.message}
                  </p>
                </div>

                <div className="flex items-center space-x-4 shrink-0 text-xs">
                  <div className="text-right hidden sm:block">
                    <span className="text-stone text-[10px] block uppercase">
                      Contact Via
                    </span>
                    <span className="text-ivory font-mono uppercase">
                      {item.contact_method}
                    </span>
                  </div>

                  <span className="p-2 border border-line text-stone group-hover:text-gold transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-charcoal border border-line p-16 text-center space-y-4">
          <MessageSquare className="w-10 h-10 text-stone mx-auto" />
          <h3 className="font-serif text-2xl text-ivory font-light">
            No Inquiry Dossiers on Record
          </h3>
          <p className="text-stone text-xs sm:text-sm max-w-md mx-auto font-light leading-relaxed">
            You have not submitted any screen casting or commercial partnership inquiries from this member account.
          </p>
          <div className="pt-4">
            <Link href="/contact">
              <Button variant="gold" size="sm">
                Initiate Inquiry to Office &rarr;
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          title={`Inquiry Dossier: ${selectedEnquiry.subject}`}
        >
          <div className="space-y-6 text-xs text-stone">
            {/* Status Pipeline Visual Indicator */}
            <div className="bg-ink p-4 border border-line space-y-3">
              <span className="editorial-label text-gold text-[10px] block">
                Executive Status Progression
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono uppercase">
                {["new", "in_review", "replied", "closed"].map((step, idx) => {
                  const isCurrent = selectedEnquiry.status === step;
                  return (
                    <div
                      key={step}
                      className={`p-2 border ${
                        isCurrent
                          ? "border-gold text-gold bg-gold/10 font-bold"
                          : "border-line/60 text-stone/60"
                      }`}
                    >
                      {step.replace("_", " ")}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Parameters */}
            <div className="grid grid-cols-2 gap-4 border-y border-line py-4">
              <div>
                <span className="text-stone block">Classification</span>
                <span className="text-ivory font-medium uppercase font-mono">
                  {selectedEnquiry.type}
                </span>
              </div>
              <div>
                <span className="text-stone block">Preferred Channel</span>
                <span className="text-ivory font-medium uppercase font-mono">
                  {selectedEnquiry.contact_method}
                </span>
              </div>
              <div>
                <span className="text-stone block">Submission Date</span>
                <span className="text-ivory font-mono">
                  {new Date(selectedEnquiry.created_at).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-stone block">Budget / Scale</span>
                <span className="text-ivory font-mono">
                  {selectedEnquiry.budget || "Not Specified / Private"}
                </span>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <span className="editorial-label text-gold block">
                Submitted Inquiry Brief
              </span>
              <div className="bg-ink p-4 border border-line text-ivory font-light leading-relaxed whitespace-pre-wrap">
                {selectedEnquiry.message}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedEnquiry(null)}
              >
                Close Dossier
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
