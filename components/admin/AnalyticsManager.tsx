"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Compass,
  Download,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface TrafficPoint {
  date: string;
  views: number;
  visitors: number;
  inquiries: number;
}

const TRAFFIC_DATA_7D: TrafficPoint[] = [
  { date: "Mon", views: 1240, visitors: 820, inquiries: 2 },
  { date: "Tue", views: 1680, visitors: 1100, inquiries: 5 },
  { date: "Wed", views: 1420, visitors: 940, inquiries: 3 },
  { date: "Thu", views: 2190, visitors: 1450, inquiries: 7 },
  { date: "Fri", views: 1980, visitors: 1310, inquiries: 4 },
  { date: "Sat", views: 2840, visitors: 1920, inquiries: 8 },
  { date: "Sun", views: 2470, visitors: 1650, inquiries: 6 },
];

const TRAFFIC_DATA_30D: TrafficPoint[] = [
  { date: "W1", views: 8400, visitors: 5600, inquiries: 18 },
  { date: "W2", views: 11200, visitors: 7800, inquiries: 24 },
  { date: "W3", views: 13900, visitors: 9400, inquiries: 31 },
  { date: "W4", views: 16800, visitors: 11200, inquiries: 42 },
];

const TRAFFIC_DATA_90D: TrafficPoint[] = [
  { date: "Aug", views: 38000, visitors: 26000, inquiries: 92 },
  { date: "Sep", views: 46500, visitors: 32000, inquiries: 118 },
  { date: "Oct", views: 54200, visitors: 38400, inquiries: 145 },
];

const TOP_PAGES = [
  { path: "/", title: "Homepage & Cinematic Hero", views: "14,820", share: 42 },
  { path: "/work/crime-world", title: "Crime World (2022) — Neighbour", views: "7,410", share: 21 },
  { path: "/gallery", title: "Lookbook & Editorial Plates", views: "6,350", share: 18 },
  { path: "/about", title: "Editorial Bio & Journey", views: "4,230", share: 12 },
  { path: "/journal/the-architecture-of-personal-presence", title: "Journal: Personal Presence", views: "2,460", share: 7 },
];

const REFERRERS = [
  { name: "Direct & Organic Type-in", count: "16,420", share: 48, icon: Globe },
  { name: "Instagram (@javigroups)", count: "10,610", share: 31, icon: ArrowUpRight },
  { name: "YouTube (@VibewithVipulMota)", count: "4,790", share: 14, icon: ArrowUpRight },
  { name: "Google Organic Search", count: "2,390", share: 7, icon: Globe },
];

