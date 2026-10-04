"use client";

import { useState } from "react";
import { updateProfileAction } from "@/lib/supabase/actions";
import type { ProfileRow } from "@/lib/supabase/user";

export function ProfileForm({ profile }: { profile: ProfileRow | null }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await updateProfileAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setMessage(result.message || "Profile successfully updated.");
      }
    } catch {
      setError("An unexpected error occurred while saving profile changes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {error && (
        <div className="p-3 border border-red-500/40 bg-red-950/20 text-red-300 text-xs">
          {error}
        </div>
      )}

      {message && (
        <div className="p-3 border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 text-xs">
          {message}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="fullName" className="editorial-label text-stone block">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          defaultValue={profile?.full_name || ""}
          placeholder="Your full name"
          className="w-full px-4 py-3 bg-ink border border-line text-ivory text-sm focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="editorial-label text-stone block">
          Contact Phone (Optional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={profile?.phone || ""}
          placeholder="+91 98200 00000"
          className="w-full px-4 py-3 bg-ink border border-line text-ivory text-sm focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      <div className="flex items-start space-x-3 pt-2">
        <input
          id="newsletterOptIn"
          name="newsletterOptIn"
          type="checkbox"
          defaultChecked={profile?.newsletter_opt_in ?? false}
          className="mt-1 h-4 w-4 rounded-none border-line bg-ink text-gold focus:ring-gold"
        />
        <label htmlFor="newsletterOptIn" className="text-stone text-xs leading-relaxed">
          Keep me subscribed to private dispatches, luxury articles, and finance inspiration notes.
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="py-3 px-6 bg-gold hover:bg-[#A38350] text-ink font-medium text-xs uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50"
      >
        {loading ? "Saving Changes..." : "Save Profile Changes &rarr;"}
      </button>
    </form>
  );
}
