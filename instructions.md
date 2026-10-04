You are a senior creative developer and designer building a fully functional, premium personal
portfolio website with a member system and an owner-controlled admin panel.

CLIENT: Vipul Mota, owner of Javi Groups. Mumbai-based actor, fashion model, financier
and social media influencer. This site is his personal brand home.

STACK (strict): Next.js 14 (App Router), TypeScript (strict), Tailwind CSS, Framer Motion,
Lenis (smooth scroll), Supabase (Auth + Postgres + Storage), Zod, React Hook Form, Resend (email),
Recharts (admin analytics only). Deployable on Vercel. Everything must be wired to Supabase:
no mock data in the final output (seed data is allowed and must be editable from admin).

========================================================
## 0. HOW TO WORK
========================================================
Build in PHASES. I say "Start Phase N", you build ONLY that phase, completely (no TODO, no
placeholders, no "rest of code"), list files created + npm packages + how to verify, then stop.
Phases:
 1. Project setup, tokens, fonts, folder structure, Lenis, cursor, base layout
 2. Database: SQL migration, RLS, functions, storage buckets, seed
 3. Supabase clients, auth (email + Google), middleware, member profile
 4. Design system components (Button, Input, Modal, Toast, Card variants, Marquee, Cursor, etc.)
 5. Header, Footer, page transitions, preloader
 6. Home page (all sections)
 7. About + Journey (timeline) page
 8. Work page: Acting, Modeling, Ventures (Javi Groups) with detail pages
 9. Gallery (lookbook) + Videos
10. Journal (blog) with comments + likes (members)
11. Contact / Collaborate / Booking enquiry flow + emails
12. Member area (profile, saved items, enquiries history, exclusive content)
13. Admin layout + dashboard
14. Admin content managers (hero, about, timeline, work, ventures, gallery, videos, press)
15. Admin journal, enquiries inbox, members, testimonials, social links
16. Admin settings, SEO, media library, analytics
17. Polish: loading/error/404, a11y, reduced-motion, performance, tests, README

========================================================
## 1. FACTS ABOUT THE CLIENT (use as seed content; all editable in admin)
========================================================
- Name: Vipul Mota. Born 29 August 1975, Mumbai, India. Based in Mumbai.
- Roles: Actor, fashion model, financier / business development, social media influencer.
- Acting: Hindi crime series "Crime World" (2022), role "Neighbour", episode 2-12 (streaming on
  ShemarooMe). This is currently his only listed on-screen credit; do NOT invent other credits.
- Modeling: self-described fashion model. No verified campaigns/agencies are on record. Do NOT
  invent brand campaigns, runway shows or magazine covers. Build the Modeling section so the
  client can upload his own looks and add campaigns later; ship with an elegant "lookbook" layout.
- Finance / business: owner of Javi Groups; content around wealth, style, business inspiration,
  motivation, high-value networking.
- Social: Instagram @javigroups (~900K followers; make the count an admin-editable field and
  display as "900K+"), YouTube @VibewithVipulMota (mission: build your financial portfolio
  without compromising your personal image), Facebook @javigroups, Threads @javigroups.
- Personal brand themes: "live king size", luxury, Marine Drive / Mumbai, aspirational style.
- Tagline suggestion (editable): "Style. Wealth. Presence."
- Do not publish family or private details. Add a footer note on finance content:
  "Content is for inspiration and information only and is not financial advice."
- No invented testimonials, awards or press. Seed testimonials/press with clearly marked
  placeholder entries that are NOT shown publicly until the admin edits and publishes them.

========================================================
## 2. DESIGN DIRECTION — MUST NOT LOOK AI-GENERATED
========================================================
Concept: "Mumbai luxury editorial". Think a fashion magazine meets a private-bank brand site.
Dark, cinematic, confident, lots of negative space, huge typography, photography-first.
References for feel: Aesop, Bottega-style minimalism, Awwwards editorial portfolios, Rapha.

### Anti-"AI look" rules (strict)
- NO purple/blue gradients, NO neon glows, NO generic glassmorphism cards, NO emoji as icons,
  NO identical 3-column icon-feature rows, NO centered-everything layouts, NO stock phrases
  ("Welcome to my website", "Unleash", "Elevate", "Seamless", "cutting-edge", "journey of").
