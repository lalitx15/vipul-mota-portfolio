"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPasswordAction } from "@/lib/supabase/actions";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await resetPasswordAction(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
        return;
      }
      setError("An unexpected error occurred while updating password.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-3">
        <h1 className="font-serif text-3xl text-ivory">Set New Password</h1>
        <p className="text-stone text-sm">
          Please enter your new secure password below to regain full access to your account.
        </p>
      </div>

      {error && (
        <div className="p-3 border border-red-500/40 bg-red-950/20 text-red-300 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label htmlFor="password" className="editorial-label text-stone block">
            New Password (Min 8 chars, 1 uppercase & 1 number)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-charcoal border border-line text-ivory text-sm placeholder:text-stone/40 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="editorial-label text-stone block">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-charcoal border border-line text-ivory text-sm placeholder:text-stone/40 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 bg-gold hover:bg-[#A38350] text-ink font-medium text-xs uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 mt-2"
        >
          {loading ? "Updating..." : "Update Password &rarr;"}
        </button>
      </form>

      <div className="text-center pt-4">
        <Link
          href="/login"
          className="editorial-label text-stone hover:text-gold transition-colors inline-block"
        >
          &larr; Back to Sign In
        </Link>
      </div>
    </div>
  );
}
