# Contently

Creator SaaS platform for content creators — idea management, brand CRM, email hub, billing, and analytics.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Database**: Supabase (PostgreSQL) with Row-Level Security
- **Auth**: Supabase Auth (email/password + Google OAuth)
- **Payments**: Stripe (checkout, subscriptions, customer portal, webhooks)
- **Email**: nodemailer (SMTP send) + imapflow (IMAP sync)
- **UI**: shadcn/ui (Radix primitives) + Tailwind CSS + Framer Motion
- **Validation**: Zod + React Hook Form

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check (npx tsc --noEmit)
```

## Project Structure

```
src/app/
  (dashboard)/       # Protected routes: ideas, calendar, brands, deals, emails, settings
  admin/             # Admin dashboard (gated by email)
  auth/              # Login, signup, verify-email, OAuth callback
  blog/              # Public blog
  api/
    stripe/          # checkout, portal, webhook
    emails/          # send (SMTP), sync (IMAP)
src/components/
  ui/                # shadcn components
  layout/            # Topbar, sidebar, app-layout
src/lib/
  supabase/          # client.ts, server.ts, middleware.ts
  stripe/            # client.ts, server.ts
src/types/
  database.ts        # Generated Supabase types (may drift from actual schema)
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PRICE_PRO
NEXT_PUBLIC_STRIPE_PRICE_CREATOR_PLUS
EMAIL_ENCRYPTION_KEY
NEXT_PUBLIC_APP_URL
```

## Key Patterns

- **Untyped Supabase client**: `createUntypedClient()` (browser) and `createUntypedServerClient()` (server) bypass generated types when `database.ts` doesn't match actual schema (e.g. `email_accounts` table uses `credentials` JSONB + `smtp_host`/`smtp_port` but types have `imap_username`/`imap_password_encrypted`).
- **Middleware auth**: `src/lib/supabase/middleware.ts` protects `/dashboard/*` routes and enforces onboarding completion.
- **Error boundaries**: Global (`src/app/error.tsx`) and dashboard-scoped (`src/app/(dashboard)/error.tsx`).
- **Admin gating**: `src/app/admin/page.tsx` checks `user.email` against a hardcoded admin email.
- **Webhook column name**: Subscriptions table uses `plan` (not `plan_id`). Valid status values: `trialing`, `active`, `canceled`, `incomplete`, `incomplete_expired`, `past_due`, `unpaid`, `paused`.

## Database

Migrations live in `supabase/migrations/` (5 files). Schema includes: `profiles`, `subscriptions`, `ideas`, `content_pillars`, `categories`, `deals`, `brands`, `email_accounts`, `email_messages`, `tasks`, `planner_items`, `revenues`, `analytics_snapshots`, `filming_setups`, `hashtag_groups`, `inspirations`, `script_blocks`, `broll_items`.

## Deployment

- **Hosting**: Vercel
- **Domain**: contentlyapp.com
- **Google OAuth**: Configured in Supabase Auth provider settings (no app-level env vars needed). Redirect URI in Google Cloud Console: `https://qszigejfvaycixgxbhrp.supabase.co/auth/v1/callback`

## Design Context

- **Register**: product (dashboard + app UI), with a public brand surface (landing + blog)
- **North Star**: "The Editorial Partner" — fast, readable, never in the way
- **Strategy**: `PRODUCT.md` — who/what/why; `DESIGN.md` — how it looks
- **Key rule**: Creator Violet (`#7c3aed`) is reserved exclusively for Creator+ / premium UI. The core palette is achromatic (near-black ink, white canvas, gray scale).
- **Live mode**: pre-configured for Next.js App Router in `.impeccable/live/config.json`. Run `/impeccable live` to start browser variant mode.
