"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { loginAction, signupAction } from "@/lib/supabase/actions";
import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "@/lib/firebase/config";

export interface AuthCardProps {
  mode?: "login" | "signup";
  next?: string;
  initialError?: string | null;
}

export function AuthCard({
  mode = "login",
  next = "/member",
  initialError = null,
}: AuthCardProps) {
  const isSignup = mode === "signup";

  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  // 3D card tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("next", next);
    if (isSignup) {
      formData.append("fullName", fullName);
      formData.append("newsletterOptIn", "on");
    }

    try {
      const result = isSignup
        ? await signupAction(formData)
        : await loginAction(formData);

      if (result?.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
        return;
      }
      setErrorMessage("Authentication encountered an error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setErrorMessage(null);

      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      const user = userCredential.user;

      if (!user.email) {
        throw new Error("No verified email received from Google account.");
      }

      const res = await fetch("/api/auth/firebase-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          fullName: user.displayName || "",
          avatarUrl: user.photoURL || "",
          requireAdmin: false,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Authentication synchronization failed.");
      }

      const targetUrl = next && next.startsWith("/") ? next : "/member";
      window.location.href = targetUrl;
    } catch (err: unknown) {
      console.error("Google Auth Error:", err);
      let message = "Failed to sign in with Google.";
      if (err instanceof Error) {
        if (err.message.includes("auth/popup-closed-by-user")) {
          message = "Sign-in cancelled. Popup was closed.";
        } else if (err.message.includes("auth/unauthorized-domain")) {
          message = "Domain not authorized in Firebase Console.";
        } else {
          message = err.message;
        }
      }
      setErrorMessage(message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center py-6 px-4">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[650px] max-h-[650px] rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] max-w-[450px] max-h-[450px] rounded-full bg-gold/10 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 8 }}
        >
          <div className="relative group">
            {/* Card glow effect */}
            <motion.div
              className="absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"
              animate={{
                boxShadow: [
                  "0 0 15px 2px rgba(184, 134, 11, 0.08)",
                  "0 0 25px 6px rgba(147, 51, 234, 0.15)",
                  "0 0 15px 2px rgba(184, 134, 11, 0.08)",
                ],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "mirror",
              }}
            />

            {/* Traveling light beam effect */}
            <div className="absolute -inset-[1px] rounded-3xl overflow-hidden pointer-events-none">
              {/* Top light beam */}
              <motion.div
                className="absolute top-0 left-0 h-[2.5px] w-[50%] bg-gradient-to-r from-transparent via-gold to-transparent opacity-80"
                animate={{
                  left: ["-50%", "100%"],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  left: {
                    duration: 2.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0.8,
                  },
                  opacity: {
                    duration: 1.4,
                    repeat: Infinity,
                    repeatType: "mirror",
                  },
                }}
              />

              {/* Right light beam */}
              <motion.div
                className="absolute top-0 right-0 h-[50%] w-[2.5px] bg-gradient-to-b from-transparent via-purple-300 to-transparent opacity-80"
                animate={{
                  top: ["-50%", "100%"],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  top: {
                    duration: 2.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0.8,
                    delay: 0.7,
                  },
                  opacity: {
                    duration: 1.4,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 0.7,
                  },
                }}
              />

              {/* Bottom light beam */}
              <motion.div
                className="absolute bottom-0 right-0 h-[2.5px] w-[50%] bg-gradient-to-r from-transparent via-gold to-transparent opacity-80"
                animate={{
                  right: ["-50%", "100%"],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  right: {
                    duration: 2.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0.8,
                    delay: 1.4,
                  },
                  opacity: {
                    duration: 1.4,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1.4,
                  },
                }}
              />

              {/* Left light beam */}
              <motion.div
                className="absolute bottom-0 left-0 h-[50%] w-[2.5px] bg-gradient-to-b from-transparent via-purple-300 to-transparent opacity-80"
                animate={{
                  bottom: ["-50%", "100%"],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  bottom: {
                    duration: 2.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0.8,
                    delay: 2.1,
                  },
                  opacity: {
                    duration: 1.4,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 2.1,
                  },
                }}
              />

              {/* Corner luminous nodes */}
              <div className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-gold/80 blur-[0.5px]" />
              <div className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-purple-300/80 blur-[0.5px]" />
              <div className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-gold/80 blur-[0.5px]" />
              <div className="absolute bottom-0 left-0 h-1.5 w-1.5 rounded-full bg-purple-300/80 blur-[0.5px]" />
            </div>

            {/* Glass card container */}
            <div className="relative bg-neutral-950/80 backdrop-blur-2xl rounded-3xl p-7 sm:p-9 border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
              {/* Subtle inner grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                  backgroundSize: "30px 30px",
                }}
              />

              {/* Header with Monogram Badge */}
              <div className="text-center space-y-2 mb-6 relative z-10">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="mx-auto w-12 h-12 rounded-full border border-gold/40 bg-gradient-to-br from-gold/20 via-neutral-900 to-black flex items-center justify-center shadow-lg relative overflow-hidden"
                >
                  <span className="font-serif text-lg font-bold tracking-widest text-gold">
                    VM
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-2xl font-serif font-bold text-white tracking-tight"
                >
                  {isSignup ? "Create Member Account" : "Welcome Back"}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-neutral-400 text-xs max-w-xs mx-auto leading-relaxed"
                >
                  {isSignup
                    ? "Join Vipul Mota's inner circle for exclusive archives, private lookbooks, and booking tracking."
                    : "Sign in to access your member dashboard, saved lookbooks, and booking enquiries."}
                </motion.p>
              </div>

              {/* Error Alert Box */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl border border-red-500/40 bg-red-950/30 text-red-300 text-xs leading-relaxed animate-in fade-in">
                  {errorMessage}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="space-y-3">
                  {/* Full Name (Sign Up only) */}
                  {isSignup && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className={focusedInput === "fullName" ? "z-10" : ""}
                    >
                      <div className="relative flex items-center rounded-xl overflow-hidden border border-white/10 bg-white/5 focus-within:border-gold/60 focus-within:bg-white/[0.08] transition-all duration-300">
                        <User
                          className={`absolute left-3.5 w-4 h-4 transition-colors duration-300 ${
                            focusedInput === "fullName" ? "text-gold" : "text-neutral-400"
                          }`}
                        />
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          required
                          placeholder="Your Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          onFocus={() => setFocusedInput("fullName")}
                          onBlur={() => setFocusedInput(null)}
                          className="w-full bg-transparent text-white placeholder:text-neutral-500 h-11 pl-11 pr-3 text-sm outline-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Email Input */}
                  <div
                    className={cn(
                      "relative flex items-center rounded-xl overflow-hidden border border-white/10 bg-white/5 focus-within:border-gold/60 focus-within:bg-white/[0.08] transition-all duration-300",
                      focusedInput === "email" ? "z-10" : ""
                    )}
                  >
                    <Mail
                      className={`absolute left-3.5 w-4 h-4 transition-colors duration-300 ${
                        focusedInput === "email" ? "text-gold" : "text-neutral-400"
                      }`}
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput(null)}
                      className="w-full bg-transparent text-white placeholder:text-neutral-500 h-11 pl-11 pr-3 text-sm outline-none"
                    />
                  </div>

                  {/* Password Input */}
                  <div
                    className={cn(
                      "relative flex items-center rounded-xl overflow-hidden border border-white/10 bg-white/5 focus-within:border-gold/60 focus-within:bg-white/[0.08] transition-all duration-300",
                      focusedInput === "password" ? "z-10" : ""
                    )}
                  >
                    <Lock
                      className={`absolute left-3.5 w-4 h-4 transition-colors duration-300 ${
                        focusedInput === "password" ? "text-gold" : "text-neutral-400"
                      }`}
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                      className="w-full bg-transparent text-white placeholder:text-neutral-500 h-11 pl-11 pr-11 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-neutral-400 hover:text-white transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password (Sign in only) */}
                {!isSignup ? (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer text-xs text-neutral-400 hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-white/20 bg-white/5 text-gold focus:ring-gold/30"
                      />
                      <span>Remember me</span>
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs text-neutral-400 hover:text-gold transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                ) : null}

                {/* Primary Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group/button mt-4"
                >
                  <div className="absolute inset-0 bg-gold/20 rounded-xl blur-lg opacity-0 group-hover/button:opacity-80 transition-opacity duration-300" />
                  <div className="relative overflow-hidden bg-gradient-to-r from-gold via-[#D4AF37] to-gold text-black font-semibold text-sm h-11 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="flex items-center justify-center gap-1.5 tracking-wide">
                          {isSignup ? "Create Member Account" : "Sign In to Inner Circle"}
                          <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
                        </span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Minimal Divider */}
                <div className="relative my-4 flex items-center">
                  <div className="flex-grow border-t border-white/10" />
                  <span className="mx-3 text-[11px] uppercase tracking-wider text-neutral-500 font-mono">
                    or
                  </span>
                  <div className="flex-grow border-t border-white/10" />
                </div>

                {/* Google Sign In Button */}
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full relative group/google"
                >
                  <div className="relative overflow-hidden bg-white/5 hover:bg-white/10 text-white text-xs font-medium h-11 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2.5">
                    {googleLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M12 5c1.54 0 2.94.55 4.04 1.46l3.03-3.03C17.24 1.7 14.81 1 12 1 7.42 1 3.53 3.61 1.66 7.42l3.65 2.83C6.18 7.4 8.85 5 12 5z"
                          />
                          <path
                            fill="#4285F4"
                            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.72 2.88c2.18-2.01 3.7-4.97 3.7-8.7z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.31 14.75c-.24-.71-.38-1.47-.38-2.25s.14-1.54.38-2.25L1.66 7.42C.6 9.54 0 11.7 0 14s.6 4.46 1.66 6.58l3.65-2.83z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.72-2.88c-1.07.72-2.45 1.16-4.21 1.16-3.15 0-5.82-2.4-6.69-5.25L1.66 16c1.87 3.81 5.76 6.42 10.34 6.42z"
                          />
                        </svg>
                        <span>Continue with Google</span>
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Switch between Sign In / Sign Up */}
                <p className="text-center text-xs text-neutral-400 pt-2">
                  {isSignup ? (
                    <>
                      Already have a member account?{" "}
                      <Link
                        href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
                        className="text-white hover:text-gold font-medium underline underline-offset-4 transition-colors"
                      >
                        Sign in
                      </Link>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{" "}
                      <Link
                        href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`}
                        className="text-white hover:text-gold font-medium underline underline-offset-4 transition-colors"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export const Component = AuthCard;
export default AuthCard;
