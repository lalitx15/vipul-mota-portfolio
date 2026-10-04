import React from "react";
import Link from "next/link";
import { Inbox, Users, BookOpen, Camera, ArrowUpRight, TrendingUp } from "lucide-react";
import type { AdminDashboardData } from "@/lib/supabase/admin-dashboard";

interface AdminMetricsGridProps {
  stats: AdminDashboardData["stats"];
}

export function AdminMetricsGrid({ stats }: AdminMetricsGridProps) {
  const cards = [
    {
      title: "Inquiries Pipeline",
      value: stats.totalEnquiries,
      subtext: `${stats.newEnquiries} pending review`,
      href: "/admin/enquiries",
      icon: Inbox,
      highlight: stats.newEnquiries > 0,
      badge: stats.newEnquiries > 0 ? "Action Required" : "All Processed",
    },
    {
      title: "Registered Members",
      value: stats.totalMembers,
      subtext: "Inner Circle accounts",
      href: "/admin/members",
      icon: Users,
      badge: "Verified Profiles",
    },
    {
      title: "Journal Dispatches",
      value: stats.totalPosts,
      subtext: "Published essays & perspectives",
      href: "/admin/journal",
      icon: BookOpen,
      badge: "Editorial Archive",
    },
    {
      title: "Lookbook & Media",
      value: `${stats.totalGalleryPlates} Plates`,
      subtext: `${stats.totalVideos} broadcast videos`,
      href: "/admin/gallery",
      icon: Camera,
      badge: "Visual Assets",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Link
            key={card.title}
            href={card.href}
            className={`group bg-charcoal border p-6 flex flex-col justify-between space-y-4 transition-all duration-300 hover:border-gold/60 ${
              card.highlight
                ? "border-gold/60 ring-1 ring-gold/20"
                : "border-line"
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="editorial-label text-stone text-[10px]">
                {card.title}
              </span>
              <div
                className={`p-2 border transition-colors ${
                  card.highlight
                    ? "border-gold text-gold bg-gold/10"
                    : "border-line text-stone group-hover:text-gold group-hover:border-gold/40"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl text-ivory font-light group-hover:text-gold transition-colors">
                {card.value}
              </div>
              <p className="text-stone text-xs font-light">{card.subtext}</p>
            </div>

            <div className="pt-3 border-t border-line/40 flex items-center justify-between text-[10px] font-mono text-stone">
              <span className="uppercase">{card.badge}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-ivory group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
