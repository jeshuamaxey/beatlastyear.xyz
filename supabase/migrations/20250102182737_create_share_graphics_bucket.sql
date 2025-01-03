insert into storage.buckets
  (id, name, public)
values
  ('share_graphics', 'share_graphics', true);

create policy "authenticated users can upload to share_graphics bucket"
on storage.objects for insert to authenticated with check (
    -- restrict bucket
    bucket_id = 'share_graphics'
);