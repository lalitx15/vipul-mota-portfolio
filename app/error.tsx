"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime exception captured:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-ink">
      <div className="editorial-label text-status-error mb-4">Interruption — System Notice</div>
      <h1 className="font-serif text-5xl md:text-7xl font-light text-ivory tracking-tight">
        An unexpected error occurred.
      </h1>
      <p className="mt-6 text-stone text-sm max-w-md leading-relaxed font-light">
        {error.message || "A temporary disturbance interrupted the experience."}
      </p>
      <div className="mt-10">
        <button
          onClick={() => reset()}
          className="inline-flex items-center px-8 py-3.5 border border-line text-xs uppercase tracking-widest text-ivory hover:border-gold hover:text-gold transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
