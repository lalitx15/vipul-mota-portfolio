import type { Metadata } from "next";
import { getAdminDashboardData } from "@/lib/supabase/admin-dashboard";
import {
  AdminMetricsGrid,
  AdminAnalyticsChart,
  AdminRecentActivity,
} from "@/components/admin";

export const metadata: Metadata = {
  title: "Owner Terminal & Pulse — Vipul Mota",
  description:
    "Executive administration terminal for Vipul Mota and Javi Groups operations.",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* 01. Executive Welcome Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-6 gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="editorial-label text-gold">Executive Console</span>
            <span className="text-stone">/</span>
            <span className="editorial-label text-stone">{currentDate}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-light text-ivory tracking-tight">
            Vipul Mota &middot; Pulse
          </h1>

          <p className="text-stone text-xs sm:text-sm font-light max-w-2xl leading-relaxed">
            Direct operational oversight of cinema credits, lookbook plate curation, journal thought leadership, and incoming high-value partnership inquiries.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="p-3 border border-line bg-charcoal text-right">
            <span className="editorial-label text-stone text-[9px] block">
              Digital Audience
            </span>
            <span className="font-serif text-lg text-gold font-light">
              {data.stats.instagramFollowers}
            </span>
          </div>
          <div className="p-3 border border-line bg-charcoal text-right">
            <span className="editorial-label text-stone text-[9px] block">
              Broadcast Subscribers
            </span>
            <span className="font-serif text-lg text-ivory font-light">
              {data.stats.youtubeSubscribers}
            </span>
          </div>
        </div>
      </div>

      {/* 02. High-Level Telemetry Metrics Grid */}
      <AdminMetricsGrid stats={data.stats} />

      {/* 03. Weekly Recharts Audience & Inquiries Velocity Curve */}
      <AdminAnalyticsChart data={data.chartData} />

      {/* 04. Recent Inquiries & Member Registrations Widgets */}
      <AdminRecentActivity
        recentEnquiries={data.recentEnquiries}
        recentMembers={data.recentMembers}
      />
    </div>
  );
}
