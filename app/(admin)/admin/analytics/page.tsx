import type { Metadata } from "next";
import { AnalyticsManager } from "@/components/admin/AnalyticsManager";

export const metadata: Metadata = {
  title: "Audience Analytics & Telemetry — Vipul Mota Admin",
};

export const dynamic = "force-dynamic";

export default function AdminAnalyticsPage() {
  return <AnalyticsManager />;
}
