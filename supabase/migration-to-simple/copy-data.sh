#!/usr/bin/env bash
# Copies the umelka-stats data from the OLD Supabase project into the NEW one (umelka-stats-simple).
#
# The old project is only READ: pg_dump runs a read-only export, so nothing there is changed or deleted.
# The new project must already have supabase/migrations/20261012000000_umelka_stats_simple_init.sql applied.
#
# Usage:
#   OLD_DB_URL='postgresql://postgres.<old-ref>:<password>@<host>:5432/postgres' \
#   NEW_DB_URL='postgresql://postgres.<new-ref>:<password>@<host>:5432/postgres' \
#   ./supabase/migration-to-simple/copy-data.sh
#
# Take both URLs from Project Settings -> Database -> Connection string (use the session pooler / port 5432,
# not the transaction pooler on 6543). pg_dump must be the same major version as the server or newer.
set -euo pipefail

: "${OLD_DB_URL:?Set OLD_DB_URL to the old project's connection string}"
: "${NEW_DB_URL:?Set NEW_DB_URL to the new project's connection string}"

if [ "$OLD_DB_URL" = "$NEW_DB_URL" ]; then
    echo "OLD_DB_URL and NEW_DB_URL are the same database, aborting." >&2
    exit 1
fi

DUMP_FILE="${DUMP_FILE:-umelka-stats-data.sql}"

echo "==> Exporting data from the old project (read-only) to $DUMP_FILE"
# Parents first so foreign keys are satisfied while loading
pg_dump "$OLD_DB_URL" \
    --data-only \
    --no-owner \
    --no-privileges \
    --table=public.seasons \
    --table=public.players \
    --table=public.matches \
    --table=public.feedback \
    --file="$DUMP_FILE"

echo "==> Checking the new project is empty"
existing=$(psql "$NEW_DB_URL" -At -c \
    "select (select count(*) from public.players) + (select count(*) from public.seasons)
          + (select count(*) from public.matches) + (select count(*) from public.feedback)")
if [ "$existing" != "0" ]; then
    echo "The new project already has $existing rows in these tables; refusing to load twice." >&2
    exit 1
fi

echo "==> Loading data into the new project"
psql "$NEW_DB_URL" --single-transaction -v ON_ERROR_STOP=1 -q -o /dev/null -f "$DUMP_FILE"

echo "==> Moving the seasons id counter past the copied ids"
psql "$NEW_DB_URL" -v ON_ERROR_STOP=1 -q -o /dev/null <<'SQL'
select setval(pg_get_serial_sequence('public.seasons', 'id'), coalesce((select max(id) from public.seasons), 0) + 1, false);
SQL

echo "==> Row counts in the new project (compare with query 8 of inventory.sql on the old one)"
psql "$NEW_DB_URL" -c "
select 'players' as table_name, count(*) from public.players
union all select 'seasons', count(*) from public.seasons
union all select 'matches', count(*) from public.matches
union all select 'feedback', count(*) from public.feedback;"

echo "Done. The dump is kept in $DUMP_FILE; delete it once you've checked the new project."