export function AnalyticsManager() {
  const { success } = useToast();
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("7d");

  const currentData =
    timeframe === "7d"
      ? TRAFFIC_DATA_7D
      : timeframe === "30d"
      ? TRAFFIC_DATA_30D
      : TRAFFIC_DATA_90D;

  const handleExportReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Date,PageViews,Visitors,Inquiries\n" +
      currentData.map((d) => `${d.date},${d.views},${d.visitors},${d.inquiries}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics-telemetry-${timeframe}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success("Analytics telemetry exported.");
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-mono block mb-2">
            First-Party Audience Velocity &amp; Reach
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-ivory tracking-tight">
            Audience Analytics
          </h1>
          <p className="text-stone text-sm mt-1 max-w-xl">
            Privacy-preserving telemetry, content impressions, inbound engagement velocity, and cross-channel acquisition trends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Filter */}
          <div className="flex items-center bg-charcoal border border-line p-1">
            <button
              onClick={() => setTimeframe("7d")}
              className={`px-3 py-1 text-xs font-mono transition-colors ${
                timeframe === "7d" ? "bg-gold text-ink font-bold" : "text-stone hover:text-ivory"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeframe("30d")}
              className={`px-3 py-1 text-xs font-mono transition-colors ${
                timeframe === "30d" ? "bg-gold text-ink font-bold" : "text-stone hover:text-ivory"
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeframe("90d")}
              className={`px-3 py-1 text-xs font-mono transition-colors ${
                timeframe === "90d" ? "bg-gold text-ink font-bold" : "text-stone hover:text-ivory"
              }`}
            >
              90 Days
            </button>
          </div>

          <Button
            onClick={handleExportReport}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-line text-ivory text-xs"
          >
            <Download className="w-3.5 h-3.5 text-gold" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Telemetry Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-charcoal border border-line">
          <div className="flex items-center justify-between text-stone">
            <span className="text-[10px] uppercase font-mono tracking-wider">Total Impressions</span>
            <Eye className="w-4 h-4 text-gold" />
          </div>
          <div className="font-display text-2xl md:text-3xl text-ivory mt-2">
            {timeframe === "7d" ? "13,820" : timeframe === "30d" ? "50,300" : "138,700"}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% vs prev period
          </div>
        </div>

        <div className="p-5 bg-charcoal border border-line">
          <div className="flex items-center justify-between text-stone">
            <span className="text-[10px] uppercase font-mono tracking-wider">Unique Reach</span>
            <Users className="w-4 h-4 text-gold" />
          </div>
          <div className="font-display text-2xl md:text-3xl text-ivory mt-2">
            {timeframe === "7d" ? "9,190" : timeframe === "30d" ? "34,000" : "96,400"}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.6% new audience
          </div>
        </div>

        <div className="p-5 bg-charcoal border border-line">
          <div className="flex items-center justify-between text-stone">
            <span className="text-[10px] uppercase font-mono tracking-wider">Avg Session Depth</span>
            <Clock className="w-4 h-4 text-gold" />
          </div>
          <div className="font-display text-2xl md:text-3xl text-ivory mt-2">3m 42s</div>
          <div className="text-[11px] text-stone font-mono mt-1">High editorial dwell</div>
        </div>

        <div className="p-5 bg-charcoal border border-line">
          <div className="flex items-center justify-between text-stone">
            <span className="text-[10px] uppercase font-mono tracking-wider">Direct Inquiries</span>
            <Compass className="w-4 h-4 text-gold" />
          </div>
          <div className="font-display text-2xl md:text-3xl text-gold mt-2">
            {timeframe === "7d" ? "34" : timeframe === "30d" ? "115" : "355"}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">4.2% conversion rate</div>
        </div>
      </div>

      {/* Main Graph: Daily Impressions and Visitors Curve */}
      <div className="p-6 sm:p-8 bg-charcoal border border-line space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-gold">
              Audience Velocity Trajectory
            </span>
            <h2 className="font-display text-2xl text-ivory mt-0.5">
              Traffic Volume vs. Unique Visitors
            </h2>
          </div>

          <div className="flex items-center space-x-6 text-xs text-stone font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-gold inline-block" />
              <span>Page Impressions</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-ivory/60 inline-block" />
              <span>Unique Visitors</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B8965F" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#B8965F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F2EDE4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F2EDE4" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="date" stroke="#8A857C" fontSize={11} tickLine={false} />
              <YAxis stroke="#8A857C" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0C0C0D",
                  border: "1px solid rgba(242,237,228,0.15)",
                  color: "#F2EDE4",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                name="Impressions"
                stroke="#B8965F"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#goldGradient)"
              />
              <Area
                type="monotone"
                dataKey="visitors"
                name="Visitors"
                stroke="#F2EDE4"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#visitorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Top Pages & Acquisition Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <div className="p-6 bg-charcoal border border-line space-y-5">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h3 className="font-serif text-lg text-ivory">Most Visited Portfolios &amp; Articles</h3>
            <span className="text-[10px] font-mono uppercase text-stone">Share of Traffic</span>
          </div>

          <div className="space-y-4">
            {TOP_PAGES.map((page, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ivory font-mono font-medium">{page.path}</span>
                  <span className="text-stone font-mono">{page.views} views ({page.share}%)</span>
                </div>
                <div className="h-1.5 w-full bg-ink overflow-hidden border border-line/40">
                  <div
                    className="h-full bg-gold transition-all duration-500"
                    style={{ width: `${page.share}%` }}
                  />
                </div>
                <div className="text-[11px] text-stone truncate">{page.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Acquisition & Referrers */}
        <div className="p-6 bg-charcoal border border-line space-y-5">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h3 className="font-serif text-lg text-ivory">Acquisition Channels &amp; Referrers</h3>
            <span className="text-[10px] font-mono uppercase text-stone">Audience Source</span>
          </div>

          <div className="space-y-4">
            {REFERRERS.map((ref, idx) => {
              const Icon = ref.icon;
              return (
                <div
                  key={idx}
                  className="p-3 bg-ink/60 border border-line flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-charcoal border border-line text-gold">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-ivory font-medium">{ref.name}</div>
                      <div className="text-[10px] font-mono text-stone">{ref.count} referrals</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-gold font-bold">{ref.share}%</span>
                </div>
              );
            })}
          </div>

          {/* Device Breakdown */}
          <div className="pt-3 border-t border-line/60">
            <div className="text-[10px] uppercase font-mono tracking-wider text-stone mb-3">
              Device Distribution
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-ink border border-line">
                <Monitor className="w-4 h-4 text-stone mx-auto mb-1" />
                <div className="text-xs text-ivory font-bold font-mono">62%</div>
                <div className="text-[10px] text-stone">Desktop</div>
              </div>
              <div className="p-2.5 bg-ink border border-line">
                <Smartphone className="w-4 h-4 text-stone mx-auto mb-1" />
                <div className="text-xs text-ivory font-bold font-mono">34%</div>
                <div className="text-[10px] text-stone">Mobile</div>
              </div>
              <div className="p-2.5 bg-ink border border-line">
                <Tablet className="w-4 h-4 text-stone mx-auto mb-1" />
                <div className="text-xs text-ivory font-bold font-mono">4%</div>
                <div className="text-[10px] text-stone">Tablet</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
