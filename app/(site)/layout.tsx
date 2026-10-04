import React from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Preloader } from "@/components/site/Preloader";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-ink text-ivory">
      {/* Session-Aware Monogram Preloader */}
      <Preloader />

      {/* Smart Sticky Editorial Header */}
      <Header />

      {/* Main Public Content Area with top offset for fixed header */}
      <main className="flex-1 w-full pt-20 md:pt-24">{children}</main>

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}
