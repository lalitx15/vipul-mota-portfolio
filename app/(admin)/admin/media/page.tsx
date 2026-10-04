import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { MediaLibraryManager, type MediaItem } from "@/components/admin/MediaLibraryManager";

export const metadata: Metadata = {
  title: "Media Library — Vipul Mota Admin",
};

export const dynamic = "force-dynamic";

const defaultMediaList: MediaItem[] = [
  {
    id: "med-1",
    url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    storage_path: "gallery/vipul-mota-marine-drive-lookbook-01.jpg",
    filename: "vipul-mota-marine-drive-lookbook-01.jpg",
    size: 420000,
    mime_type: "image/jpeg",
    created_at: new Date().toISOString(),
  },
  {
    id: "med-2",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    storage_path: "gallery/vipul-mota-south-bombay-architectural.jpg",
    filename: "vipul-mota-south-bombay-architectural.jpg",
    size: 512000,
    mime_type: "image/jpeg",
    created_at: new Date().toISOString(),
  },
  {
    id: "med-3",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    storage_path: "gallery/vipul-mota-monochrome-study.jpg",
    filename: "vipul-mota-monochrome-study.jpg",
    size: 380000,
    mime_type: "image/jpeg",
    created_at: new Date().toISOString(),
  },
  {
    id: "med-4",
    url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop",
    storage_path: "journal/crime-world-screen-still.jpg",
    filename: "crime-world-screen-still.jpg",
    size: 610000,
    mime_type: "image/jpeg",
    created_at: new Date().toISOString(),
  },
  {
    id: "med-5",
    url: "https://example.com/press-kit/vipul-govindji-mota-media-bio-2026.pdf",
    storage_path: "press-kit/vipul-govindji-mota-media-bio-2026.pdf",
    filename: "vipul-govindji-mota-media-bio-2026.pdf",
    size: 1480000,
    mime_type: "application/pdf",
    created_at: new Date().toISOString(),
  },
];

export default async function AdminMediaPage() {
  const supabase = createServerClient();

  const { data } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  const mediaList: MediaItem[] =
    data && data.length > 0 ? (data as unknown as MediaItem[]) : defaultMediaList;

  return <MediaLibraryManager initialMedia={mediaList} />;
}
