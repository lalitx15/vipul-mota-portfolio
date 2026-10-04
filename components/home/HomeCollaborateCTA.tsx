"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function HomeCollaborateCTA() {
  const { success, error } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      error("Please provide a valid email address.", "Invalid Entry");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmail("");
      success(
        "You have been granted access to private dispatches and seasonal announcements.",
        "Subscribed Successfully"
      );
    }, 600);
  };

  return (
    <section className="relative bg-black border-y border-neutral-900 overflow-hidden py-24 md:py-36 px-6">

      <div className="relative z-10 max-w-site mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Giant Collaboration Callout */}
        <div className="lg:col-span-7 space-y-6">
          <span className="editorial-label text-gold">10 / Collaboration &amp; Casting</span>
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-ivory leading-[1.05] tracking-tight">
            Have an ambitious screen narrative or bespoke brand vision?
          </h2>
          <p className="text-stone text-sm sm:text-base font-light max-w-lg leading-relaxed">
            Represented directly through Javi Groups Management. Accepting inquiries for feature films, episodic crime series, luxury brand endorsements, and private wealth forums.
          </p>

          <div className="pt-4 space-y-4">
            <div>
              <Link href="/contact">
                <Button variant="gold" size="lg">
                  Initiate Booking Inquiry &rarr;
                </Button>
              </Link>
            </div>

            {/* Decent Medium Size Direct Channel Icons (Call, WhatsApp, Email) */}
            <div className="flex items-center space-x-3.5 pt-1">
              {/* Call Direct Logo */}
              <a
                href="tel:+919321029306"
                aria-label="Call Direct: +91 93210 29306"
                title="Call Direct: +91 93210 29306"
                className="group relative w-12 h-12 rounded-full bg-neutral-900 border border-white/20 hover:border-gold flex items-center justify-center text-ivory hover:text-gold transition-all duration-300 shadow-md hover:scale-105 hover:bg-gold/10"
              >
                <Phone className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
              </a>

              {/* WhatsApp Logo */}
              <a
                href="https://wa.me/919321029306?text=Hello%20Vipul%20Mota%2C%20I%20would%20like%20to%20connect%20with%20you."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp: +91 93210 29306"
                title="WhatsApp: +91 93210 29306"
                className="group relative w-12 h-12 rounded-full bg-neutral-900 border border-white/20 hover:border-emerald-400 flex items-center justify-center text-ivory hover:text-emerald-400 transition-all duration-300 shadow-md hover:scale-105 hover:bg-emerald-500/10"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </a>

              {/* Official Email Logo */}
              <a
                href="mailto:connect@javigroups.com"
                aria-label="Official Email: connect@javigroups.com"
                title="Official Email: connect@javigroups.com"
                className="group relative w-12 h-12 rounded-full bg-neutral-900 border border-white/20 hover:border-gold flex items-center justify-center text-ivory hover:text-gold transition-all duration-300 shadow-md hover:scale-105 hover:bg-gold/10"
              >
                <Mail className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Private Dispatch Newsletter Signup */}
        <div className="lg:col-span-5 bg-charcoal/90 backdrop-blur-xl border border-line p-8 md:p-10 space-y-6 shadow-2xl">
          <div className="space-y-2 border-b border-line pb-4">

            <span className="editorial-label text-gold">Private Dispatches</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-light">
              Receive the Private Brief
            </h3>
            <p className="text-stone text-xs leading-relaxed font-light">
              Curated thoughts on style discipline, business equity, and exclusive lookbook releases sent directly from Vipul Mota&rsquo;s desk.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="newsletter-email" className="editorial-label text-stone block">
                Your Email Address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vipul@example.com"
                required
                className="w-full px-4 py-3.5 bg-ink border border-line text-ivory text-sm placeholder:text-stone/40 focus:outline-none focus:border-gold transition-colors font-sans"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              className="py-3.5"
            >
              {loading ? "Registering..." : "Join Private Dispatch \u2192"}
            </Button>
          </form>

          <p className="text-[11px] text-stone/70 text-center leading-relaxed">
            No spam. Strict confidentiality. Unsubscribe at any time with a single click.
          </p>
        </div>
      </div>
    </section>
  );
}
