"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, Instagram, Youtube, Facebook } from "lucide-react";
import { useLenis } from "./SmoothScroll";

export function Footer() {
  const { lenis } = useLenis();

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-charcoal text-ivory border-t border-line overflow-hidden pt-20 pb-12">
      <div className="max-w-site mx-auto px-6 space-y-16 md:space-y-24">
        {/* Top Collaboration Statement Band */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-12 gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="editorial-label text-gold block">
              Inquiries &amp; Collaborations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-ivory leading-tight">
              Let&rsquo;s create work of lasting presence and distinction.
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/contact"
              className="py-3.5 px-7 bg-gold hover:bg-[#A38350] text-ink font-medium text-xs uppercase tracking-[0.2em] transition-all"
            >
              Initiate Inquiry &rarr;
            </Link>
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="p-3 border border-line bg-ink text-stone hover:text-gold hover:border-gold transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Directory Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Column 1: Disciplines */}
          <div className="space-y-4">
            <span className="editorial-label text-stone block">01 / Disciplines</span>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <Link href="/work" className="hover:text-gold transition-colors text-ivory/80">
                  Cinema &amp; Screen (Crime World)
                </Link>
              </li>
              <li>
                <Link href="/work" className="hover:text-gold transition-colors text-ivory/80">
                  Fashion Modeling (Lookbook)
                </Link>
              </li>
              <li>
                <Link href="/work" className="hover:text-gold transition-colors text-ivory/80">
                  Javi Groups &amp; Private Wealth
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-gold transition-colors text-ivory/80">
                  Video Reels &amp; Screen Episodes
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Archive */}
          <div className="space-y-4">
            <span className="editorial-label text-stone block">02 / Archive</span>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <Link href="/about" className="hover:text-gold transition-colors text-ivory/80">
                  Biography &amp; Mumbai Journey
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold transition-colors text-ivory/80">
                  Photography &amp; Lookbook Plates
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-gold transition-colors text-ivory/80">
                  Editorial Journal &amp; Dispatches
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors text-ivory/80">
                  Management &amp; Casting Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Inner Circle Access */}
          <div className="space-y-4">
            <span className="editorial-label text-stone block">03 / Membership</span>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <Link href="/login" className="hover:text-gold transition-colors text-ivory/80">
                  Inner Circle Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-gold transition-colors text-ivory/80">
                  Request Member Account
                </Link>
              </li>
              <li>
                <Link href="/member" className="hover:text-gold transition-colors text-ivory/80">
                  Member Profile Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gold transition-colors text-ivory/80">
                  Owner Admin Terminal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Representation & Direct */}
          <div className="space-y-4">
            <span className="editorial-label text-stone block">04 / Direct</span>
            <div className="space-y-2 text-xs font-light leading-relaxed text-stone">
              <p className="text-ivory font-medium">Principal Office</p>
              <p>Marine Drive, Mumbai, Maharashtra, India</p>
              <p className="pt-2">
                <a
                  href="mailto:connect@javigroups.com"
                  className="text-ivory hover:text-gold transition-colors underline underline-offset-4"
                >
                  connect@javigroups.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+919321029306"
                  className="text-ivory hover:text-gold transition-colors font-mono"
                >
                  +91 93210 29306
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Huge Monogram / Typographic Signature */}
        <div className="border-t border-line/50 pt-12 overflow-hidden select-none">
          <p className="font-display text-[13vw] leading-[0.8] tracking-tighter font-medium text-stone/15 whitespace-nowrap text-center">
            VIPUL MOTA
          </p>
        </div>

        {/* Bottom Legal, Disclaimer & Socials */}
        <div className="border-t border-line pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-xs text-stone">
          {/* Copyright & Disclaimer */}
          <div className="space-y-1.5 max-w-xl">
            <p>
              &copy; {new Date().getFullYear()} Vipul Mota. All rights reserved. Javi Groups Mumbai.
            </p>
            <p className="text-[11px] text-stone/70 leading-relaxed">
              Content is for inspiration and information only and is not financial advice.
            </p>
          </div>

          {/* Social Links with Official Redirectable Logos */}
          <div className="flex items-center space-x-3 text-xs">
            {/* Instagram */}
            <a
              href="https://instagram.com/javigroups"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @javigroups"
              className="w-9 h-9 rounded-full border border-line bg-ink/70 flex items-center justify-center text-stone hover:text-gold hover:border-gold hover:scale-105 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@VibewithVipulMota"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube @VibewithVipulMota"
              className="w-9 h-9 rounded-full border border-line bg-ink/70 flex items-center justify-center text-stone hover:text-red-400 hover:border-red-400 hover:scale-105 transition-all"
            >
              <Youtube className="w-4 h-4" />
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919321029306?text=Hello%20Vipul%20Mota%2C%20I%20would%20like%20to%20connect%20with%20you."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp +91 93210 29306"
              className="w-9 h-9 rounded-full border border-line bg-ink/70 flex items-center justify-center text-stone hover:text-emerald-400 hover:border-emerald-400 hover:scale-105 transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.053-1.047-.075-.407-.126-.93-.321-1.637-.629-1.285-.561-2.122-1.848-2.186-1.934-.064-.085-.523-.695-.523-1.325 0-.63.33-.94.447-1.069.117-.128.256-.16.341-.16.086 0 .171.001.246.005.078.004.183-.03.287.218.106.255.362.883.394.947.032.064.053.139.011.224-.043.085-.064.139-.128.213-.064.075-.136.167-.194.225-.064.064-.131.134-.056.262.075.128.332.548.712.886.49.436.903.571 1.031.635.128.064.203.053.278-.032.075-.085.32-.373.405-.501.085-.128.171-.107.288-.064.117.043.746.352.874.416.128.064.213.096.245.149.032.053.032.31-.112.715z"/>
              </svg>
            </a>

            {/* Threads */}
            <a
              href="https://threads.net/@javigroups"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Threads @javigroups"
              className="w-9 h-9 rounded-full border border-line bg-ink/70 flex items-center justify-center text-stone hover:text-white hover:border-white hover:scale-105 transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 192 192">
                <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.745C77.4185 44.745 63.4897 55.3951 56.4022 73.0807L73.1933 80.5054C78.0859 68.3245 87.5255 62.6121 97.222 62.6121C110.231 62.6121 118.892 71.3986 120.301 88.461C107.989 87.2625 94.6756 87.9715 82.2619 92.4042C61.4283 99.8517 50.8407 114.77 54.0883 131.789C57.4334 149.336 73.6841 157.945 92.8333 156.442C112.569 154.893 125.645 143.513 131.47 131.061C137.16 142.923 147.199 150.395 160.778 150.395C179.919 150.395 192 135.253 192 113.682C192 64.905 154.269 32 97.222 32C46.883 32 8 68.7909 8 119.988C8 171.185 46.883 208 97.222 208C127.351 208 153.649 193.307 167.351 170.826L151.789 159.208C140.72 176.435 120.407 188.082 97.222 188.082C58.8251 188.082 28.0818 157.659 28.0818 119.988C28.0818 82.3171 58.8251 51.8941 97.222 51.8941C142.181 51.8941 171.918 76.5416 171.918 113.682C171.918 126.177 164.789 133.725 153.778 133.725C146.401 133.725 140.73 129.539 137.581 121.725C136.21 117.848 135.539 113.513 135.539 108.824L135.539 103.565C135.539 102.047 135.617 100.528 135.773 99.01C137.785 99.8519 139.715 100.771 141.537 101.767V88.9883ZM113.539 113.788C110.428 130.635 98.7107 137.918 87.722 138.835C77.4185 139.694 69.8824 134.188 68.3245 125.753C66.5255 116.035 73.1933 105.741 87.8922 100.565C96.222 97.6235 104.976 96.953 113.539 97.5177V113.788Z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/javigroups"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook @javigroups"
              className="w-9 h-9 rounded-full border border-line bg-ink/70 flex items-center justify-center text-stone hover:text-blue-400 hover:border-blue-400 hover:scale-105 transition-all"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
