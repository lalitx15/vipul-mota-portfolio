"use client";

import React from "react";
import Link from "next/link";
import { Download, FileText, Camera, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface AboutPressKitProps {
  contactEmail?: string;
}

export function AboutPressKit({ contactEmail = "connect@javigroups.com" }: AboutPressKitProps) {
  const { info } = useToast();

  const handleDownload = (filename: string) => {
    // In production, this can point to Supabase Storage documents bucket
    info(
      `Downloading official media asset: ${filename}. For press clearances, reach ${contactEmail}.`,
      "Press Kit Archive"
    );
  };

  return (
    <section className="bg-charcoal border-t border-line py-20 md:py-32 px-6">
      <div className="max-w-site mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-line pb-6 gap-4">
          <div className="space-y-1">
            <span className="editorial-label text-gold">05 / Media &amp; Press</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-ivory">
              Official Media Bio &amp; Press Assets
            </h2>
          </div>
          <span className="editorial-label text-stone text-xs">
            Direct Casting &middot; Press Clearances
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Official Media Bio PDF */}
          <div className="bg-ink border border-line p-8 space-y-6 flex flex-col justify-between hover:border-gold/60 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 border border-line flex items-center justify-center text-gold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-ivory font-light">
                Official Media Bio &amp; Credits
              </h3>
              <p className="text-stone text-xs sm:text-sm font-light leading-relaxed">
                Comprehensive one-sheet dossier detailing screen acting history (Crime World 2022 on ShemarooMe), Javi Groups credentials, and verified biographical milestones.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload("Vipul-Govindji-Mota-Media-Bio-2026.pdf")}
              className="w-full justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Media Bio (PDF)
            </Button>
          </div>

          {/* Card 2: High-Resolution Lookbook Plates */}
          <div className="bg-ink border border-line p-8 space-y-6 flex flex-col justify-between hover:border-gold/60 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 border border-line flex items-center justify-center text-gold">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-ivory font-light">
                High-Res Press Portraits
              </h3>
              <p className="text-stone text-xs sm:text-sm font-light leading-relaxed">
                Editorial photographic plates, cinematic stills, and high-contrast studio portraits cleared for journalistic usage, magazine publications, and casting boards.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload("Vipul-Mota-HighRes-Portraits-Package.zip")}
              className="w-full justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Press Stills (ZIP)
            </Button>
          </div>

          {/* Card 3: Direct Casting & Booking Inquiries */}
          <div className="bg-ink border border-line p-8 space-y-6 flex flex-col justify-between hover:border-gold/60 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 border border-line flex items-center justify-center text-gold">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-ivory font-light">
                Casting &amp; Representation
              </h3>
              <p className="text-stone text-xs sm:text-sm font-light leading-relaxed">
                For film casting enquiries, fashion lookbook collaborations, corporate keynote addresses, or private syndication consultations.
              </p>
            </div>

            <Link href="/contact" className="w-full">
              <Button variant="gold" size="sm" className="w-full justify-center">
                Initiate Booking Inquiry &rarr;
              </Button>
            </Link>
          </div>
        </div>

        {/* Legal & Clearances note */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-line text-xs text-stone">
          <span>Official Press Archive &middot; Vipul Mota</span>
          <span className="mt-2 sm:mt-0">
            For editorial rights inquiries: <span className="text-ivory">{contactEmail}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
