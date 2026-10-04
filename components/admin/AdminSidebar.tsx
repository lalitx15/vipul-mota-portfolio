"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  UserCheck,
  Briefcase,
  Camera,
  Film,
  BookOpen,
  Inbox,
  Users,
  Quote,
  Settings,
  Image as ImageIcon,
  BarChart3,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { logoutAction } from "@/lib/supabase/actions";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Core Pulse",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Content Managers",
    items: [
      { label: "Hero & Slides", href: "/admin/hero", icon: Sparkles },
      { label: "About & Journey", href: "/admin/about", icon: UserCheck },
      { label: "Work & Credits", href: "/admin/work", icon: Briefcase },
      { label: "Lookbook Gallery", href: "/admin/gallery", icon: Camera },
      { label: "Video Repertoire", href: "/admin/videos", icon: Film },
      { label: "Journal Dispatches", href: "/admin/journal", icon: BookOpen },
    ],
  },
  {
    title: "Communications & CRM",
    items: [
      { label: "Inquiries Inbox", href: "/admin/enquiries", icon: Inbox },
      { label: "Member Roster", href: "/admin/members", icon: Users },
      { label: "Testimonials & Press", href: "/admin/testimonials", icon: Quote },
      { label: "Social Footprint", href: "/admin/social", icon: Share2 },
    ],
  },
  {
    title: "System & Strategy",
    items: [
      { label: "Site Settings & SEO", href: "/admin/settings", icon: Settings },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      { label: "Audience Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <>
      {/* Mobile Menu Trigger Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          aria-label="Toggle Navigation Sidebar"
          className="p-2.5 bg-ink text-ivory border border-line shadow-xl flex items-center justify-center"
        >
          {isOpenMobile ? <X className="w-5 h-5 text-gold" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="lg:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Main Frame */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-ink border-r border-line flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Branding Bar */}
        <div className="p-6 border-b border-line flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold/50 shadow-md bg-black shrink-0">
              <Image
                src="/logo.png"
                alt="Vipul Mota Logo"
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-serif text-base text-ivory tracking-wide block font-light">
                Vipul Mota
              </span>
              <span className="editorial-label text-gold text-[9px] tracking-[0.2em] block">
                Owner Terminal &middot; 2026
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-thin scrollbar-thumb-line">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-2">
              <span className="editorial-label text-stone/70 text-[9px] px-3 tracking-[0.22em] block">
                {section.title}
              </span>

              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpenMobile(false)}
                      className={`group relative flex items-center justify-between px-3 py-2.5 text-xs transition-colors rounded-none ${
                        isActive
                          ? "bg-charcoal text-ivory font-medium border-l-2 border-gold"
                          : "text-stone hover:text-ivory hover:bg-charcoal/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? "text-gold"
                              : "text-stone group-hover:text-gold"
                          }`}
                        />
                        <span className="tracking-wide">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="font-mono text-[10px] px-2 py-0.5 bg-gold/10 text-gold border border-gold/30">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Session Footer */}
        <div className="p-4 border-t border-line bg-charcoal/40 space-y-3">
          <div className="flex items-center justify-between px-2 text-[11px] text-stone">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>Owner Superadmin</span>
            </div>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold flex items-center space-x-1 transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 border border-line hover:border-red-500/40 text-stone hover:text-red-400 text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Terminal</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
