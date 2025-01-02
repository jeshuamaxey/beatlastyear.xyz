-- Edit strava profiles table
-- Strava profiles table will now only store publicly readable informtion
alter table public.strava_profiles drop column refresh_token;

drop policy "Strava profiles are only viewable by their owner." on public.strava_profiles;

create policy "Strava profiles are only viewable by anyone."
  on public.strava_profiles for select
  using ( true );

-- Refresh tokens
-- Refresh tokens are only viewable by their owner
create table public.strava_refresh_tokens (
  profile_id uuid not null references profiles on delete cascade,
  refresh_token text,

  primary key (profile_id)
);

alter table public.strava_refresh_tokens enable row level security;

create policy "Strava refresh tokens are only viewable by their owner."
  on public.strava_refresh_tokens for select
  using ( auth.uid() = profile_id );

create policy "Users can insert their own Strava refresh token."
  on public.strava_refresh_tokens for insert
  with check ( auth.uid() = profile_id );

create policy "Users can update own Strava refresh token."
  on public.strava_refresh_tokens for update
  using ( auth.uid() = profile_id );

create policy "Users can delete their own Strava refresh token."
  on public.strava_refresh_tokens for delete
  using ( auth.uid() = profile_id );