export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: "member" | "admin";
          status: "active" | "suspended";
          newsletter_opt_in: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "member" | "admin";
          status?: "active" | "suspended";
          newsletter_opt_in?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "member" | "admin";
          status?: "active" | "suspended";
          newsletter_opt_in?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: number;
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
        };
        Insert: {
          id?: number;
          site_name?: string;
          tagline?: string;
          contact_email?: string;
          contact_phone?: string;
          address?: string;
          whatsapp_url?: string | null;
          instagram_url?: string;
          youtube_url?: string;
          facebook_url?: string;
          threads_url?: string;
          x_url?: string | null;
          linkedin_url?: string | null;
          instagram_followers_count?: string;
          youtube_subscribers_count?: string;
          announcement_bar?: string | null;
          maintenance_mode?: boolean;
          footer_text?: string;
          finance_disclaimer?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          site_name?: string;
          tagline?: string;
          contact_email?: string;
          contact_phone?: string;
          address?: string;
          whatsapp_url?: string | null;
          instagram_url?: string;
          youtube_url?: string;
          facebook_url?: string;
          threads_url?: string;
          x_url?: string | null;
          linkedin_url?: string | null;
          instagram_followers_count?: string;
          youtube_subscribers_count?: string;
          announcement_bar?: string | null;
          maintenance_mode?: boolean;
          footer_text?: string;
          finance_disclaimer?: string;
          updated_at?: string;
        };
      };
      seo_settings: {
        Row: {
          id: number;
          default_title: string;
          title_template: string;
          default_description: string;
          og_image_url: string | null;
          google_analytics_id: string | null;
          search_console_tag: string | null;
          meta_pixel_id: string | null;
          robots_txt: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          default_title?: string;
          title_template?: string;
          default_description?: string;
          og_image_url?: string | null;
          google_analytics_id?: string | null;
          search_console_tag?: string | null;
          meta_pixel_id?: string | null;
          robots_txt?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          default_title?: string;
          title_template?: string;
          default_description?: string;
          og_image_url?: string | null;
          google_analytics_id?: string | null;
          search_console_tag?: string | null;
          meta_pixel_id?: string | null;
          robots_txt?: string;
          updated_at?: string;
        };
      };
      page_seo: {
        Row: {
          id: string;
          page_path: string;
          title: string | null;
          description: string | null;
          og_image_url: string | null;
          canonical_url: string | null;
          no_index: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_path: string;
          title?: string | null;
          description?: string | null;
          og_image_url?: string | null;
          canonical_url?: string | null;
          no_index?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          page_path?: string;
          title?: string | null;
          description?: string | null;
          og_image_url?: string | null;
          canonical_url?: string | null;
          no_index?: boolean;
          updated_at?: string;
        };
      };
      home_sections: {
        Row: {
          id: string;
          key: string;
          title: string;
          content: Json;
          sort_order: number;
          is_visible: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          title: string;
          content?: Json;
          sort_order?: number;
          is_visible?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          title?: string;
          content?: Json;
          sort_order?: number;
          is_visible?: boolean;
          updated_at?: string;
        };
      };
      hero_slides: {
        Row: {
          id: string;
          headline_line1: string;
          headline_line2: string;
          tagline: string | null;
          image_url: string;
          mobile_image_url: string | null;
          cta_text: string | null;
          cta_link: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          headline_line1: string;
          headline_line2: string;
          tagline?: string | null;
          image_url: string;
          mobile_image_url?: string | null;
          cta_text?: string | null;
          cta_link?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          headline_line1?: string;
          headline_line2?: string;
          tagline?: string | null;
          image_url?: string;
          mobile_image_url?: string | null;
          cta_text?: string | null;
          cta_link?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      stats: {
        Row: {
          id: string;
          label: string;
          value: string;
          suffix: string | null;
          description: string | null;
          sort_order: number;
          is_visible: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          label: string;
          value: string;
          suffix?: string | null;
          description?: string | null;
          sort_order?: number;
          is_visible?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          value?: string;
          suffix?: string | null;
          description?: string | null;
          sort_order?: number;
          is_visible?: boolean;
          updated_at?: string;
        };
      };
      timeline_items: {
        Row: {
          id: string;
          year: string;
          title: string;
          description: string;
          image_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          year: string;
          title: string;
          description: string;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          year?: string;
          title?: string;
          description?: string;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      work_items: {
        Row: {
          id: string;
          type: "acting" | "modeling" | "venture";
          slug: string;
          title: string;
          role: string | null;
          year: string | null;
          platform: string | null;
          description: string;
          cover_url: string;
          external_url: string | null;
          is_featured: boolean;
          status: "draft" | "published";
          sort_order: number;
          meta: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: "acting" | "modeling" | "venture";
          slug: string;
          title: string;
          role?: string | null;
          year?: string | null;
          platform?: string | null;
          description: string;
          cover_url: string;
          external_url?: string | null;
          is_featured?: boolean;
          status?: "draft" | "published";
          sort_order?: number;
          meta?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: "acting" | "modeling" | "venture";
          slug?: string;
          title?: string;
          role?: string | null;
          year?: string | null;
          platform?: string | null;
          description?: string;
          cover_url?: string;
          external_url?: string | null;
          is_featured?: boolean;
          status?: "draft" | "published";
          sort_order?: number;
          meta?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      work_images: {
        Row: {
          id: string;
          work_id: string;
          image_url: string;
          caption: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          work_id: string;
          image_url: string;
          caption?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          work_id?: string;
          image_url?: string;
          caption?: string | null;
          sort_order?: number;
        };
      };
      gallery_items: {
        Row: {
          id: string;
          image_url: string;
          category: "Portraits" | "Editorial" | "Lifestyle" | "Events" | "Behind the scenes";
          caption: string | null;
          alt_text: string | null;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          category?: "Portraits" | "Editorial" | "Lifestyle" | "Events" | "Behind the scenes";
          caption?: string | null;
          alt_text?: string | null;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          category?: "Portraits" | "Editorial" | "Lifestyle" | "Events" | "Behind the scenes";
          caption?: string | null;
          alt_text?: string | null;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          title: string;
          platform: "youtube" | "instagram";
          video_id: string;
          url: string;
          thumbnail_url: string | null;
          category: string;
          is_featured: boolean;
          members_only: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          platform?: "youtube" | "instagram";
          video_id: string;
          url: string;
          thumbnail_url?: string | null;
          category?: string;
          is_featured?: boolean;
          members_only?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          platform?: "youtube" | "instagram";
          video_id?: string;
          url?: string;
          thumbnail_url?: string | null;
          category?: string;
          is_featured?: boolean;
          members_only?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          cover_url: string;
          tags: string[];
          members_only: boolean;
          status: "draft" | "published";
          published_at: string | null;
          reading_minutes: number;
          views: number;
          meta: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          cover_url: string;
          tags?: string[];
          members_only?: boolean;
          status?: "draft" | "published";
          published_at?: string | null;
          reading_minutes?: number;
          views?: number;
          meta?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          cover_url?: string;
          tags?: string[];
          members_only?: boolean;
          status?: "draft" | "published";
          published_at?: string | null;
          reading_minutes?: number;
          views?: number;
          meta?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      post_likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          body: string;
          status: "pending" | "approved" | "rejected";
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          body: string;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          body?: string;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
      };
      saved_items: {
        Row: {
          id: string;
          user_id: string;
          item_type: "gallery" | "video" | "post";
          item_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_type: "gallery" | "video" | "post";
          item_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_type?: "gallery" | "video" | "post";
          item_id?: string;
          created_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string;
          body: string;
          avatar_url: string | null;
          is_published: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          body: string;
          avatar_url?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          body?: string;
          avatar_url?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      press_items: {
        Row: {
          id: string;
          outlet: string;
          title: string;
          url: string;
          date: string;
          logo_url: string | null;
          is_published: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          outlet: string;
          title: string;
          url: string;
          date: string;
          logo_url?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          outlet?: string;
          title?: string;
          url?: string;
          date?: string;
          logo_url?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      enquiries: {
        Row: {
          id: string;
          type: "general" | "brand" | "booking";
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          budget: string | null;
          message: string;
          contact_method: "email" | "phone" | "whatsapp";
          status: "new" | "in_review" | "replied" | "closed";
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type?: "general" | "brand" | "booking";
          name: string;
          email: string;
          phone?: string | null;
          subject: string;
          budget?: string | null;
          message: string;
          contact_method?: "email" | "phone" | "whatsapp";
          status?: "new" | "in_review" | "replied" | "closed";
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: "general" | "brand" | "booking";
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string;
          budget?: string | null;
          message?: string;
          contact_method?: "email" | "phone" | "whatsapp";
          status?: "new" | "in_review" | "replied" | "closed";
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      enquiry_notes: {
        Row: {
          id: string;
          enquiry_id: string;
          note: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          enquiry_id: string;
          note: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          enquiry_id?: string;
          note?: string;
          created_by?: string;
          created_at?: string;
        };
      };
      subscribers: {
        Row: {
          id: string;
          email: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          content: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          content?: string;
          updated_at?: string;
        };
      };
      media: {
        Row: {
          id: string;
          url: string;
          storage_path: string;
          filename: string;
          size: number;
          mime_type: string;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          storage_path: string;
          filename: string;
          size?: number;
          mime_type: string;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          storage_path?: string;
          filename?: string;
          size?: number;
          mime_type?: string;
          uploaded_by?: string | null;
          created_at?: string;
        };
      };
      page_views: {
        Row: {
          id: string;
          path: string;
          referrer: string | null;
          device: string | null;
          country: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          path: string;
          referrer?: string | null;
          device?: string | null;
          country?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          path?: string;
          referrer?: string | null;
          device?: string | null;
          country?: string | null;
          created_at?: string;
        };
      };
      admin_activity: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          entity: string;
          entity_id: string | null;
          meta: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          action: string;
          entity: string;
          entity_id?: string | null;
          meta?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string;
          action?: string;
          entity?: string;
          entity_id?: string | null;
          meta?: Json;
          created_at?: string;
        };
      };
    };
    Views: {
      posts_public_view: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string | null;
          cover_url: string;
          tags: string[];
          members_only: boolean;
          status: "draft" | "published";
          published_at: string | null;
          reading_minutes: number;
          views: number;
          meta: Json;
          created_at: string;
          updated_at: string;
        };
      };
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      increment_post_views: {
        Args: { p_post_id: string };
        Returns: void;
      };
      get_analytics_views_by_day: {
        Args: { p_days?: number };
        Returns: { day: string; views: number }[];
      };
      get_analytics_top_pages: {
        Args: { p_limit?: number };
        Returns: { path: string; views: number }[];
      };
      get_analytics_top_referrers: {
        Args: { p_limit?: number };
        Returns: { referrer: string; count: number }[];
      };
      get_analytics_members_by_day: {
        Args: { p_days?: number };
        Returns: { day: string; new_members: number }[];
      };
      get_analytics_enquiries_by_day: {
        Args: { p_days?: number };
        Returns: { day: string; count: number }[];
      };
    };
  };
}
