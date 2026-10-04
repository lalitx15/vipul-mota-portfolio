"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface AdminAnalyticsChartProps {
  data: { date: string; inquiries: number; visitors: number }[];
}

export function AdminAnalyticsChart({ data }: AdminAnalyticsChartProps) {
  return (
    <div className="bg-charcoal border border-line p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="editorial-label text-gold text-[10px]">
            Velocity &amp; Telemetry
          </span>
          <h2 className="font-serif text-2xl text-ivory font-light mt-1">
            Weekly Engagement &amp; Inquiry Volume
          </h2>
        </div>

        <div className="flex items-center space-x-6 text-xs text-stone font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-gold inline-block" />
            <span>Inquiries</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-line inline-block" />
            <span>Unique Visitors</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="h-64 sm:h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
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

            <XAxis
              dataKey="date"
              stroke="#8A857C"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "rgba(242,237,228,0.12)" }}
            />
            <YAxis
              stroke="#8A857C"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "rgba(242,237,228,0.12)" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0C0C0D",
                borderColor: "rgba(242,237,228,0.12)",
                borderRadius: "0px",
                fontSize: "12px",
                color: "#F2EDE4",
              }}
              labelStyle={{ color: "#B8965F", fontWeight: "bold" }}
            />

            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#8A857C"
              strokeWidth={1}
              fillOpacity={1}
              fill="url(#visitorGradient)"
            />
            <Area
              type="monotone"
              dataKey="inquiries"
              stroke="#B8965F"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#goldGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
