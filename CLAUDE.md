# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Turbopack) at localhost:3000
npm run build        # Production build — use to verify compilation
npm run lint         # ESLint
npx drizzle-kit push # Push schema changes to Supabase Postgres
npx drizzle-kit generate  # Generate SQL migrations
npx shadcn@latest add <component>  # Add new shadcn/ui components
```

## Architecture

MoodCompass is a Next.js 16 App Router application for bipolar disorder mood tracking with AI-powered insights. It uses Supabase (Postgres) via Drizzle ORM, NextAuth v5 (beta) for auth, and the Anthropic Claude API for AI features.

### Route Groups

The app uses two Next.js route groups with separate layouts:
- `(auth)` — Sign in/sign up pages with a centered card layout. No auth required.
- `(dashboard)` — All authenticated pages (mood, journal, medications, insights, settings). Layout includes sidebar, header, and a persistent crisis support banner. Protected by middleware that redirects unauthenticated users to `/sign-in`.

The landing page (`src/app/page.tsx`) lives outside both groups and is public.

### Auth Flow

- **Config:** `src/lib/auth.ts` exports `{ handlers, auth, signIn, signOut }` from NextAuth v5.
- **Strategy:** JWT sessions with Drizzle adapter. Two providers: Credentials (email/password with bcrypt) and Google OAuth.
- **Registration:** Custom POST endpoint at `/api/auth/register` (not part of NextAuth).
- **Session access in API routes:** Call `await auth()` and check `session?.user?.id` (UUID).
- **Client-side:** `SessionProvider` wraps the app in `src/components/providers.tsx`. Use `useSession()` from `next-auth/react`.
- **Middleware:** `src/middleware.ts` uses NextAuth's `auth()` wrapper. Matcher covers `/mood/*`, `/journal/*`, `/medications/*`, `/insights/*`, `/settings/*`.

### Database

- **Schema:** `src/lib/db/schema.ts` — All tables defined with Drizzle `pgTable`. IDs are `uuid` with `defaultRandom()`.
- **Client:** `src/lib/db/index.ts` — Singleton `db` instance using `postgres` driver with `{ prepare: false }` (required for Supabase Transaction pool mode).
- **Tables:** users, accounts, sessions, verification_tokens (NextAuth), mood_entries, journal_entries, medications, medication_logs (app data).
- **All user data is scoped:** Every query filters by `userId` from the session.

### API Route Pattern

All API routes in `src/app/api/` follow the same pattern:
1. Call `await auth()` to get session
2. Return 401 if no `session?.user?.id`
3. Query/mutate with Drizzle, always filtering by `userId`
4. Return JSON with `NextResponse.json()`

AI routes (`/api/ai/insights`, `/api/ai/journal-prompt`) call the Anthropic SDK with `claude-sonnet-4-5-20250929`. They gracefully degrade with fallback responses if the API key is missing.

### UI Components

- **shadcn/ui** (new-york style, neutral base) — components in `src/components/ui/`. Add new ones with `npx shadcn@latest add <name>`.
- **Icons:** lucide-react throughout.
- **Charts:** Recharts (Area/Line charts) in `src/components/mood/mood-chart.tsx`.
- **Feature components** live in `src/components/{mood,journal,layout}/`.

### Content Sensitivity

This app serves people with mental health conditions. Always:
- Keep the 988 crisis banner visible and functional (`src/components/crisis-banner.tsx`)
- Use compassionate, non-stigmatizing language in any user-facing text
- Include disclaimers with AI-generated content ("not a substitute for professional medical advice")
- Never remove crisis support resources

## Environment Variables

Required in `.env.local` (see `.env.example`): `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ANTHROPIC_API_KEY`.
