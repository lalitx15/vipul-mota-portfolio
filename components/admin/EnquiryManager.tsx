"use client";

import React, { useState } from "react";
import {
  Inbox,
  Search,
  Download,
  Mail,
  Phone,
  MessageCircle,
  Clock,
  Send,
  StickyNote,
  ChevronRight,
  Filter,
  CheckCircle,
  AlertCircle,
  User,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  updateEnquiryStatusAction,
  addEnquiryNoteAction,
  replyEnquiryAction,
} from "@/lib/supabase/admin-actions";

export interface EnquiryItem {
  id: string;
  type: "general" | "brand" | "booking";
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  budget: string | null;
  message: string;
  contact_method: "email" | "phone" | "whatsapp";
  status: "new" | "in_review" | "replied" | "closed";
  created_at: string;
  updated_at: string;
}

export interface EnquiryNoteItem {
  id: string;
  enquiry_id: string;
  note: string;
  created_by: string;
  created_at: string;
}

interface EnquiryManagerProps {
  initialEnquiries: EnquiryItem[];
  initialNotes: EnquiryNoteItem[];
}

export function EnquiryManager({ initialEnquiries, initialNotes }: EnquiryManagerProps) {
  const { success, error } = useToast();

  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(initialEnquiries);
  const [notes, setNotes] = useState<EnquiryNoteItem[]>(initialNotes);

  // Filters
  const [typeFilter, setTypeFilter] = useState<"all" | "general" | "brand" | "booking">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "in_review" | "replied" | "closed">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Detail Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [detailTab, setDetailTab] = useState<"details" | "reply" | "notes">("details");

  // Reply Form State
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Note Form State
  const [newNoteText, setNewNoteText] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Open Enquiry Detail
  const handleSelectEnquiry = (enquiry: EnquiryItem) => {
    setSelectedEnquiry(enquiry);
    setDetailTab("details");
    setReplySubject(`Re: ${enquiry.subject}`);
    setReplyMessage(
      `Dear ${enquiry.name},\n\nThank you for reaching out regarding "${enquiry.subject}". We have reviewed your inquiry at Vipul Mota's management office.\n\n`
    );
  };

  // Change Status
  const handleStatusChange = async (
    enquiryId: string,
    newStatus: "new" | "in_review" | "replied" | "closed"
  ) => {
    const res = await updateEnquiryStatusAction(enquiryId, newStatus);
    if (res.error) {
      error(res.error);
    } else {
      success(res.message || "Status updated.");
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
      if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
        setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    }
  };

  // Submit Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !newNoteText.trim()) return;

    setIsSavingNote(true);
    const res = await addEnquiryNoteAction(selectedEnquiry.id, newNoteText);
    setIsSavingNote(false);

    if (res.error) {
      error(res.error);
    } else {
      success("Internal note added.");
      const noteObj: EnquiryNoteItem = {
        id: `note-${Date.now()}`,
        enquiry_id: selectedEnquiry.id,
        note: newNoteText.trim(),
        created_by: "Executive Office",
        created_at: new Date().toISOString(),
      };
      setNotes((prev) => [noteObj, ...prev]);
      setNewNoteText("");
    }
  };

  // Submit Reply Email
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !replyMessage.trim()) return;

    setIsSendingReply(true);
    const res = await replyEnquiryAction({
      enquiryId: selectedEnquiry.id,
      toEmail: selectedEnquiry.email,
      recipientName: selectedEnquiry.name,
      subject: replySubject,
      replyMessage: replyMessage,
      originalMessage: selectedEnquiry.message,
    });
    setIsSendingReply(false);

    if (res.error) {
      error(res.error);
    } else {
      success(res.message || "Reply sent.");
      setEnquiries((prev) =>
        prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, status: "replied" } : e))
      );
      setSelectedEnquiry((prev) => (prev ? { ...prev, status: "replied" } : null));
      const noteObj: EnquiryNoteItem = {
        id: `note-${Date.now()}`,
        enquiry_id: selectedEnquiry.id,
        note: `[Official Email Reply Sent]: "${replyMessage.slice(0, 100)}..."`,
        created_by: "Executive Office",
        created_at: new Date().toISOString(),
      };
      setNotes((prev) => [noteObj, ...prev]);
      setDetailTab("details");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Date", "Type", "Name", "Email", "Phone", "Subject", "Budget", "Method", "Status", "Message"];
    const rows = filteredEnquiries.map((e) => [
      e.id,
      new Date(e.created_at).toISOString(),
      e.type,
      `"${e.name.replace(/"/g, '""')}"`,
      e.email,
      e.phone || "",
      `"${e.subject.replace(/"/g, '""')}"`,
      `"${(e.budget || "").replace(/"/g, '""')}"`,
      e.contact_method,
      e.status,
      `"${e.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inquiries-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success("Inquiries export downloaded.");
  };

  // Filtered List
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesType = typeFilter === "all" || e.type === typeFilter;
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const newCount = enquiries.filter((e) => e.status === "new").length;
  const currentEnquiryNotes = notes.filter((n) => n.enquiry_id === selectedEnquiry?.id);

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-mono block mb-2">
            Executive Inquiries Dossier
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-ivory tracking-tight">
            Inquiries Inbox
          </h1>
          <p className="text-stone text-sm mt-1 max-w-xl">
            Triage representation pitches, screen casting opportunities, brand partnerships, and direct communications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-line text-ivory text-xs"
          >
            <Download className="w-3.5 h-3.5 text-gold" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-charcoal/40 p-4 border border-line">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, subject, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-ink border border-line pl-10 pr-4 py-2 text-xs text-ivory placeholder:text-stone/60 focus:outline-none focus:border-gold"
            />
          </div>

          {/* Type Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone mr-2">
              Category:
            </span>
            {(["all", "general", "brand", "booking"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 text-xs font-mono whitespace-nowrap transition-colors ${
                  typeFilter === t ? "bg-gold text-ink font-bold" : "text-stone hover:text-ivory bg-ink/60"
                }`}
              >
                {t === "all" ? "All Dossiers" : t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone mr-2">
              Status:
            </span>
            {(["all", "new", "in_review", "replied", "closed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 text-xs font-mono whitespace-nowrap transition-colors ${
                  statusFilter === s ? "bg-gold text-ink font-bold" : "text-stone hover:text-ivory bg-ink/60"
                }`}
              >
                {s === "new" && newCount > 0 ? `NEW (${newCount})` : s.replace("_", " ").toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inquiries Table / Feed */}
      <div className="bg-charcoal border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ink/80 text-stone font-mono uppercase tracking-wider text-[10px] border-b border-line">
              <tr>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Sender</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Received</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredEnquiries.map((enquiry) => {
                const isNew = enquiry.status === "new";
                return (
                  <tr
                    key={enquiry.id}
                    onClick={() => handleSelectEnquiry(enquiry)}
                    className={`cursor-pointer hover:bg-ink/40 transition-colors ${
                      isNew ? "bg-gold/5 font-medium" : ""
                    }`}
                  >
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider border ${
                          enquiry.status === "new"
                            ? "bg-amber-950 text-amber-300 border-amber-800 animate-pulse"
                            : enquiry.status === "in_review"
                            ? "bg-blue-950 text-blue-300 border-blue-800"
                            : enquiry.status === "replied"
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                            : "bg-stone/20 text-stone border-stone/30"
                        }`}
                      >
                        {enquiry.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-ivory font-medium">{enquiry.name}</div>
                      <div className="text-stone font-mono text-[11px]">{enquiry.email}</div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-ink text-gold border border-line">
                        {enquiry.type}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-ivory truncate max-w-xs">{enquiry.subject}</div>
                      <div className="text-stone truncate max-w-xs text-[11px]">{enquiry.message}</div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-stone font-mono text-[11px] capitalize">
                      {enquiry.contact_method}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-stone font-mono text-[11px]">
                      {new Date(enquiry.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectEnquiry(enquiry);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-gold hover:text-ivory bg-ink border border-line hover:border-gold transition-colors font-mono"
                      >
                        <span>Review</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredEnquiries.length === 0 && (
          <div className="text-center py-16 bg-charcoal/30">
            <Inbox className="w-10 h-10 text-stone/40 mx-auto mb-3" />
            <p className="text-ivory text-sm">No inquiries match the current parameters.</p>
            <p className="text-stone text-xs mt-1">Check alternate filters or search terms.</p>
          </div>
        )}
      </div>

      {/* DETAIL MODAL / EXECUTIVE DOSSIER DRAWER */}
      <Modal
        isOpen={!!selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        title={
          selectedEnquiry
            ? `Inquiry Dossier: ${selectedEnquiry.name}`
            : "Inquiry Details"
        }
      >
        {selectedEnquiry && (
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* Modal Tabs */}
            <div className="flex items-center gap-2 border-b border-line">
              <button
                onClick={() => setDetailTab("details")}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors ${
                  detailTab === "details"
                    ? "border-gold text-gold font-bold"
                    : "border-transparent text-stone hover:text-ivory"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setDetailTab("reply")}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
                  detailTab === "reply"
                    ? "border-gold text-gold font-bold"
                    : "border-transparent text-stone hover:text-ivory"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Reply by Email
              </button>
              <button
                onClick={() => setDetailTab("notes")}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
                  detailTab === "notes"
                    ? "border-gold text-gold font-bold"
                    : "border-transparent text-stone hover:text-ivory"
                }`}
              >
                <StickyNote className="w-3.5 h-3.5" />
                Internal Notes ({currentEnquiryNotes.length})
              </button>
            </div>

            {/* TAB: DETAILS OVERVIEW */}
            {detailTab === "details" && (
              <div className="space-y-5">
                {/* Status Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-ink border border-line">
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase font-mono text-stone">Change Status:</span>
                    <select
                      value={selectedEnquiry.status}
                      onChange={(e) =>
                        handleStatusChange(
                          selectedEnquiry.id,
                          e.target.value as "new" | "in_review" | "replied" | "closed"
                        )
                      }
                      className="bg-charcoal border border-line px-3 py-1.5 text-xs font-mono text-ivory focus:outline-none focus:border-gold"
                    >
                      <option value="new">NEW (Unprocessed)</option>
                      <option value="in_review">IN REVIEW (Under Evaluation)</option>
                      <option value="replied">REPLIED (Communication Dispatched)</option>
                      <option value="closed">CLOSED (Archived)</option>
                    </select>
                  </div>

                  <span className="text-[11px] font-mono text-stone">
                    Logged on {new Date(selectedEnquiry.created_at).toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Key Sender Profile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-charcoal border border-line space-y-2">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-stone">
                      Sender Contact
                    </div>
                    <div className="text-ivory font-serif text-lg">{selectedEnquiry.name}</div>
                    <div className="text-xs font-mono text-gold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      <a href={`mailto:${selectedEnquiry.email}`} className="hover:underline">
                        {selectedEnquiry.email}
                      </a>
                    </div>
                    {selectedEnquiry.phone && (
                      <div className="text-xs font-mono text-stone flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        <a href={`tel:${selectedEnquiry.phone}`} className="hover:underline">
                          {selectedEnquiry.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-charcoal border border-line space-y-2">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-stone">
                      Strategic Parameters
                    </div>
                    <div className="text-xs text-stone">
                      Category:{" "}
                      <span className="text-gold font-mono uppercase font-bold">
                        {selectedEnquiry.type}
                      </span>
                    </div>
                    <div className="text-xs text-stone">
                      Preferred Channel:{" "}
                      <span className="text-ivory font-mono uppercase">
                        {selectedEnquiry.contact_method}
                      </span>
                    </div>
                    {selectedEnquiry.budget && (
                      <div className="text-xs text-stone">
                        Budget / Valuation:{" "}
                        <span className="text-ivory font-mono font-medium">
                          {selectedEnquiry.budget}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject & Message */}
                <div className="space-y-2 p-5 bg-charcoal border border-line">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-stone">
                    Subject Line
                  </div>
                  <h3 className="font-display text-lg text-ivory font-semibold">
                    {selectedEnquiry.subject}
                  </h3>
                  <hr className="border-line my-3" />
                  <div className="text-[10px] uppercase font-mono tracking-wider text-stone mb-1">
                    Message Body
                  </div>
                  <div className="text-ivory text-sm leading-relaxed whitespace-pre-wrap font-sans bg-ink/50 p-4 border border-line/60">
                    {selectedEnquiry.message}
                  </div>
                </div>

                {/* Quick actions in modal */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="primary"
                    onClick={() => setDetailTab("reply")}
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Compose Reply Email</span>
                  </Button>
                </div>
              </div>
            )}

            {/* TAB: REPLY BY EMAIL */}
            {detailTab === "reply" && (
              <form onSubmit={handleSendReply} className="space-y-4">
                <div className="p-3 bg-ink border border-line text-xs font-mono text-stone space-y-1">
                  <div>
                    Dispatching to: <span className="text-gold font-bold">{selectedEnquiry.email}</span>
                  </div>
                  <div>
                    From: <span className="text-ivory">connect@javigroups.com (Management Office)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-mono text-stone">Subject</label>
                  <input
                    type="text"
                    required
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    className="w-full bg-ink border border-line px-3 py-2 text-xs text-ivory focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-mono text-stone">
                    Executive Message
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full bg-ink border border-line p-3 text-xs text-ivory font-mono leading-relaxed focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-line">
                  <span className="text-[10px] text-stone font-mono">
                    * Sending will mark inquiry as &quot;Replied&quot; and log an audit note.
                  </span>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDetailTab("details")}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={isSendingReply}
                      className="flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSendingReply ? "Dispatching..." : "Send Formal Email"}</span>
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB: INTERNAL AUDIT NOTES */}
            {detailTab === "notes" && (
              <div className="space-y-5">
                {/* New Note Form */}
                <form onSubmit={handleAddNote} className="space-y-3 p-4 bg-ink border border-line">
                  <label className="text-[11px] uppercase font-mono text-stone block">
                    Record Internal Executive Note
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Log internal feedback, telephone call summary, or casting director notes..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="w-full bg-charcoal border border-line p-2.5 text-xs text-ivory placeholder:text-stone/50 focus:outline-none focus:border-gold"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={isSavingNote}
                    >
                      {isSavingNote ? "Logging..." : "Add Confidential Note"}
                    </Button>
                  </div>
                </form>

                {/* Notes History */}
                <div className="space-y-3">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-stone">
                    Audit Trail ({currentEnquiryNotes.length})
                  </div>
                  {currentEnquiryNotes.map((n) => (
                    <div
                      key={n.id}
                      className="p-3.5 bg-charcoal border border-line text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-stone">
                        <span className="text-gold font-bold">{n.created_by}</span>
                        <span>{new Date(n.created_at).toLocaleString("en-IN")}</span>
                      </div>
                      <p className="text-ivory leading-relaxed font-sans">{n.note}</p>
                    </div>
                  ))}

                  {currentEnquiryNotes.length === 0 && (
                    <div className="text-center py-6 text-stone text-xs bg-charcoal/20 border border-line">
                      No internal notes recorded for this dossier yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
