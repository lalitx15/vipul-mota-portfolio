"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Users,
  Search,
  Download,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Mail,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  updateMemberStatusAction,
  updateMemberRoleAction,
} from "@/lib/supabase/admin-actions";

export interface MemberProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: "member" | "admin";
  status: "active" | "suspended";
  newsletter_opt_in: boolean;
  created_at: string;
  updated_at: string;
}

interface MemberManagerProps {
  initialMembers: MemberProfile[];
  currentAdminId?: string;
}

export function MemberManager({ initialMembers, currentAdminId }: MemberManagerProps) {
  const { success, error } = useToast();

  const [members, setMembers] = useState<MemberProfile[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "member" | "admin">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");

  // Role Change Modal
  const [roleModalUser, setRoleModalUser] = useState<MemberProfile | null>(null);
  const [targetRole, setTargetRole] = useState<"member" | "admin">("member");
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Status Change State
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // Handle Status Toggle
  const handleToggleStatus = async (user: MemberProfile) => {
    const nextStatus = user.status === "active" ? "suspended" : "active";
    setIsUpdatingStatus(user.id);

    const res = await updateMemberStatusAction(user.id, nextStatus);
    setIsUpdatingStatus(null);

    if (res.error) {
      error(res.error);
    } else {
      success(res.message || `Account marked as ${nextStatus}.`);
      setMembers((prev) =>
        prev.map((m) => (m.id === user.id ? { ...m, status: nextStatus } : m))
      );
    }
  };

  // Open Role Change Modal
  const handleOpenRoleModal = (user: MemberProfile) => {
    setRoleModalUser(user);
    setTargetRole(user.role === "admin" ? "member" : "admin");
  };

  // Execute Role Update
  const handleConfirmRoleChange = async () => {
    if (!roleModalUser) return;

    setIsUpdatingRole(true);
    const res = await updateMemberRoleAction(roleModalUser.id, targetRole);
    setIsUpdatingRole(false);

    if (res.error) {
      error(res.error);
    } else {
      success(res.message || `Account authority set to ${targetRole}.`);
      setMembers((prev) =>
        prev.map((m) => (m.id === roleModalUser.id ? { ...m, role: targetRole } : m))
      );
      setRoleModalUser(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Email", "Full Name", "Phone", "Role", "Status", "Newsletter", "Joined Date"];
    const rows = filteredMembers.map((m) => [
      m.id,
      m.email,
      `"${(m.full_name || "").replace(/"/g, '""')}"`,
      m.phone || "",
      m.role,
      m.status,
      m.newsletter_opt_in ? "Yes" : "No",
      new Date(m.created_at).toISOString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `members-roster-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success("Members roster CSV exported.");
  };

  // Filter Members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      (m.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.phone || "").includes(searchQuery);
    const matchesRole = roleFilter === "all" || m.role === roleFilter;
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalCount = members.length;
  const adminCount = members.filter((m) => m.role === "admin").length;
  const activeCount = members.filter((m) => m.status === "active").length;
  const newsletterCount = members.filter((m) => m.newsletter_opt_in).length;

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-mono block mb-2">
            Inner Circle & Community Roster
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-ivory tracking-tight">
            Member Registry
          </h1>
          <p className="text-stone text-sm mt-1 max-w-xl">
            Monitor registered members, review verified profile credentials, grant administrator access, and export audience metrics.
          </p>
        </div>

        <Button
          onClick={handleExportCSV}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-line text-ivory text-xs"
        >
          <Download className="w-3.5 h-3.5 text-gold" />
          <span>Export Member Roster</span>
        </Button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-charcoal border border-line">
          <div className="text-[10px] uppercase font-mono tracking-wider text-stone">
            Total Accounts
          </div>
          <div className="font-display text-2xl md:text-3xl text-ivory mt-1">{totalCount}</div>
        </div>

        <div className="p-4 bg-charcoal border border-line">
          <div className="text-[10px] uppercase font-mono tracking-wider text-stone">
            Active Members
          </div>
          <div className="font-display text-2xl md:text-3xl text-emerald-400 mt-1">
            {activeCount}
          </div>
        </div>

        <div className="p-4 bg-charcoal border border-line">
          <div className="text-[10px] uppercase font-mono tracking-wider text-stone">
            Administrators
          </div>
          <div className="font-display text-2xl md:text-3xl text-gold mt-1">{adminCount}</div>
        </div>

        <div className="p-4 bg-charcoal border border-line">
          <div className="text-[10px] uppercase font-mono tracking-wider text-stone">
            Newsletter Subscribers
          </div>
          <div className="font-display text-2xl md:text-3xl text-ivory mt-1">{newsletterCount}</div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-charcoal/40 p-4 border border-line">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by full name, email, or telephone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ink border border-line pl-10 pr-4 py-2 text-xs text-ivory placeholder:text-stone/60 focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase font-mono text-stone mr-1">Role:</span>
            <button
              onClick={() => setRoleFilter("all")}
              className={`px-2.5 py-1 text-xs font-mono ${
                roleFilter === "all" ? "bg-gold text-ink font-bold" : "text-stone hover:text-ivory bg-ink"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setRoleFilter("member")}
              className={`px-2.5 py-1 text-xs font-mono ${
                roleFilter === "member" ? "bg-gold text-ink font-bold" : "text-stone hover:text-ivory bg-ink"
              }`}
            >
              Members
            </button>
            <button
              onClick={() => setRoleFilter("admin")}
              className={`px-2.5 py-1 text-xs font-mono ${
                roleFilter === "admin" ? "bg-gold text-ink font-bold" : "text-stone hover:text-ivory bg-ink"
              }`}
            >
              Admins
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase font-mono text-stone mr-1">Status:</span>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-2.5 py-1 text-xs font-mono ${
                statusFilter === "all" ? "bg-gold text-ink font-bold" : "text-stone hover:text-ivory bg-ink"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-2.5 py-1 text-xs font-mono ${
                statusFilter === "active" ? "bg-gold text-ink font-bold" : "text-stone hover:text-ivory bg-ink"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("suspended")}
              className={`px-2.5 py-1 text-xs font-mono ${
                statusFilter === "suspended" ? "bg-gold text-ink font-bold" : "text-stone hover:text-ivory bg-ink"
              }`}
            >
              Suspended
            </button>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-charcoal border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ink/80 text-stone font-mono uppercase tracking-wider text-[10px] border-b border-line">
              <tr>
                <th className="py-3.5 px-4">Member Profile</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Direct Contact</th>
                <th className="py-3.5 px-4">Newsletter</th>
                <th className="py-3.5 px-4">Registration</th>
                <th className="py-3.5 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredMembers.map((member) => {
                const isSelf = member.id === currentAdminId;
                const isAdmin = member.role === "admin";
                const isActive = member.status === "active";

                return (
                  <tr key={member.id} className="hover:bg-ink/40 transition-colors">
                    {/* Profile & Name */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-ink border border-line overflow-hidden relative shrink-0 flex items-center justify-center font-serif text-sm text-gold font-bold">
                          {member.avatar_url ? (
                            <Image
                              src={member.avatar_url}
                              alt={member.full_name || member.email}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            (member.full_name || member.email).slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="text-ivory font-medium flex items-center gap-1.5">
                            <span>{member.full_name || "Inner Circle Member"}</span>
                            {isSelf && (
                              <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-gold/20 text-gold border border-gold/40">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-stone font-mono text-[11px]">{member.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${
                          isAdmin
                            ? "bg-gold/15 text-gold border-gold/40 font-bold"
                            : "bg-charcoal text-stone border-line"
                        }`}
                      >
                        {isAdmin ? <ShieldCheck className="w-3 h-3" /> : null}
                        {member.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${
                          isActive
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                            : "bg-red-950/60 text-red-400 border-red-800"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4 whitespace-nowrap text-stone font-mono text-[11px]">
                      {member.phone || "—"}
                    </td>

                    {/* Newsletter */}
                    <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px]">
                      {member.newsletter_opt_in ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed
                        </span>
                      ) : (
                        <span className="text-stone">Opted out</span>
                      )}
                    </td>

                    {/* Registration */}
                    <td className="py-4 px-4 whitespace-nowrap text-stone font-mono text-[11px]">
                      {new Date(member.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggleStatus(member)}
                          disabled={isSelf || isUpdatingStatus === member.id}
                          className={`px-2.5 py-1 text-xs font-mono border transition-colors ${
                            isActive
                              ? "text-stone hover:text-red-400 border-line hover:border-red-500/50 bg-ink"
                              : "text-emerald-400 border-emerald-800/80 hover:bg-emerald-950/50 bg-ink"
                          } ${isSelf ? "opacity-30 cursor-not-allowed" : ""}`}
                          title={isActive ? "Suspend Account" : "Reactivate Account"}
                        >
                          {isActive ? "Suspend" : "Activate"}
                        </button>

                        {/* Promote / Demote */}
                        <button
                          onClick={() => handleOpenRoleModal(member)}
                          disabled={isSelf}
                          className={`px-2.5 py-1 text-xs font-mono border transition-colors ${
                            isAdmin
                              ? "text-stone hover:text-ivory border-line hover:border-gold bg-ink"
                              : "text-gold border-gold/40 hover:bg-gold/10 bg-ink"
                          } ${isSelf ? "opacity-30 cursor-not-allowed" : ""}`}
                          title={isAdmin ? "Demote to Member" : "Promote to Admin"}
                        >
                          {isAdmin ? "Demote" : "Promote Admin"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-16 bg-charcoal/30">
            <Users className="w-10 h-10 text-stone/40 mx-auto mb-3" />
            <p className="text-ivory text-sm">No members match your search criteria.</p>
          </div>
        )}
      </div>

      {/* ROLE MODAL CONFIRMATION */}
      <Modal
        isOpen={!!roleModalUser}
        onClose={() => setRoleModalUser(null)}
        title={
          targetRole === "admin"
            ? "Promote Account to Full Administrator"
            : "Demote Account to Standard Member"
        }
      >
        {roleModalUser && (
          <div className="space-y-5">
            <div className="p-4 bg-ink border border-line space-y-2 text-xs">
              <div className="text-stone">Target Account:</div>
              <div className="font-bold text-ivory text-sm">
                {roleModalUser.full_name || roleModalUser.email} ({roleModalUser.email})
              </div>
              <div className="text-stone">Current Authority: <span className="text-gold font-mono uppercase">{roleModalUser.role}</span></div>
            </div>

            {targetRole === "admin" ? (
              <div className="p-4 bg-amber-950/40 border border-amber-800 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Owner Security Warning:</strong> Granting administrative privileges allows this user to edit all portfolio content, lookbook galleries, view private inquiries, moderate comments, and alter site settings.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-stone/20 border border-line text-stone text-xs leading-relaxed">
                Demoting this account will revoke access to the executive admin panel immediately upon their next session refresh.
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
              <Button
                variant="outline"
                onClick={() => setRoleModalUser(null)}
                disabled={isUpdatingRole}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmRoleChange}
                disabled={isUpdatingRole}
                className={targetRole === "admin" ? "bg-gold text-ink" : "bg-red-700 text-white"}
              >
                {isUpdatingRole
                  ? "Updating Permissions..."
                  : `Confirm ${targetRole === "admin" ? "Promotion" : "Demotion"}`}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
