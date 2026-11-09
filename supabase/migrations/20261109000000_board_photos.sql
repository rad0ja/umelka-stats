-- Board photos: one optional photo of the whiteboard per match, as evidence for its recorded score.
-- Files live in the public `board-photos` bucket as `<match id>/<timestamp>.jpg` (a fresh name per upload
-- so the CDN never serves a stale photo after a replace); the match points at the current one.
-- Safe to run more than once.

alter table public.matches add column if not exists board_photo_path text;

-- Public bucket: anyone can view a photo by its URL. Only small JPEGs, since the browser re-encodes
-- every photo to a 2000px JPEG before uploading.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('board-photos', 'board-photos', true, 5242880, array['image/jpeg'])
on conflict (id) do update
    set public = excluded.public,
        file_size_limit = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;

-- Only logged-in users can add, replace or remove photos. Viewing goes through the public URL and needs
-- no policy; select is limited to logged-in users so anonymous visitors can't list the bucket.
drop policy if exists "Board photos: authenticated select" on storage.objects;
create policy "Board photos: authenticated select" on storage.objects
    for select to authenticated using (bucket_id = 'board-photos');
drop policy if exists "Board photos: authenticated insert" on storage.objects;
create policy "Board photos: authenticated insert" on storage.objects
    for insert to authenticated with check (bucket_id = 'board-photos');
drop policy if exists "Board photos: authenticated update" on storage.objects;
create policy "Board photos: authenticated update" on storage.objects
    for update to authenticated using (bucket_id = 'board-photos') with check (bucket_id = 'board-photos');
drop policy if exists "Board photos: authenticated delete" on storage.objects;
create policy "Board photos: authenticated delete" on storage.objects
    for delete to authenticated using (bucket_id = 'board-photos');