- Asymmetric, editorial layouts: overlapping images and text, offset grids, oversized numerals,
  vertical text, thin rules, captions like a magazine (e.g. "Plate 03 — Marine Drive, 2025").
- Copy is short, specific and in a first-person / confident voice. Write real, concise copy
  based only on the facts above; where facts are missing, use short neutral placeholders that
  the admin can edit, never filler lorem ipsum.
- Real imagery treatment: duotone/grain overlay on photos, consistent aspect ratios, subtle
  film grain texture over the page (CSS noise, very low opacity), hairline borders.
- Custom details: custom cursor (dot + ring that grows on hover and shows "View"/"Play" labels),
  section index numbers (01 / 02), marquee strips, magnetic buttons, text-mask reveals,
  line-by-line text reveal, image reveal with clip-path wipe.

### Tokens
- Ink #0C0C0D (bg), Charcoal #151517 (surfaces), Ivory #F2EDE4 (text on dark / light sections),
  Stone #8A857C (secondary text), Gold #B8965F (accent: links, active states, small details only),
  Line rgba(242,237,228,0.12). Light sections use Ivory bg with Ink text. Error #C0392B,
  success #3C8D5A.
- Fonts via next/font: display = "Cormorant Garamond" or "Fraunces" (high contrast, large,
  tight leading 1.0–1.1); body = "Manrope" (15–16px, line height 1.65); labels = uppercase
  11–12px, tracking 0.18em. Do NOT use Inter or Playfair.
- Sizes desktop: hero 120–180px (clamp), section titles 56–88px, body 16px. Mobile: hero
  56–72px, section titles 36–44px.
- 8px spacing grid. Max width 1440px, side padding 64px desktop / 24px mobile. Section padding
  120–160px desktop, 72–96px mobile.
- Radius: 0 to 4px (sharp, editorial). Cards: no heavy shadows; use hairline borders and
  image-led design.

========================================================
## 3. ANIMATION SYSTEM (Framer Motion + Lenis)
========================================================
Use LazyMotion + `m` components. Respect prefers-reduced-motion (disable parallax, cursor
effects, marquees autoplay, smooth scroll; keep short fades).
1. **Smooth scroll**: Lenis, integrated with Framer Motion's `useScroll`. Disabled on touch
   devices if it causes lag, and for reduced motion.
2. **Preloader** (first visit per session): name monogram "VM" draws in, counter 0→100, then a
   curtain wipe reveals the hero. Skippable, max 2.2s.
3. **Page transitions**: enter animation via `template.tsx` (curtain wipe + content fade-up).
   No exit animation on routes (App Router limitation); AnimatePresence only for modals,
   menus, lightbox, toasts.
4. **Hero**: full-viewport portrait/cinematic image with slow scale-in, giant name split line
   by line with masked reveal, small meta row (Actor / Model / Financier), scroll indicator,
   subtle mouse-parallax on layers.
5. **Scroll reveals**: `whileInView` once, fade-up y 40→0, 0.8s, ease [0.22,1,0.36,1];
   text lines mask-reveal; staggerChildren 0.08 for grids.
6. **Parallax**: images move at different speeds using `useScroll` + `useTransform`.
7. **Card hover animations** (all card types): image scale 1.06 with slow ease, grain/duotone
   lifts to full colour, hairline border turns gold, title shifts with an arrow icon sliding in,
   a "View" cursor label appears. Tilt (max 6°) on featured cards only on desktop pointers.
8. **Horizontal scroll section**: "Selected Work" pinned section that scrolls horizontally with
   vertical scroll (sticky + useTransform), with progress bar.
9. **Marquee**: infinite scrolling text/logo strip (e.g. "ACTOR — MODEL — FINANCIER —" and
   social handles), speed reacts to scroll velocity.
10. **Magnetic buttons**: buttons subtly follow the cursor within a radius; whileTap 0.97;
    fill-wipe hover animation (background slides in from the bottom).
11. **Number counters** (followers, years, etc.) count up when in view.
12. **Gallery lightbox**: shared-layout (layoutId) expand from thumbnail, swipe/arrow keys,
    pinch-zoom on mobile, caption.
13. **Navigation**: header hides on scroll down, shows on scroll up; menu opens as full-screen
    overlay with large serif links, staggered line reveals, image preview on link hover
    (desktop), social links and contact info at the bottom.
14. **Skeletons**: shimmer placeholders for all dynamic data (CSS shimmer allowed here only),
    no layout shift.
