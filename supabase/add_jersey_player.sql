-- Who has the jerseys after a match: they take them home, wash them and bring them to the next match.
-- Copies the type of players.id (uuid or bigint) so the foreign key matches whichever one the table uses.
do $$
declare
    player_id_type text;
begin
    select format_type(a.atttypid, a.atttypmod) into player_id_type
    from pg_attribute a
    where a.attrelid = 'public.players'::regclass and a.attname = 'id';

    execute format(
        'alter table public.matches add column if not exists jersey_player_id %s references public.players(id) on delete set null',
        player_id_type
    );
end $$;
