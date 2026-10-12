# Moving umelka-stats to the `umelka-stats-simple` Supabase project

The current Supabase project is being handed over to a new app, so umelka-stats gets its own project.
**The old project is not modified.** Every step below either reads from it or writes to the new project only.

## What the app uses

Found by scanning the code. The app makes no `.rpc()` calls and doesn't use realtime or storage.

| Object | Used by |
|---|---|
| `public.players` (`id`, `name`, `goal_target`) | players-manager, MatchForm, hooks, MVPScore, team-su |
| `public.seasons` (`id`, `name`) | `app/context/SeasonContext.tsx` |
| `public.matches` (`id`, `date`, `team_a`, `team_b`, `score_a`, `score_b`, `goals`, `assists`, `comments`, `season_id`, `jersey_player_id`) | MatchForm, LiveMatchSummary, MatchAccordion, hooks, MVPScore |
| `public.feedback` (`message`, `name`) | `app/components/FeedbackForm.tsx` |
| Supabase Auth, email/password | `app/login/page.tsx`, `app/hooks/useAuthGuard.ts` |

The repo defines no functions or triggers. Step 1 checks whether the old database has any that live only there.

## Steps

### 1. Inventory the old project (read-only)
Open the **old** project → SQL editor and run `inventory.sql`, one query at a time. It only reads the catalog.
Compare the results with `../migrations/20261012000000_umelka_stats_simple_init.sql`:
- **Columns and types (query 1).** If a column has a different name or type in the old database, change the init migration to match before running it. For example, the `players` goal target might be `goalTarget` instead of `goal_target`, or `team_a` might be `text[]`. Any column missing from the init migration will make the data copy fail.
- **Triggers, functions and views (queries 4–6).** If any show up, copy their definitions into a new migration file for the new project.
- **Policies (query 7).** The init migration lets everyone read players, seasons and matches, lets only logged-in users change them, and lets anyone send feedback. Adjust it if the old project allows more or less.
- **Row counts (query 8).** Note them so you can compare after the copy.

### 2. Create the schema in the new project
In the **new** project (`umelka-stats-simple`), run the init migration. Either:
- paste `supabase/migrations/20261012000000_umelka_stats_simple_init.sql` into the SQL editor, or
- run `supabase link --project-ref <new-ref>` and then `supabase db push`.

The migration only creates objects and can safely be run more than once.

### 3. Copy the data
Option A, the script (needs `pg_dump`/`psql` at the server's major version or newer):

```bash
OLD_DB_URL='postgresql://postgres.<old-ref>:<password>@<pooler-host>:5432/postgres' \
NEW_DB_URL='postgresql://postgres.<new-ref>:<password>@<pooler-host>:5432/postgres' \
./supabase/migration-to-simple/copy-data.sh
```

The script:
- runs a read-only `pg_dump --data-only` of the four tables from the old project;
- loads the result into the new project in one transaction;
- moves the `seasons` and `feedback` id counters past the copied ids;
- prints the row counts.

It refuses to run if both URLs point to the same database, or if the new tables already have rows.
The dump file `umelka-stats-data.sql` is git-ignored. Delete it when you're done.

Option B, no command line: in the old project's Table Editor, use **Export → CSV** for `seasons`, `players`, `matches` and `feedback`. Exporting only reads the data. Import the CSVs into the same tables in the new project, in that order (parents first). Afterwards, run the two `setval` lines from `copy-data.sh` in the new project's SQL editor.

### 4. Auth users
Auth users are not copied. In the new project, go to **Authentication → Users → Add user** and recreate the admin login(s).
Then check **Authentication → URL Configuration** (site URL `https://umelka-stats.vercel.app`).

### 5. Point the app at the new project
From the new project's **Project Settings → API**, update these values in `.env.local` and in the Vercel project's environment variables, then redeploy:

```
NEXT_PUBLIC_SUPABASE_URL=https://<new-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<new anon/publishable key>
```

### 6. Check
- The home and stats pages load, and the season picker lists the seasons.
- After logging in, `/add-match` can save a match, including the jersey player.
- The feedback form works while logged out.
- Optional: regenerate the types with `supabase gen types typescript --project-id <new-ref> > app/types/database.types.ts`.

Note: `/players-manager` is not behind `useAuthGuard`. With the new policies, adding, renaming or deleting players there only works after you log in.
