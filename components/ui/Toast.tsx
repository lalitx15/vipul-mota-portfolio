"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (options: Omit<ToastItem, "id">) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, title, message, duration = 3000 }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) => addToast({ type: "success", title, message }),
    [addToast]
  );

  const error = useCallback(
    (message: string, title?: string) => addToast({ type: "error", title, message }),
    [addToast]
  );

  const info = useCallback(
    (message: string, title?: string) => addToast({ type: "info", title, message }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
      {children}

      {/* Toast Viewport Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <m.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto relative overflow-hidden bg-charcoal border border-line p-4 shadow-xl"
            >
              <div className="flex items-start space-x-3">
                <span className="shrink-0 mt-0.5">
                  {t.type === "success" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {t.type === "error" && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  {t.type === "info" && (
                    <Info className="w-4 h-4 text-gold" />
                  )}
                </span>

                <div className="flex-1 space-y-0.5">
                  {t.title && (
                    <h4 className="font-serif text-sm text-ivory font-normal">
                      {t.title}
                    </h4>
                  )}
                  <p className="text-xs text-stone leading-relaxed font-sans">
                    {t.message}
                  </p>
                </div>

                <button
                  onClick={() => removeToast(t.id)}
                  aria-label="Dismiss toast"
                  className="shrink-0 text-stone hover:text-ivory transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress bar timer indicator */}
              {t.duration && t.duration > 0 && (
                <m.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: t.duration / 1000, ease: "linear" }}
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-[2px] origin-left",
                    t.type === "success" && "bg-emerald-400",
                    t.type === "error" && "bg-red-400",
                    t.type === "info" && "bg-gold"
                  )}
                />
              )}
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
