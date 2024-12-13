create table public.strava_profiles (
  profile_id uuid not null references profiles on delete cascade,
  refresh_token text,
  athlete_profile jsonb,

  primary key (profile_id)
);

alter table public.strava_profiles enable row level security;

create policy "Strava profiles are only viewable by their owner."
  on strava_profiles for select
  using ( auth.uid() = profile_id );

create policy "Users can insert their own Strava profile."
  on strava_profiles for insert
  with check ( auth.uid() = profile_id );

create policy "Users can update own Strava profile."
  on strava_profiles for update
  using ( auth.uid() = profile_id );
