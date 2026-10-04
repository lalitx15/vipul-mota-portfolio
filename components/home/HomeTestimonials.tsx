import React from "react";
import type { TestimonialItem } from "@/lib/supabase/home";

interface HomeTestimonialsProps {
  testimonials: TestimonialItem[];
}

export function HomeTestimonials({ testimonials }: HomeTestimonialsProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="max-w-site mx-auto px-6 py-20 md:py-28 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-line pb-6 gap-4">
        <div className="space-y-1">
          <span className="editorial-label text-gold">Endorsements &amp; Dialogue</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-ivory font-light">
            Published Testimonials
          </h2>
        </div>
        <p className="text-stone text-xs font-light max-w-sm">
          Select words from collaborators, industry directors, and private syndicates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-8 bg-charcoal border border-line space-y-4"
          >
            <p className="font-serif text-lg md:text-xl text-ivory/90 italic font-light leading-relaxed">
              &ldquo;{t.body}&rdquo;
            </p>
            <div className="border-t border-line/50 pt-4 flex items-center justify-between text-xs">
              <span className="font-medium text-ivory tracking-wide">{t.name}</span>
              <span className="text-stone">{t.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
