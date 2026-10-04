import React from "react";
import Link from "next/link";
import { Inbox, Users, ArrowUpRight, Plus, ExternalLink } from "lucide-react";
import type { EnquiryRow, ProfileRow } from "@/lib/supabase/admin-dashboard";

interface AdminRecentActivityProps {
  recentEnquiries: EnquiryRow[];
  recentMembers: ProfileRow[];
}

export function AdminRecentActivity({
  recentEnquiries,
  recentMembers,
}: AdminRecentActivityProps) {
  const getStatusBadge = (status: EnquiryRow["status"]) => {
    switch (status) {
      case "new":
        return "border-gold text-gold bg-gold/10";
      case "in_review":
        return "border-blue-400 text-blue-400 bg-blue-500/10";
      case "replied":
        return "border-emerald-400 text-emerald-400 bg-emerald-500/10";
      default:
        return "border-line text-stone";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Recent Inquiries Dossiers */}
      <div className="lg:col-span-7 bg-charcoal border border-line p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center space-x-2">
            <Inbox className="w-4 h-4 text-gold" />
            <h2 className="font-serif text-2xl text-ivory font-light">
              Latest Inquiries Dossiers
            </h2>
          </div>

          <Link
            href="/admin/enquiries"
            className="text-xs uppercase tracking-widest text-stone hover:text-gold transition-colors flex items-center space-x-1"
          >
            <span>View Inbox</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries.length > 0 ? (
          <div className="divide-y divide-line/60">
            {recentEnquiries.map((enq) => (
              <div
                key={enq.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`py-0.5 px-2 text-[9px] uppercase tracking-wider border font-mono ${getStatusBadge(
                        enq.status
                      )}`}
                    >
                      {enq.status}
                    </span>
                    <span className="editorial-label text-stone text-[10px] uppercase">
                      {enq.type}
                    </span>
                  </div>

                  <h3 className="font-serif text-base text-ivory font-light group-hover:text-gold transition-colors">
                    {enq.subject}
                  </h3>

                  <p className="text-stone text-xs font-light">
                    From: <span className="text-ivory/80">{enq.name}</span> ({enq.email})
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-stone font-mono text-[10px]">
                    {new Date(enq.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-stone italic">
            No incoming executive inquiries logged in the queue.
          </div>
        )}
      </div>

      {/* Right Column: Member Registrations & Quick Actions */}
      <div className="lg:col-span-5 space-y-8">
        {/* Quick Content Creator Shortcuts */}
        <div className="bg-charcoal border border-line p-6 space-y-4">
          <span className="editorial-label text-gold text-[10px] block">
            Executive Shortcuts
          </span>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Link
              href="/admin/journal"
              className="p-3 border border-line bg-ink hover:border-gold text-stone hover:text-ivory text-xs flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-gold" />
              <span>Draft Dispatch</span>
            </Link>

            <Link
              href="/admin/gallery"
              className="p-3 border border-line bg-ink hover:border-gold text-stone hover:text-ivory text-xs flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-gold" />
              <span>Add Plate</span>
            </Link>

            <Link
              href="/admin/work"
              className="p-3 border border-line bg-ink hover:border-gold text-stone hover:text-ivory text-xs flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-gold" />
              <span>Update Work</span>
            </Link>

            <Link
              href="/admin/settings"
              className="p-3 border border-line bg-ink hover:border-gold text-stone hover:text-ivory text-xs flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-gold" />
              <span>Site Metadata</span>
            </Link>
          </div>
        </div>

        {/* Recent Member Registrations */}
        <div className="bg-charcoal border border-line p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gold" />
              <h2 className="font-serif text-2xl text-ivory font-light">
                Recent Members
              </h2>
            </div>

            <Link
              href="/admin/members"
              className="text-xs uppercase tracking-widest text-stone hover:text-gold transition-colors flex items-center space-x-1"
            >
              <span>Roster</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentMembers.length > 0 ? (
            <div className="divide-y divide-line/60">
              {recentMembers.map((member) => (
                <div
                  key={member.id}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="text-ivory font-medium block">
                      {member.full_name || "Inner Circle Member"}
                    </span>
                    <span className="text-stone font-mono text-[11px] block">
                      {member.email}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-stone">
                    {new Date(member.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-stone italic">
              No registered members registered yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
