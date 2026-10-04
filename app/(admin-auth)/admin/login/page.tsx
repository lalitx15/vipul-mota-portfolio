"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Lock, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMessage(data.error || "Authentication failed. Please check credentials.");
        setIsSubmitting(false);
        return;
      }

      // Success: direct instant browser redirect
      window.location.href = data.redirect || "/admin";
    } catch (err: any) {
      setErrorMessage(err.message || "Connection error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-ivory flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
      {/* Background Noise & Subtle Glow */}
      <div className="noise-overlay" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-stone hover:text-gold transition-colors tracking-wider uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Public Portfolio</span>
        </Link>

        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-gold border border-gold/30 px-3 py-1 bg-charcoal/50">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Internal Access Terminal</span>
        </div>
      </header>

      {/* Central Login Card */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-10">
        <div className="bg-charcoal border border-line p-8 md:p-10 shadow-2xl space-y-8">
          {/* Brand Header */}
          <div className="text-center space-y-3">
            <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border border-gold/50 shadow-md bg-black shrink-0">
              <Image
                src="/logo.png"
                alt="Vipul Mota Logo"
                fill
                sizes="64px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-gold block">
                Executive Administration
              </span>
              <h1 className="font-display text-2xl md:text-3xl text-ivory tracking-tight mt-1">
                Owner Portal
              </h1>
            </div>
            <p className="text-stone text-xs leading-relaxed max-w-xs mx-auto">
              Authenticate with administrative credentials to access the portfolio content management system.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="text-[11px] uppercase tracking-wider text-stone font-mono block"
              >
                Administrator Email
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="connect@javigroups.com"
                className="w-full bg-ink border border-line px-4 py-3 text-xs font-mono text-ivory placeholder:text-stone/40 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="text-[11px] uppercase tracking-wider text-stone font-mono block"
              >
                Master Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full bg-ink border border-line px-4 py-3 text-xs font-mono text-ivory placeholder:text-stone/40 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full py-3.5 text-xs flex items-center justify-center gap-2 mt-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Verifying Credentials..." : "Authenticate & Enter"}</span>
            </Button>
          </form>

          {/* Security Protocol Notice */}
          <div className="pt-4 border-t border-line/60 text-center">
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone/70">
              Restricted Environment &bull; Self-registration disabled
            </div>
            <p className="text-[11px] text-stone/50 mt-1">
              Admin identities are provisioned solely through the Supabase console.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-[10px] font-mono text-stone/60">
        &copy; {new Date().getFullYear()} Vipul Mota &middot; Javi Groups Executive Terminal
      </footer>
    </div>
  );
}
