# Moving umelka-stats to the `umelka-stats-simple` Supabase project

The old Supabase project (`umelka-stats`, ref `qmlrwxnezaqfitmnhhlz`) is shared with another app (events, teams, chat, notifications), so umelka-stats now has its own project: `umelka-stats-simple` (ref `lcwxgmnouyeqiiujhwtr`).
**The old project was not modified.** It was only read from.

## Status (2026-10-15)

| Step | Status |
|---|---|
| 1. Inventory the old project | Done |
| 2. Create the schema in the new project | Done (`umelka_stats_simple_init` migration) |
| 3. Copy the data | Done, verified identical |
| 4. Recreate auth users | **To do** |
| 5. Point the app at the new project | **To do** |
| 6. Check the app | **To do** |

## What the app uses

The app makes no `.rpc()` calls and doesn't use realtime or storage.

| Object | Used by |
|---|---|
| `public.players` (`id`, `name`, `goal_target`) | players-manager, MatchForm, hooks, MVPScore, team-su |
| `public.seasons` (`id`, `name`) | `app/context/SeasonContext.tsx` |
| `public.matches` (`id`, `date`, `team_a`, `team_b`, `score_a`, `score_b`, `goals`, `assists`, `comments`, `season_id`, `jersey_player_id`) | MatchForm, LiveMatchSummary, MatchAccordion, hooks, MVPScore |
| `public.feedback` (`message`, `name`) | `app/components/FeedbackForm.tsx` |
| Supabase Auth, email/password | `app/login/page.tsx`, `app/hooks/useAuthGuard.ts` |

## What was done

### 1. Inventory (`inventory.sql`, read-only)
The old project's tables differ from what the code alone suggests:
- `seasons.id` is `smallint` with no default, and `seasons` has `start_date` (not null) and `end_date`.
- `matches.season_id` is `smallint`.
- `feedback.id` is a `uuid`, and its timestamp column is `submitted_at`.
- A `validate_match_goals_assists` trigger checks that `goals`/`assists` are `{ "<player id in team_a or team_b>": 0..50 }`.
- The other app added columns and logic that umelka-stats doesn't use: `team_id`, `user_id` (players), `created_by`, `event_id` (matches), and a `notify_match_result` trigger that sends push notifications.

All 48 players, 4 seasons (ids 5, 6, 7, 10) and 71 matches belong to umelka-stats. `feedback` was empty.

### 2. Schema
`../migrations/20261012000000_umelka_stats_simple_init.sql` matches the old column types, keeps the length/score checks and the validation trigger, and leaves out the other app's columns and trigger. Policies:
- Everyone can read players, seasons and matches.
- Only logged-in users can insert, update or delete them.
- Only logged-in users can send feedback (as before); nobody can read it through the API.

### 3. Data
Copied table by table (seasons → players → matches) through the Supabase MCP connector: each table was read from the old project as JSON and inserted into the new one with `jsonb_to_recordset`. The seasons id counter was moved to 11.

Verification, run on both projects with identical results:

```sql
select
  (select count(*) || ':' || md5(string_agg(concat_ws('|', id, name, start_date, end_date), ',' order by id)) from public.seasons) as seasons,
  (select count(*) || ':' || md5(string_agg(concat_ws('|', id, name, goal_target), ',' order by id)) from public.players) as players,
  (select count(*) || ':' || md5(string_agg(concat_ws('|', id, date, team_a::text, team_b::text, score_a, score_b, goals::text, assists::text,
          coalesce(comments, '<null>'), season_id, coalesce(jersey_player_id::text, '<null>')), ',' order by id)) from public.matches) as matches;
-- seasons 4:280fafe223815cac5fcc868bcb4bd437, players 48:b12b42665f9ccc4b356a2706faf533b5, matches 71:e0dc147f9832c79dad8694e8af0eac8d
```

`copy-data.sh` was **not** used and doesn't work against the old project as-is: its `pg_dump --data-only` exports every column, including the other app's ones, which don't exist in the new tables.

## Remaining steps

### 4. Auth users
Auth users are not copied. In the new project, go to **Authentication → Users → Add user** and recreate the admin login(s).
Then set **Authentication → URL Configuration → Site URL** to `https://umelka-stats.vercel.app`.

### 5. Point the app at the new project
Update these in `.env` and in the Vercel project's environment variables, then redeploy:

```
NEXT_PUBLIC_SUPABASE_URL=https://lcwxgmnouyeqiiujhwtr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon or sb_publishable_ key from Project Settings → API>
```

Matches saved in the old project after 2026-10-15 and before the redeploy are not in the new project. Copy them across the same way as in step 3.

### 6. Check
- The home and stats pages load, and the season picker lists the seasons.
- After logging in, `/add-match` can save a match, including the jersey player.
- Optional: regenerate the types with `supabase gen types typescript --project-id lcwxgmnouyeqiiujhwtr > app/types/database.types.ts`.

Note: `/players-manager` is not behind `useAuthGuard`. With the new policies, adding, renaming or deleting players there only works after you log in.
