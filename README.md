# VIPUL MOTA — PORTFOLIO & EXECUTIVE SANCTUARY

> **"Style. Wealth. Presence."**  
> *Official personal brand home and executive administration platform for Vipul Mota, owner of Javi Groups, Mumbai-based actor (*Crime World*, 2022), fashion model, and financier.*

---

## 1. ARCHITECTURAL OVERVIEW

Built with an uncompromising **"Mumbai Luxury Editorial"** aesthetic—fusing the clean restraint of bespoke high-fashion with the gravitas of private wealth stewardship.

### Core Technology Stack
- **Framework**: Next.js 14 App Router (`app/(site)`, `app/(auth)`, `app/(member)`, `app/(admin)`)
- **Language**: TypeScript (Strict mode, zero `any` leaks)
- **Styling**: Tailwind CSS with custom editorial design tokens (`Ink #0C0C0D`, `Charcoal #151517`, `Ivory #F2EDE4`, `Stone #8A857C`, `Gold #B8965F`)
- **Typography**: Cormorant Garamond (Display Serif) & Manrope (Body Sans-Serif)
- **Motion & Smooth Scroll**: Lenis smooth scroll integrated with Framer Motion (`LazyMotion`, `m` components)
- **Database & Auth**: Supabase (PostgreSQL with 23 tables, RLS on every table, triggers, RPC analytics, and Storage Buckets)
- **Email Delivery**: Resend (Transactional executive notifications, auto-replies, and admin inbox replies)
- **Analytics & Telemetry**: First-party privacy-preserving telemetry visualized via Recharts
- **Testing**: Vitest for unit validation and Playwright for end-to-end smoke verification

---

## 2. QUICKSTART & LOCAL SETUP

### Prerequisites
- Node.js 18.18+ or Node.js 20+
- An active Supabase project (Free tier or Pro)
- A Resend API key (optional for local mock mode)

