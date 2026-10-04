import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getWorkItemBySlug,
  getAllWorkSlugs,
  getWorkItems,
} from "@/lib/supabase/work";
import { WorkDetailView } from "@/components/work";

interface WorkDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = await getAllWorkSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const item = await getWorkItemBySlug(params.slug);

  if (!item) {
    return {
      title: "Work Not Found — Vipul Mota",
    };
  }

  return {
    title: `${item.title} — Vipul Mota`,
    description: item.description,
    openGraph: {
      title: `${item.title} — Vipul Mota`,
      description: item.description,
      images: item.cover_url ? [{ url: item.cover_url }] : [],
    },
  };
}

export const revalidate = 60;

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const item = await getWorkItemBySlug(params.slug);

  if (!item) {
    notFound();
  }

  const allItems = await getWorkItems();
  const relatedItems = allItems.filter((w) => w.slug !== params.slug).slice(0, 2);

  return <WorkDetailView item={item} relatedItems={relatedItems} />;
}
