-- ========================================================
-- VIPUL MOTA / JAVI GROUPS PORTFOLIO
-- supabase/seed.sql — Baseline Seed Data
-- ========================================================

-- 1. Site Settings
insert into public.site_settings (
  id,
  site_name,
  tagline,
  contact_email,
  contact_phone,
  address,
  whatsapp_url,
  instagram_url,
  youtube_url,
  facebook_url,
  threads_url,
  x_url,
  linkedin_url,
  instagram_followers_count,
  youtube_subscribers_count,
  announcement_bar,
  maintenance_mode,
  footer_text,
  finance_disclaimer
) values (
  1,
  'Vipul Mota',
  'Style. Wealth. Presence.',
  'vipul@javigroups.com',
  '+91 98200 00000',
  'Marine Drive, Mumbai, Maharashtra, India',
  'https://wa.me/919820000000',
  'https://instagram.com/javigroups',
  'https://youtube.com/@VibewithVipulMota',
  'https://facebook.com/javigroups',
  'https://threads.net/@javigroups',
  null,
  null,
  '900K+',
  '100K+',
  'Founder of Javi Groups · Actor · Fashion Model · Mumbai',
  false,
  '© 2026 Vipul Mota. All rights reserved. Javi Groups Mumbai.',
  'Content is for inspiration and information only and is not financial advice.'
) on conflict (id) do update set
  site_name = excluded.site_name,
  tagline = excluded.tagline,
  contact_email = excluded.contact_email,
  instagram_followers_count = excluded.instagram_followers_count,
  finance_disclaimer = excluded.finance_disclaimer;

-- 2. SEO Settings
insert into public.seo_settings (
  id,
  default_title,
  title_template,
  default_description,
  og_image_url,
  robots_txt
) values (
  1,
  'Vipul Mota | Actor, Fashion Model & Founder of Javi Groups',
  '%s | Vipul Mota',
  'Official personal brand portfolio of Vipul Mota — Mumbai-based actor, fashion model, financier, and founder of Javi Groups. Style, wealth, and presence.',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
  'User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /member\nSitemap: https://javigroups.com/sitemap.xml'
) on conflict (id) do update set
  default_title = excluded.default_title,
  default_description = excluded.default_description;