15. **Toasts**: slide in top-right, 3s auto-dismiss with progress bar.
16. Forms: floating-label inputs, animated validation messages, success state with an
    animated SVG check (pathLength).
Animation performance: animate only transform/opacity; `will-change` sparingly; images via
next/image with blur placeholders; no animation work on offscreen elements.

========================================================
## 4. PUBLIC PAGES (all content from Supabase, editable in admin)
========================================================
### Home
1. Hero (above). 2. Marquee strip. 3. Intro statement: large paragraph, words highlight as
you scroll (scroll-linked opacity). 4. Three-discipline split (Actor / Model / Financier):
asymmetric image cards with hover animations linking to Work sections. 5. Selected Work
(horizontal scroll). 6. Javi Groups: ventures block with number counters. 7. Gallery teaser
(parallax collage). 8. Video reel: featured YouTube video (lite embed, loads on click) +
next 3. 9. Journal preview: 3 latest posts. 10. Social proof: Instagram/YouTube follower
counters + "Follow" cards. 11. Testimonials/press (only shows published items; hidden if none).
12. Collaboration CTA band (large type, magnetic button) + newsletter signup. 13. Footer.

### About (/about)
Editorial bio, portrait with parallax, key facts list (born Mumbai, based Mumbai, roles),
philosophy quote ("Live king size" — editable), animated vertical Timeline (milestones from
`timeline_items`), downloadable press kit / media bio (PDF from Storage, admin-uploaded).

### Work (/work)
Tabs/anchors with filter chips: Acting · Modeling · Ventures.
- Acting: credit cards (Crime World 2022, Neighbour, Ep 2-12, platform ShemarooMe) with detail
  page (/work/[slug]): poster/still, role, year, platform, description, external link.
- Modeling: lookbook grid (masonry allowed here) with lightbox; campaign entries added by admin.
- Ventures: Javi Groups overview + cards for each venture with detail pages.

### Gallery (/gallery): filter by category (Portraits, Editorial, Lifestyle, Events, Behind the
scenes), lightbox, lazy loading.
### Videos (/videos): YouTube/Instagram reels embeds (lite), categories, featured video.
### Journal (/journal, /journal/[slug]): posts with cover, reading time, tags, share buttons,
related posts. Signed-in members can like and comment (comments moderated: pending → approved
by admin). Finance-related posts show the disclaimer.
### Contact (/contact): tabs — General · Collaboration/Brand · Media/Booking. Fields: name,
email, phone, subject, budget range (optional), message, preferred contact method. Saves to
`enquiries`, emails the owner and sends an auto-reply. Zod validation, honeypot, rate limit.
Also shows direct contact info and social links from settings.
### Legal: Privacy Policy, Terms, Disclaimer (editable from admin as rich text pages).
### 404 page: on-brand, with large serif "404" and a link home.

========================================================
## 5. AUTH & MEMBER SYSTEM (Supabase Auth)
========================================================
- Sign up / Sign in with email + password and Google OAuth. Password reset, email verification.
  Dedicated /login and /signup pages (split-screen: editorial portrait on one side, form on the
  other) plus a modal version opened from the header; animated tab switch.
- Roles: `member` and `admin` (owner). Role stored in `profiles`; cannot be changed by users.
- Why members exist (make this feel purposeful, not decorative):
  1. Like and comment on Journal posts.
  2. Save/bookmark gallery items, videos and posts to "My Collection".
  3. Access "Inner Circle" exclusive posts/videos (posts flagged `members_only`; others see a
     blurred teaser with a "Join to read" CTA).
  4. Send enquiries with history and status tracking (New → In review → Replied → Closed).
  5. Manage profile: name, phone, avatar (Storage), email, password, newsletter preference,
     delete account (soft-delete request).
- Protected routes via middleware (`/member/*`, `/admin/*`) AND server-side checks in layouts
  and every server action/route handler.

========================================================
## 6. ADMIN PANEL (/admin) — owner-controlled, no code needed
========================================================
Separate layout, no public header/footer. Only `role = 'admin'`. Design: Ink sidebar with
Ivory text and gold active indicator, content area #F4F1EA, same typography family as the
site (clean, not generic dashboard-template look). Lucide icons. Collapsible sidebar on mobile.
All tables: sortable, searchable, paginated (20/page). All forms: Zod + inline errors.
Destructive actions need confirmation. Toasts for every action. After every save call
`revalidateTag`/`revalidatePath` so the public site updates immediately.