### Installation
```bash
# 1. Clone repository
git clone <repo-url>
cd javi-group-portfolio

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 3. SUPABASE CONFIGURATION & SEEDING

### Step 1: Execute Schema Migration
Open your Supabase project dashboard -> **SQL Editor**, and execute:
```sql
-- Located in supabase/migrations/0001_init.sql
```
This provisions:
- 23 relational tables with foreign keys and strict constraints
- `public.is_admin()` `security definer` function to prevent recursive RLS checks
- Comprehensive Row Level Security (RLS) policies
- Automatic user profile provisioning triggers on `auth.users` signup
- Privacy-friendly analytics RPC functions (`get_analytics_views_by_day`, `top_pages`, etc.)

### Step 2: Seed Baseline Data
In the Supabase **SQL Editor**, execute:
```sql
-- Located in supabase/seed.sql
```
This populates:
- Primary site settings (`Vipul Mota`, `Style. Wealth. Presence.`, `900K+`, `100K+`)
- Verified screen credits: *Crime World* (2022) as "Neighbour" (Episode 2–12, ShemarooMe)
- Javi Groups venture dossier
- Mumbai Sartorial Lookbook plates (8 editorial plates)
- Curated video repertoire
- Thought leadership journal dispatches
- Quarantined testimonials & press items (draft status by default)
- Legal disclaimer rich text pages

### Step 3: Storage Buckets Setup
Ensure the following buckets exist in Supabase **Storage** (configured as public read, authenticated admin write):
1. `site-assets` (System logos, hero stills)
2. `gallery` (Lookbook fashion photography)
3. `journal` (Dispatch article hero imagery & BTS)
4. `press-kit` (Official PDF media kit downloads)
5. `avatars` (Member & user profile photographs)

---

## 4. PROMOTING FIRST OWNER ADMIN

Once the owner signs up via `/signup` or Google OAuth with email `vipul@javigroups.com`:

```sql
-- Run in Supabase SQL Editor:
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'vipul@javigroups.com';
```

This immediately unlocks access to the `/admin` executive console. The active session guard prevents non-admins from entering `/admin`.

---

## 5. GOOGLE OAUTH SETUP

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Configure the **OAuth Consent Screen** (User type: External, App name: `Vipul Mota Portfolio`).
4. Under **Credentials**, create an **OAuth 2.0 Client ID** (Web application).
5. Add Authorized Redirect URI:
   ```
   https://<your-supabase-ref>.supabase.co/auth/v1/callback
   ```
6. Copy the **Client ID** and **Client Secret**.
7. In the Supabase Dashboard -> **Authentication** -> **Providers** -> **Google**:
   - Enable Google
   - Paste **Client ID** and **Client Secret**
   - Save changes.

---

## 6. RESEND EMAIL DOMAIN VERIFICATION

1. Register at [Resend.com](https://resend.com) and create an API key.
2. In Resend Dashboard -> **Domains**, add your custom domain (e.g. `javigroups.com`).
3. Add the DNS records (DKIM, SPF, MX) at your DNS provider (Cloudflare, GoDaddy, Namecheap).
4. Update `.env.local` or Vercel environment variables:
   ```env
   RESEND_API_KEY=re_your_api_key
   EMAIL_FROM="Vipul Mota <vipul@javigroups.com>"
   OWNER_NOTIFICATION_EMAIL=vipul@javigroups.com
   ```
*Note: If no `RESEND_API_KEY` is provided, the application operates in resilient mock mode without failing inquiries.*

---

## 7. OWNER CONTENT-EDITING GUIDE (/admin)

The bespoke admin panel provides complete, no-code control over every facet of the personal brand:

1. **Dashboard (`/admin`)**: Live telemetry cards, 7-day traffic velocity curve, latest inquiries, and pending comments.
2. **Hero & Slides (`/admin/hero`)**: Change hero headlines, sub-copy, live status pill, CTA destination buttons, and portrait image.
3. **About & Journey (`/admin/about`)**: Edit editorial bio, philosophy quote (*"Live king size"*), and add or reorder timeline milestones.
4. **Work & Credits (`/admin/work`)**: Manage screen acting credits (*Crime World*), fashion lookbooks, and Javi Groups venture case studies.
5. **Lookbook Gallery (`/admin/gallery`)**: Upload plates, set orientation (`portrait`, `landscape`, `square`), and adjust captions and styling notes.
6. **Video Repertoire (`/admin/videos`)**: Embed YouTube and Instagram Reels, configure thumbnail previews, and toggle Inner Circle VIP exclusivity.
7. **Journal Dispatches (`/admin/journal`)**: Write articles using the editorial text formatter, schedule release dates, and moderate member comments in the queue.
8. **Inquiries Inbox (`/admin/enquiries`)**: Filter representation inquiries, change status (New, In Review, Replied, Closed), write internal confidential notes, compose email replies directly, and export to CSV.
9. **Member Roster (`/admin/members`)**: Review registered community members, suspend accounts, promote administrators, and export the roster.
10. **Testimonials & Press (`/admin/testimonials`)**: Manage endorsements and media features with an explicit quarantine protocol—nothing appears publicly until toggled to Published.
11. **Social Footprint (`/admin/social`)**: Update Instagram (@javigroups, 900K+), YouTube (@VibewithVipulMota, 100K+), Facebook, Threads, LinkedIn, and WhatsApp concierge links.
12. **Site Settings & SEO (`/admin/settings`)**: Maintain site name, address, top announcement banner, maintenance standby gate, Google Analytics 4 tags, Search Console verification, and robots.txt directives.
13. **Media Library (`/admin/media`)**: Centralized bucket storage explorer with direct URL copy and safe deletion confirmation.
14. **Audience Analytics (`/admin/analytics`)**: Detailed first-party metrics over 7, 30, and 90 days, top visited pages, device breakdown, and acquisition referrers.

---

## 8. DEPLOYMENT TO VERCEL

1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New** -> **Project** and select `javi-group-portfolio`.
3. Configure the Environment Variables:
   - `NEXT_PUBLIC_SITE_URL`: `https://your-production-domain.com`
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://<ref>.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `<anon-key>`
   - `SUPABASE_SERVICE_ROLE_KEY`: `<service-role-key>`
   - `RESEND_API_KEY`: `re_...`
   - `EMAIL_FROM`: `Vipul Mota <vipul@javigroups.com>`
   - `OWNER_NOTIFICATION_EMAIL`: `vipul@javigroups.com`
4. Click **Deploy**. Vercel will build and distribute the production bundle globally across Edge nodes.

---

## 9. GO-LIVE CHECKLIST

- [x] Database migration & seed executed in Supabase
- [x] Storage buckets configured with public read access
- [x] Owner account promoted to `admin`
- [x] Google OAuth client credentials verified
- [x] Resend email domain DKIM verified
- [x] Environment variables populated in Vercel
- [x] Mandatory finance disclaimer present: *"Content is for inspiration and information only and is not financial advice."*
- [x] Verified facts respected (no unverified movie credits beyond *Crime World 2022*; no fake awards)
- [x] Accessibility verified (2px gold focus ring, alt text on images, keyboard navigable)
- [x] prefers-reduced-motion verified (animations and cursor effects gracefully disabled)
- [x] Unit test suite passes cleanly (`npm test`)

---

## 10. TESTING

```bash
# Run unit tests (Zod schema validators, honeypot traps, rate limiting, and CSS utilities)
npm test

# Run TypeScript compilation check
npx tsc --noEmit
```

---

*© 2026 Vipul Mota. All rights reserved. Javi Groups Mumbai.*
