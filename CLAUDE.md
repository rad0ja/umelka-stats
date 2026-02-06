# CLAUDE.md

## Project Overview

**myFotbalek (umelka-stats)** — A PWA for tracking amateur football/soccer match statistics, player performance, events, and team coordination.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4, Motion (animations), Lucide React (icons)
- **Backend**: Supabase (PostgreSQL, Auth, Realtime subscriptions)
- **Notifications**: Firebase Cloud Messaging (FCM) + Web Push API
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel

## Commands

```bash
npm run dev      # Dev server with Turbopack
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint
```

## Project Structure

```
app/
  (app)/              # Route group for authenticated pages (stats, matches, chat, profile)
  components/figma/   # Feature components (Chat, Matches, PlayerStats, Profile)
    components/       # Reusable UI components (StatCard, BottomTabNavigation, etc.)
    hooks/            # Data hooks (useMatches, useChat, useEvent, useRsvp)
    types/            # Feature-specific types
    liveMatchSummary/ # Live match tracking components
  data/               # Server-side data fetching (React cache)
  hooks/              # App-level hooks (useAuthGuard, useMyData, usePlayerStats)
  utils/              # Utilities (playerHelpers, teamSuggestion, streaks)
  types/              # Global types + auto-generated Supabase types (database.types.ts)
  login/, signup/     # Auth pages with server actions
  add-match/          # Match creation
  event/[id]/         # Dynamic event detail page
  admin/              # Admin-only pages
lib/
  client.ts           # Supabase browser client factory
  server.ts           # Supabase server client factory
  middleware.ts        # Auth session handling & route protection
  firebase-client.ts  # FCM push notification setup
supabase/
  migrations/         # SQL migration files
public/
  firebase-messaging-sw.js  # FCM service worker
  sw.js                     # PWA service worker
```

## Key Patterns

- **Server vs Client**: Use `'use server'` / `'use client'` directives explicitly. Pages in `(app)/` are server components that fetch data; feature components are client components.
- **Data Fetching**: Server-side functions in `app/data/` use React `cache()` for deduplication. Client-side hooks use Supabase real-time subscriptions.
- **Auth**: Middleware-level route protection via Supabase SSR. Admin access restricted to specific email in `lib/middleware.ts`. Season stored in cookies.
- **Naming**: PascalCase for components, camelCase for hooks/utils, kebab-case for route folders.
- **Styling**: Utility-first Tailwind classes. CSS variables for theming (see `globals.css`). Dark mode supported. Mobile-first (max-width: md).
- **Animations**: Use `motion/react` (not `framer-motion`).

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_FCM_VAPID_KEY
VAPID_PRIVATE_KEY
```

## Database

PostgreSQL via Supabase. Key tables: `players`, `matches`, `events`, `event_participants`, `chat_messages`, `event_chat_messages`, `push_subscriptions`. Types auto-generated in `app/types/database.types.ts`.

Migrations live in `supabase/migrations/`. Use `apply_migration` for DDL changes.

## Important Notes

- No test framework is set up yet — no jest/vitest.
- Auto-generated types in `app/types/database.types.ts` — do not edit manually.
- The `app/components/figma/` path is historical (from Figma design export) — components are fully custom now.
- PWA features: service workers, install prompt, push notifications.