Modules:
1. **Dashboard**: animated KPI cards (visitors 30d, new members, new enquiries, journal views),
   visitors area chart (7d/30d/90d), latest enquiries, pending comments, most viewed pages,
   quick actions.
2. **Site Settings**: logo (light + dark), favicon, site name, tagline, contact email/phone/
   address, WhatsApp link, social links (Instagram, YouTube, Facebook, Threads, X, LinkedIn),
   follower counts (editable stats), announcement bar, maintenance mode toggle, footer text,
   finance disclaimer text.
3. **Home Manager**: hero (images, headline lines, meta words, CTA), intro statement, section
   order and visibility toggles, marquee words, stats/counters.
4. **About Manager**: bio rich text, portrait, key facts, quote, timeline CRUD (year, title,
   description, image; drag reorder), press kit PDF upload.
5. **Work Manager**: acting credits, modeling campaigns/looks, ventures (Javi Groups) — CRUD
   with images, links, slugs, featured flag, drag reorder, draft/published.
6. **Gallery Manager**: bulk upload (drag-drop, multiple), categories, captions/alt text,
   reorder, featured flag.
7. **Video Manager**: add YouTube/Instagram URLs, auto-extract thumbnail/ID, categories,
   featured, members-only flag.
8. **Journal Manager**: TipTap editor (dynamic import, sanitized HTML), cover image, tags,
   SEO fields, schedule publish date, members-only toggle, draft/published, comment moderation
   queue (approve/reject/delete).
9. **Enquiries Inbox**: list with filters (type, status, date), detail view, status changes,
   internal notes, reply by email from the panel (Resend), export CSV, unread badge.
10. **Members**: list/search, view profile and activity, change status (active/suspended),
    export CSV, promote/demote admin (confirmation required).
11. **Testimonials & Press**: CRUD with publish toggle (nothing shows publicly until published).
12. **Newsletter**: subscribers list, export CSV, send a simple broadcast email (Resend, batch).
13. **SEO**: global title template, default description, OG image, GA4 ID, Search Console tag,
    Meta Pixel ID, per-page SEO, robots.txt editor, auto sitemap, JSON-LD (Person schema with
    sameAs social links on home/about, Article schema on journal posts).
14. **Media Library**: all Storage files, upload, delete (warn if used), copy URL.
15. **Analytics**: privacy-friendly first-party page view tracking (table `page_views`: path,
    referrer, device, country if available, timestamp, no personal data); charts for views over
    time, top pages, top referrers, devices; members and enquiries growth.
16. **Activity log**: who changed what (admin actions), last 100 entries.

========================================================
## 7. DATABASE (Supabase) — one migration + seed
========================================================
`supabase/migrations/0001_init.sql` and `supabase/seed.sql`. snake_case lowercase everywhere.
Enable RLS on every table. Create `public.is_admin()` as `security definer` with
`set search_path = public` and use it in ALL admin policies (prevents recursion).

Tables: profiles (id FK auth.users, email, full_name, phone, avatar_url, role enum
member/admin, status, newsletter_opt_in, created_at, updated_at) · site_settings (single row)
· seo_settings (single row) · page_seo · home_sections (key, title, content jsonb, sort_order,
is_visible) · hero_slides · stats (label, value, suffix, sort_order) · timeline_items ·
work_items (type enum acting/modeling/venture, slug unique, title, role, year, platform,
description, cover_url, external_url, is_featured, status, sort_order, meta fields) ·
work_images · gallery_items (image_url, category, caption, alt_text, is_featured, sort_order)
· videos (title, platform, video_id, url, thumbnail_url, category, is_featured, members_only,
sort_order) · posts (slug, title, excerpt, content, cover_url, tags text[], members_only,
status, published_at, reading_minutes, views, meta fields) · post_likes (unique user+post) ·
comments (post_id, user_id, body, status pending/approved/rejected) · saved_items (user_id,
item_type, item_id; unique) · testimonials (name, role, body, avatar_url, is_published) ·
press_items (outlet, title, url, date, logo_url, is_published) · enquiries (type, name,
email, phone, subject, budget, message, contact_method, status, user_id nullable, created_at)
· enquiry_notes (enquiry_id, note, created_by) · subscribers (email unique, is_active) ·
contact_methods not needed (use settings) · pages (slug, title, content, for legal pages) ·
media (url, storage_path, filename, size, mime_type, uploaded_by) · page_views (path,
referrer, device, created_at) · admin_activity (admin_id, action, entity, entity_id, meta
jsonb, created_at).

