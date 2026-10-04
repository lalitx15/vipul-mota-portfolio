import React from "react";
import { MapPin, Mail, Phone, ArrowUpRight, Instagram, Youtube } from "lucide-react";

interface ContactDirectCardsProps {
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

export function ContactDirectCards({
  contactEmail = "connect@javigroups.com",
  contactPhone = "+91 98200 00000",
  address = "Marine Drive, Mumbai, Maharashtra, India",
  instagramUrl = "https://instagram.com/javigroups",
  youtubeUrl = "https://youtube.com/@VibewithVipulMota",
}: ContactDirectCardsProps) {
  return (
    <div className="space-y-8">
      {/* 3 Direct Dossier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Principal Office */}
        <div className="bg-charcoal border border-line p-8 space-y-4 flex flex-col justify-between hover:border-gold/60 transition-colors">
          <div className="space-y-3">
            <div className="w-10 h-10 border border-line flex items-center justify-center text-gold">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="editorial-label text-gold text-xs">Principal Office</span>
            <h3 className="font-serif text-2xl text-ivory font-light">
              South Mumbai
            </h3>
            <p className="text-stone text-xs leading-relaxed font-light">
              {address}
            </p>
          </div>

          <div className="pt-4 border-t border-line/50 text-[11px] text-stone font-mono">
            By Executive Appointment Only
          </div>
        </div>

        {/* Card 2: Direct Communications */}
        <div className="bg-charcoal border border-line p-8 space-y-4 flex flex-col justify-between hover:border-gold/60 transition-colors">
          <div className="space-y-3">
            <div className="w-10 h-10 border border-line flex items-center justify-center text-gold">
              <Mail className="w-5 h-5" />
            </div>
            <span className="editorial-label text-gold text-xs">Executive Desk</span>
            <h3 className="font-serif text-2xl text-ivory font-light">
              Electronic Mail
            </h3>
            <div className="space-y-1 text-xs">
              <a
                href={`mailto:${contactEmail}`}
                className="text-ivory hover:text-gold transition-colors block font-mono"
              >
                {contactEmail}
              </a>
              <a
                href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                className="text-stone hover:text-ivory transition-colors block font-mono"
              >
                {contactPhone}
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-line/50 text-[11px] text-stone font-mono">
            Standard Response: Within 24 Hours
          </div>
        </div>

        {/* Card 3: Digital Authority Channels */}
        <div className="bg-charcoal border border-line p-8 space-y-4 flex flex-col justify-between hover:border-gold/60 transition-colors">
          <div className="space-y-3">
            <div className="w-10 h-10 border border-line flex items-center justify-center text-gold">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="editorial-label text-gold text-xs">Digital Verification</span>
            <h3 className="font-serif text-2xl text-ivory font-light">
              Official Channels
            </h3>
            <div className="space-y-2 text-xs">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-stone hover:text-ivory transition-colors group"
              >
                <span>Instagram (@javigroups)</span>
                <span className="text-gold font-mono text-[11px]">1 Million+</span>
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-stone hover:text-ivory transition-colors group"
              >
                <span>YouTube (@VibewithVipulMota)</span>
                <span className="text-gold font-mono text-[11px]">100K+</span>
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-line/50 text-[11px] text-stone font-mono">
            Verified Digital Accounts
          </div>
        </div>
      </div>
    </div>
  );
}
