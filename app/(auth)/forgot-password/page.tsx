"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/supabase/actions";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await forgotPasswordAction(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccessMessage(result.message || "Password reset instructions sent.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-3">
        <h1 className="font-serif text-3xl text-ivory">Password Recovery</h1>
        <p className="text-stone text-sm">
          Enter the email address associated with your account, and we will send you private instructions to reset your password.
        </p>
      </div>

      {error && (
        <div className="p-3 border border-red-500/40 bg-red-950/20 text-red-300 text-xs">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-4 border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 text-xs leading-relaxed space-y-2">
          <p className="font-medium">Instructions Dispatched</p>
          <p>{successMessage}</p>
        </div>
      )}

      {!successMessage && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className="editorial-label text-stone block">
              Registered Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="vipul@example.com"
              className="w-full px-4 py-3 bg-charcoal border border-line text-ivory text-sm placeholder:text-stone/40 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-gold hover:bg-[#A38350] text-ink font-medium text-xs uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 mt-2"
          >
            {loading ? "Sending Instructions..." : "Send Reset Link &rarr;"}
          </button>
        </form>
      )}

      <div className="text-center pt-4">
        <Link
          href="/login"
          className="editorial-label text-stone hover:text-gold transition-colors inline-block"
        >
          &larr; Return to Sign In
        </Link>
      </div>
    </div>
  );
}
