-- READ-ONLY inventory of everything umelka-stats uses in the OLD Supabase project.
-- Paste into the old project's SQL editor and run each query; nothing here changes data or schema.
-- Compare the output with supabase/migrations/20261012000000_umelka_stats_simple_init.sql.

-- 1. Columns and types
select table_name, ordinal_position, column_name, data_type, udt_name, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name in ('players', 'seasons', 'matches', 'feedback')
order by table_name, ordinal_position;

-- 2. Constraints (primary keys, foreign keys, checks, uniques)
select conrelid::regclass as table_name, conname, pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid in ('public.players'::regclass, 'public.seasons'::regclass,
                   'public.matches'::regclass, 'public.feedback'::regclass)
order by 1, 2;

-- 3. Indexes
select tablename, indexname, indexdef
from pg_indexes
where schemaname = 'public' and tablename in ('players', 'seasons', 'matches', 'feedback')
order by 1, 2;

-- 4. Triggers on these tables, with the function each one calls
select event_object_table as table_name, trigger_name, action_timing, event_manipulation, action_statement
from information_schema.triggers
where event_object_schema = 'public' and event_object_table in ('players', 'seasons', 'matches', 'feedback')
order by 1, 2;

-- 5. Functions in public that mention any of these tables (RPCs, trigger functions, ...)
select p.oid::regprocedure as function, pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.prokind = 'f'
  and pg_get_functiondef(p.oid) ~* '\m(players|seasons|matches|feedback)\M';

-- 6. Views that depend on these tables
select distinct v.oid::regclass as view_name, pg_get_viewdef(v.oid) as definition
from pg_depend d
join pg_rewrite r on r.oid = d.objid
join pg_class v on v.oid = r.ev_class
where d.refobjid in ('public.players'::regclass, 'public.seasons'::regclass,
                     'public.matches'::regclass, 'public.feedback'::regclass)
  and v.oid not in ('public.players'::regclass, 'public.seasons'::regclass,
                    'public.matches'::regclass, 'public.feedback'::regclass);

-- 7. Row level security status and policies
select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where oid in ('public.players'::regclass, 'public.seasons'::regclass,
              'public.matches'::regclass, 'public.feedback'::regclass);

select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public' and tablename in ('players', 'seasons', 'matches', 'feedback')
order by 1, 2;

-- 8. Row counts (to check the copy afterwards)
select 'players' as table_name, count(*) from public.players
union all select 'seasons', count(*) from public.seasons
union all select 'matches', count(*) from public.matches
union all select 'feedback', count(*) from public.feedback;
