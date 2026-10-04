import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import {
  EnquiryManager,
  type EnquiryItem,
  type EnquiryNoteItem,
} from "@/components/admin/EnquiryManager";

export const metadata: Metadata = {
  title: "Inquiries Inbox & CRM — Vipul Mota Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const supabase = createServerClient();

  // 1. Fetch all enquiries
  const { data: enquiriesData } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  // 2. Fetch all internal enquiry notes
  const { data: notesData } = await supabase
    .from("enquiry_notes")
    .select("*")
    .order("created_at", { ascending: false });

  const initialEnquiries: EnquiryItem[] = (enquiriesData as unknown as EnquiryItem[]) || [];
  const initialNotes: EnquiryNoteItem[] = (notesData as unknown as EnquiryNoteItem[]) || [];

  return (
    <EnquiryManager
      initialEnquiries={initialEnquiries}
      initialNotes={initialNotes}
    />
  );
}
