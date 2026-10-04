import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getAllPostSlugs,
} from "@/lib/supabase/journal";
import { PostDetailView } from "@/components/journal";

interface PostDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const data = await getPostBySlug(params.slug);

  if (!data || !data.post) {
    return {
      title: "Dispatch Not Found — Vipul Mota",
    };
  }

  const { post } = data;

  return {
    title: `${post.title} — Vipul Mota`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} — Vipul Mota`,
      description: post.excerpt,
      images: post.cover_url ? [{ url: post.cover_url }] : [],
      type: "article",
    },
  };
}

export const revalidate = 60;

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const data = await getPostBySlug(params.slug);

  if (!data || !data.post) {
    notFound();
  }

  return <PostDetailView data={data} />;
}