-- 3. Page SEO Entries
insert into public.page_seo (page_path, title, description, og_image_url) values
  ('/', 'Vipul Mota | Actor, Fashion Model & Founder of Javi Groups', 'Official brand home of Vipul Mota: Mumbai luxury editorial, cinema credits, lookbook, and private ventures.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop'),
  ('/about', 'About & Journey | Vipul Mota', 'Editorial biography, Mumbai roots, philosophy of presence, and milestone timeline of Vipul Mota.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop'),
  ('/work', 'Selected Work & Ventures | Vipul Mota', 'Explore on-screen acting in Crime World (2022), signature fashion lookbooks, and Javi Groups business enterprises.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'),
  ('/gallery', 'Lookbook & Visual Archive | Vipul Mota', 'High-contrast editorial photography, portraits, lifestyle, and events from Mumbai.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop'),
  ('/videos', 'Screen Reels & Visual Media | Vipul Mota', 'Reels, on-screen crime drama features, and financial inspiration episodes from VibewithVipulMota.', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop'),
  ('/journal', 'The Journal | Vipul Mota', 'Reflections on style, Mumbai luxury, discipline, personal presence, and wealth curation.', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop'),
  ('/contact', 'Contact & Brand Collaborations | Vipul Mota', 'Inquire for brand associations, commercial acting bookings, fashion shoots, or high-value business development.', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop')
on conflict (page_path) do nothing;

-- 4. Hero Slides
insert into public.hero_slides (
  headline_line1,
  headline_line2,
  tagline,
  image_url,
  cta_text,
  cta_link,
  sort_order,
  is_active
) values (
  'Vipul Mota',
  'Mota',
  'Actor · Fashion Model · Founder of Javi Groups',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1800&auto=format&fit=crop',
  'Explore Portfolio',
  '/work',
  1,
  true
);

-- 5. Stats / Counters
insert into public.stats (label, value, suffix, description, sort_order, is_visible) values
  ('Instagram Audience', '900', 'K+', 'Engaged followers on @javigroups', 1, true),
  ('YouTube Mission', '100', 'K+', 'Subscribers on @VibewithVipulMota', 2, true),
  ('Years in Business', '18', '+', 'Private finance & business development', 3, true),
  ('Screen Credits', '1', ' Series', 'Crime World (2022) on ShemarooMe', 4, true);

-- 6. Timeline Milestones (6 editorial milestones)
insert into public.timeline_items (year, title, description, sort_order) values
  ('1975', 'Mumbai Heritage & Roots', 'Born on 29 August 1975 in Mumbai, India. Raised amid the dynamic commercial heartbeat and architectural grandeur of the city.', 1),
  ('2005', 'Financial Advisory & Commerce', 'Pioneering private wealth syndication, capital consulting, and business development across Western India.', 2),
  ('2015', 'Foundation of Javi Groups', 'Established Javi Groups in Mumbai as an umbrella vehicle for wealth stewardship, commercial ventures, and style leadership.', 3),
  ('2022', 'Screen Debut: "Crime World"', 'Appeared on-screen in the Hindi crime thriller series "Crime World" (Episode 2-12) in the role of Neighbour, streaming on ShemarooMe.', 4),
  ('2024', 'Digital Authority & Influence', 'Reached 900,000+ followers on Instagram (@javigroups) and launched the YouTube channel @VibewithVipulMota.', 5),
  ('2026', 'Editorial Presence & The Modern Archive', 'Unifying screen craft, bespoke fashion modeling, and high-value private network initiatives under one personal brand home.', 6);

-- 7. Work Items (Strictly verified facts: 1 Acting, 1 Venture, 1 Modeling Lookbook)
insert into public.work_items (
  type,
  slug,
  title,
  role,
  year,
  platform,
  description,
  cover_url,
  external_url,
  is_featured,
  status,
  sort_order,
  meta
) values
  (
    'acting',
    'crime-world-2022',
    'Crime World (Hindi Crime Drama)',
    'Neighbour',
    '2022',
    'ShemarooMe',
    'Hindi crime thriller episodic drama series. Vipul Mota portrays the pivotal character "Neighbour" in Episode 2-12. Streaming nationally on ShemarooMe.',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop',
    'https://www.shemaroome.com',
    true,
    'published',
    1,
    '{"episode": "Episode 2-12", "genre": "Crime / Drama / Mystery", "language": "Hindi"}'::jsonb
  ),
  (
    'venture',
    'javi-groups-mumbai',
    'Javi Groups',
    'Founder & Principal',
    '2015 - Present',
    'Mumbai, India',
    'Privately held business enterprise founded by Vipul Mota. Focuses on strategic wealth stewardship, corporate capital syndication, and luxury lifestyle business development.',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    'https://instagram.com/javigroups',
    true,
    'published',
    2,
    '{"focus": "Capital & Strategic Business Development", "reach": "900K+ Network", "city": "Mumbai"}'::jsonb
  ),
  (
    'modeling',
    'editorial-lookbook-vol-1',
    'Mumbai Sartorial Lookbook: Volume I',
    'Fashion Model',
    '2025',
    'Self-Produced Editorial',
    'A curated personal fashion lookbook exploring sharp Italian tailoring, hand-woven luxury textiles, and Marine Drive twilight aesthetics. Designed for ongoing campaign additions.',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    null,
    true,
    'published',
    3,
    '{"aesthetic": "Bespoke Suiting / Modern Luxury", "location": "Mumbai, India"}'::jsonb
  );

-- 8. Gallery Items (8 high quality editorial placeholders with clear replacement cues)
insert into public.gallery_items (image_url, category, caption, alt_text, is_featured, sort_order) values
  ('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop', 'Portraits', 'Plate 01 — Monochrome Tailoring Study, Mumbai', 'Vipul Mota portrait in charcoal tailored blazer', true, 1),
  ('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop', 'Portraits', 'Plate 02 — High-Contrast Cinematic Close-up', 'Cinematic portrait lighting', true, 2),
  ('https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000&auto=format&fit=crop', 'Editorial', 'Plate 03 — Marine Drive Horizon & Italian Linen', 'Fashion editorial silhouette by Mumbai sea front', true, 3),
  ('https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000&auto=format&fit=crop', 'Editorial', 'Plate 04 — Midnight Velvet & Structured Lapel', 'Evening wear editorial study', true, 4),
  ('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop', 'Lifestyle', 'Plate 05 — The Architecture of Private Capital', 'Commercial cityscape in South Mumbai', false, 5),
  ('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop', 'Lifestyle', 'Plate 06 — Daylight Study in Stone & Ivory', 'Relaxed luxury daytime look', false, 6),
  ('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop', 'Behind the scenes', 'Plate 07 — On Set: Focus, Light & Rigging', 'Film camera and monitor on set', false, 7),
  ('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop', 'Events', 'Plate 08 — High-Level Industry Gathering', 'Evening reception and networking presence', false, 8);

-- 9. Videos (Curated for YouTube channel mission)
insert into public.videos (title, platform, video_id, url, thumbnail_url, category, is_featured, members_only, sort_order) values
  (
    'Building Your Financial Portfolio Without Compromising Your Image',
    'youtube',
    'dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    'Wealth & Strategy',
    true,
    false,
    1
  ),
  (
    'The Discipline of Presence: Screen Craft & High-Value Networking',
    'youtube',
    'dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
    'Acting & Screen',
    false,
    false,
    2
  ),
  (
    'Inner Circle Briefing: Syndicated Private Opportunities (Exclusive)',
    'youtube',
    'dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    'Inner Circle',
    false,
    true,
    3
  );

-- 10. Posts (Draft Journal entries)
insert into public.posts (
  slug,
  title,
  excerpt,
  content,
  cover_url,
  tags,
  members_only,
  status,
  published_at,
  reading_minutes
) values
  (
    'the-architecture-of-personal-presence',
    'The Architecture of Personal Presence: Beyond Fashion',
    'Presence is not merely what one wears in the glare of camera flashbulbs; it is the quiet certainty of self-command in any boardroom or soundstage.',
    '<p>True luxury has never shouted. In Mumbai, a city known for electric tempo and grand spectacles, the individuals who command lasting respect are those whose presence precedes them without noise.</p><p>When we examine personal styling from a disciplined standpoint, clothing ceases to be an indulgence and becomes armour. Every lapel choice, every restraint in colour palette, communicates dignity, discretion, and intent.</p>',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    array['Style', 'Presence', 'Editorial'],
    false,
    'published',
    now(),
    4
  ),
  (
    'disciplined-wealth-building-an-enduring-portfolio',
    'Disciplined Wealth: Building an Enduring Portfolio Without Compromising Image',
    'How capital stewardship and personal brand aesthetic amplify one another. Note: Content is for inspiration and information only and is not financial advice.',
    '<p>Many view finance and aesthetics as opposing disciplines. In reality, they share the exact same foundation: rigorous self-discipline, long-term patience, and an unwillingness to accept mediocre standards.</p><p>As founder of Javi Groups, the guiding principle has always been simple: build enduring balance sheets while holding oneself to the highest code of personal presentation.</p><blockquote class="border-l-2 border-gold pl-4 italic text-stone">Content is for inspiration and information only and is not financial advice.</blockquote>',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    array['Finance', 'Wealth', 'Javi Groups'],
    false,
    'published',
    now(),
    5
  ),
  (
    'inside-the-screen-craft-crime-world',
    'Inside the Screen Craft: Creating Tension on Crime World',
    'An exclusive behind-the-scenes reflection on playing Neighbour in Crime World (2022) and the technical rigour of episodic crime drama.',
    '<p>Stepping onto the set of a crime series requires an immediate shift in psychological temperature. In Crime World (2022), the role of Neighbour demanded quiet realism rather than grand theatrical gestures.</p><p>Members of the Inner Circle can view our behind-the-scenes camera stills and breakdown notes on script marks.</p>',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop',
    array['Acting', 'Cinema', 'Inner Circle'],
    true,
    'published',
    now(),
    3
  );

-- 11. Testimonials & Press Placeholders (Draft only — is_published = false so none show publicly until edited)
insert into public.testimonials (name, role, body, avatar_url, is_published, sort_order) values
  (
    'Industry Collaborator (Placeholder)',
    'Senior Creative Director',
    'Vipul brings an unmatched aura of sophistication and poise to every frame. His professionalism on set is exemplary.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    false,
    1
  ),
  (
    'Venture Associate (Placeholder)',
    'Private Equity Partner',
    'A visionary communicator who understands both high-stakes capital structuring and modern brand influence.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    false,
    2
  );

insert into public.press_items (outlet, title, url, date, logo_url, is_published, sort_order) values
  (
    'Entertainment News (Placeholder)',
    'Spotlight on Mumbai Character Actors: The Crime World Ensemble',
    'https://example.com/press-placeholder',
    'November 2022',
    null,
    false,
    1
  );

-- 12. Legal Pages (Rich Text Seed)
insert into public.pages (slug, title, content) values
  (
    'privacy-policy',
    'Privacy Policy',
    '<h2>Privacy Policy</h2><p>Last updated: October 2026</p><p>Vipul Mota and Javi Groups ("we", "our") respect the privacy of our visitors and registered members. This Privacy Policy outlines our data collection, usage, and safeguarding practices.</p><h3>Information We Collect</h3><p>We collect information you explicitly provide, including name, email, phone number, and enquiry details submitted through our contact forms or member registration.</p><h3>Data Security</h3><p>All sensitive information is secured through enterprise-grade encryption. We do not sell or transfer your personal information to third parties.</p>'
  ),
  (
    'terms-of-service',
    'Terms of Service',
    '<h2>Terms of Service</h2><p>Last updated: October 2026</p><p>By accessing or using this website, you agree to comply with and be bound by these Terms of Service.</p><h3>Intellectual Property</h3><p>All photography, cinematic reels, video content, editorial writing, and design elements featured on this website are the proprietary property of Vipul Mota and Javi Groups.</p><h3>Member Conduct</h3><p>Members agree to maintain respectful discourse in comments and adhere to community guidelines.</p>'
  ),
  (
    'disclaimer',
    'Financial & Legal Disclaimer',
    '<h2>Financial & Legal Disclaimer</h2><p>Important Notice:</p><p class="italic">Content published across this website, on Instagram (@javigroups), and on YouTube (@VibewithVipulMota) is created solely for inspiration, motivational, and informational purposes. It does NOT constitute financial advice, investment counsel, or legal solicitation.</p><p>Always consult qualified professional financial advisors before entering into any financial commitments.</p>'
  )
on conflict (slug) do nothing;

-- 13. Owner Account Admin Promotion Snippet (Execute in Supabase SQL editor after owner registers)
-- update public.profiles
-- set role = 'admin'
-- where email = 'vipul@javigroups.com';
