"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Mail, Phone, Key, ShieldAlert, Trash2, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { updateProfileAction } from "@/lib/supabase/actions";
import {
  sendPasswordResetEmailAction,
  requestAccountDeletionAction,
  type ProfileRow,
} from "@/lib/supabase/member";

interface MemberProfileTabProps {
  profile: ProfileRow | null;
}

export function MemberProfileTab({ profile }: MemberProfileTabProps) {
  const { success, error, info } = useToast();

  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfileAction(formData);
    setIsUpdating(false);

    if (res.error) {
      error(res.error, "Update Notice");
    } else {
      success("Your profile parameters have been updated.", "Profile Saved");
    }
  };

  const handlePasswordReset = async () => {
    setIsSendingReset(true);
    const res = await sendPasswordResetEmailAction();
    setIsSendingReset(false);

    if (res.error) {
      error(res.error, "Error");
    } else {
      success(
        res.message || "Password reset instructions sent to your email.",
        "Dispatch Delivered"
      );
    }
  };

  const handleAccountDeletion = async () => {
    setIsDeleting(true);
    const res = await requestAccountDeletionAction();
    setIsDeleting(false);

    if (res.error) {
      error(res.error, "Error");
    } else {
      setDeleteModalOpen(false);
      info(
        "Your account deletion request has been logged and your session terminated.",
        "Account Closed"
      );
      window.location.href = "/";
    }
  };

  return (
    <div className="space-y-12">
      {/* 01. Profile Information Form */}
      <div className="bg-charcoal border border-line p-8 md:p-10 space-y-8">
        <div className="border-b border-line pb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-ivory font-light">
              Executive Profile &amp; Contact Parameters
            </h2>
            <p className="text-stone text-xs pt-1">
              Keep your credentials and correspondence phone number updated.
            </p>
          </div>
          <span className="editorial-label text-gold text-xs">Tier: Member</span>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Avatar Preview & URL */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-line/60">
            <div className="relative w-20 h-20 rounded-full bg-ink border border-line overflow-hidden shrink-0 flex items-center justify-center text-stone">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || "Avatar"}
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-gold" />
              )}
            </div>

            <div className="space-y-2 flex-1">
              <label className="editorial-label text-stone block text-xs">
                Profile Avatar Image URL
              </label>
              <input
                type="url"
                name="avatarUrl"
                defaultValue={profile?.avatar_url || ""}
                placeholder="https://images.unsplash.com/... or storage URL"
                className="w-full bg-ink border border-line p-3 text-xs text-ivory placeholder-stone/60 focus:outline-none focus:border-gold transition-colors"
              />
              <p className="text-[11px] text-stone">
                Enter an image URL or avatar asset to personalize your member identity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="editorial-label text-stone block text-xs">
                Full Name / Designation
              </label>
              <input
                type="text"
                name="fullName"
                defaultValue={profile?.full_name || ""}
                placeholder="Your Full Name"
                required
                className="w-full bg-ink border border-line p-3 text-xs text-ivory placeholder-stone/60 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Email Address (Read-only) */}
            <div className="space-y-2">
              <label className="editorial-label text-stone block text-xs">
                Email Address (Verified)
              </label>
              <input
                type="email"
                value={profile?.email || ""}
                readOnly
                disabled
                className="w-full bg-ink/60 border border-line/60 p-3 text-xs text-stone font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="space-y-2">
              <label className="editorial-label text-stone block text-xs">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={profile?.phone || ""}
                placeholder="+91 98200 00000"
                className="w-full bg-ink border border-line p-3 text-xs text-ivory placeholder-stone/60 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Newsletter Subscription */}
            <div className="space-y-2 flex flex-col justify-center pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="newsletterOptIn"
                  defaultChecked={profile?.newsletter_opt_in ?? true}
                  className="w-4 h-4 rounded-none bg-ink border-line text-gold focus:ring-0 accent-[#B8965F]"
                />
                <span className="text-xs text-ivory">
                  Receive private seasonal dispatches and wealth memos
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-line/60 flex justify-end">
            <Button type="submit" variant="gold" size="sm" disabled={isUpdating}>
              {isUpdating ? "Saving Changes..." : "Save Profile Details"}
            </Button>
          </div>
        </form>
      </div>

      {/* 02. Security & Credentials Section */}
      <div className="bg-charcoal border border-line p-8 md:p-10 space-y-6">
        <div className="border-b border-line pb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-ivory font-light">
              Security &amp; Password
            </h2>
            <p className="text-stone text-xs pt-1">
              Protect your Inner Circle session with strong authentication.
            </p>
          </div>
          <Key className="w-5 h-5 text-gold" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs text-ivory font-medium">Reset Account Password</p>
            <p className="text-xs text-stone font-light">
              We will transmit a secure, single-use password update link to {profile?.email}.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePasswordReset}
            disabled={isSendingReset}
          >
            {isSendingReset ? "Sending Dispatch..." : "Send Password Reset Link"}
          </Button>
        </div>
      </div>

      {/* 03. Danger Zone / Account Deletion */}
      <div className="bg-charcoal border border-red-500/20 p-8 md:p-10 space-y-6">
        <div className="border-b border-red-500/20 pb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-red-400 font-light">
              Account Deactivation
            </h2>
            <p className="text-stone text-xs pt-1">
              Request soft-deletion of your member profile and saved dossier.
            </p>
          </div>
          <ShieldAlert className="w-5 h-5 text-red-400" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-stone font-light max-w-lg">
            Deactivating your profile will suspend your access to the Inner Circle vault, delete saved bookmarks, and cancel your newsletter dispatches.
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteModalOpen(true)}
            className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-400"
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" />
            Request Deactivation
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Account Deactivation"
      >
        <div className="space-y-6 py-2">
          <p className="text-sm text-stone leading-relaxed">
            Are you certain you wish to terminate your Inner Circle membership? Your saved collection plates and correspondence history will be archived and inaccessible.
          </p>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-line">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={handleAccountDeletion}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              {isDeleting ? "Processing..." : "Confirm Deactivation"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
