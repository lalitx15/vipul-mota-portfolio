"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "@/lib/firebase/config";

interface GoogleAuthButtonProps {
  next?: string;
  requireAdmin?: boolean;
}

export function GoogleAuthButton({ next, requireAdmin = false }: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Trigger Firebase Google Sign-In Popup
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      const user = userCredential.user;

      if (!user.email) {
        throw new Error("No verified email received from Google account.");
      }

      // 2. Synchronize authenticated Google identity with Supabase SSR session
      const res = await fetch("/api/auth/firebase-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          fullName: user.displayName || "",
          avatarUrl: user.photoURL || "",
          requireAdmin,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Authentication synchronization failed.");
      }

      // 3. Navigate to target destination
      const targetUrl = next && next.startsWith("/") ? next : requireAdmin ? "/admin" : "/member";
      window.location.href = targetUrl;
    } catch (err: unknown) {
      console.error("Google Auth Error:", err);
      let message = "Failed to sign in with Google.";
      if (err instanceof Error) {
        if (err.message.includes("auth/popup-closed-by-user")) {
          message = "Sign-in cancelled. Popup was closed.";
        } else if (err.message.includes("auth/unauthorized-domain")) {
          message = "Domain not authorized in Firebase Console (add localhost & your domain).";
        } else if (err.message.includes("auth/operation-not-allowed")) {
          message = "Google Provider is not enabled in Firebase Console (Authentication > Sign-in method).";
        } else {
          message = err.message;
        }
      }
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-line bg-charcoal hover:bg-ink text-ivory text-sm tracking-wide transition-all duration-300 disabled:opacity-50 hover:border-gold/50 cursor-pointer"
      >
        <svg className="w-4 h-4 fill-current text-ivory" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>{loading ? "Authenticating with Google..." : "Continue with Google"}</span>
      </button>
      {error && (
        <p className="text-red-400 text-xs text-center leading-relaxed px-2 py-1 bg-red-950/20 border border-red-500/20">
          {error}
        </p>
      )}
    </div>
  );
}