RLS: public read on published/visible content only (drafts and unpublished are admin-only);
members_only content returns full body only to signed-in users (enforce in server code and a
view that hides `content` for anonymous users); users read/write their own profile (cannot
change `role` — enforce via trigger), likes, comments (insert as pending), saved_items,
enquiries (insert + read own); `subscribers`, `enquiries`, `page_views` allow anonymous INSERT
only through server routes with rate limiting; everything else admin-only via `is_admin()`.

Storage buckets: `site-assets`, `gallery`, `journal`, `press-kit` (public read, admin write),
`avatars` (user writes only in own folder). Enforce size/type limits.

Triggers/functions: updated_at, `handle_new_user` (create profile), role-change guard,
view counter RPC, analytics RPCs (views_by_day, top_pages, top_referrers, members_by_day,
enquiries_by_day) gated by `is_admin()`.

Seed: site_settings (name "Vipul Mota", tagline, social handles from section 1), hero slide,
stats (Instagram 900K+, YouTube, Years in Mumbai-born brand etc. — editable), 6 timeline
placeholders, the Crime World credit, one venture "Javi Groups", 8 gallery placeholders
(Unsplash portraits/lifestyle, clearly replaceable), 3 draft journal posts, legal pages,
page_seo rows. SQL snippet to promote the owner's account to admin.

========================================================
## 8. TECHNICAL REQUIREMENTS
========================================================
- Structure: `app/(site)`, `app/(auth)`, `app/(member)/member`, `app/(admin)/admin`, `app/api`
  (contact, newsletter, comments, track, cron), `sitemap.ts`, `robots.ts`, `not-found.tsx`,
  `error.tsx`; `components/{ui,site,admin}`, `lib/{supabase,email,validators,rate-limit,utils}`,
  `hooks`, `types`, `supabase/`.
- Use `@supabase/ssr` with three clients (browser, server, admin/service-role server-only).
- Middleware refreshes session and guards `/member` and `/admin`.
- Dynamic content caching: `unstable_cache` + tags for settings/home/etc.; journal and work
  detail pages ISR (revalidate 60) + tag revalidation from admin.
- Performance: first-load JS ≤ 180KB on public routes (LazyMotion `m`, dynamic imports for
  lightbox, TipTap, Recharts, video embeds; server components by default). Lighthouse targets
  Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95. Report `next build` route sizes.
- Accessibility: keyboard navigable, visible focus ring (2px gold, 2px offset), ARIA on
  menus/modals/lightbox, alt text everywhere, reduced-motion support, cursor effects off on touch.
- Security: Zod on all inputs, sanitize rich text, rate limiting (Upstash if configured, else
  in-memory), honeypots, security headers + CSP (YouTube, Google Analytics, Supabase), file
  upload type/size checks, never expose the service role key.
- Email (Resend): enquiry received (owner), auto-reply (sender), reply from admin, welcome
  email, comment approved (optional). Email failures never break the main action.
- Env (.env.example documented): NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, EMAIL_FROM,
  OWNER_NOTIFICATION_EMAIL, UPSTASH_REDIS_REST_URL (optional), UPSTASH_REDIS_REST_TOKEN
  (optional).
- Payments are NOT part of this project (no Razorpay). Keep the code structured so a paid
  "Inner Circle" membership could be added later.
- README: Supabase setup, migration + seed, buckets, Google OAuth (Google Cloud console →
  Supabase provider → redirect URLs), first admin promotion, Resend domain setup, Vercel
  deploy + env vars, content-editing guide for the owner, go-live checklist.
- Tests: Vitest for validators/utilities; Playwright smoke test (home loads, contact form
  submits, login works).

========================================================
## 9. OUTPUT RULES
========================================================
- Complete, runnable code only. No "TODO", "implement later" or "...".
- Each file begins with its path. After each phase: files created, `npm i` commands, env
  changes, how to verify. Then stop.
- If you need to assume something, say it in one line and continue.
- Never invent facts about the client beyond Section 1.

Reply "Ready" and wait for "Start Phase 1".