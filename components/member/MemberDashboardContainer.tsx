"use client";

import React, { useState } from "react";
import { MemberHeader, type MemberTab } from "./MemberHeader";
import { MemberProfileTab } from "./MemberProfileTab";
import { MemberSavedTab } from "./MemberSavedTab";
import { MemberEnquiriesTab } from "./MemberEnquiriesTab";
import { MemberVaultTab } from "./MemberVaultTab";
import type { MemberDashboardData } from "@/lib/supabase/member";

interface MemberDashboardContainerProps {
  data: MemberDashboardData;
}

export function MemberDashboardContainer({
  data,
}: MemberDashboardContainerProps) {
  const [activeTab, setActiveTab] = useState<MemberTab>("overview");

  return (
    <div className="space-y-12">
      {/* Editorial Member Header & Tab Selector */}
      <MemberHeader
        profile={data.profile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={data.savedItems.length}
        enquiriesCount={data.enquiries.length}
        exclusiveCount={data.exclusivePosts.length + data.exclusiveVideos.length}
      />

      {/* Active Tab Viewport */}
      <div>
        {activeTab === "overview" && (
          <MemberProfileTab profile={data.profile} />
        )}

        {activeTab === "saved" && (
          <MemberSavedTab initialItems={data.savedItems} />
        )}

        {activeTab === "enquiries" && (
          <MemberEnquiriesTab enquiries={data.enquiries} />
        )}

        {activeTab === "vault" && (
          <MemberVaultTab
            exclusivePosts={data.exclusivePosts}
            exclusiveVideos={data.exclusiveVideos}
          />
        )}
      </div>
    </div>
  );
}
