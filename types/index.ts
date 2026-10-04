export type UserRole = "member" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: "active" | "suspended";
  newsletter_opt_in: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  whatsapp_url: string | null;
  instagram_url: string;
  youtube_url: string;
  facebook_url: string;
  threads_url: string;
  x_url: string | null;
  linkedin_url: string | null;
  instagram_followers_count: string;
  youtube_subscribers_count: string;
  announcement_bar: string | null;
  maintenance_mode: boolean;
  footer_text: string;
  finance_disclaimer: string;
  updated_at: string;
}
