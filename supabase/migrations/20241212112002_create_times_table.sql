create table public.times (
  id serial primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  time numeric(8, 2) not null,
  distance text check (distance in ('100m', '200m', '400m', '800m', '1500m', '5km', '1k0m', 'half-marathon', 'marathon')),
  sport text check (sport in ('running')),
  year integer not null,

  data_source text check (data_source in ('manual', 'strava')),
  date date,
  strava_activity_id text,

  unique (profile_id, year, distance, sport)
);

alter table public.times enable row level security;

create policy "Users can view their own times."
  on times for select
  using ( auth.uid() = (select id from public.profiles where id = profile_id) );

create policy "Users can insert their own times."
  on times for insert
  with check ( auth.uid() = (select id from public.profiles where id = profile_id) );

create policy "Users can update own times."
  on times for update
  using ( auth.uid() = (select id from public.profiles where id = profile_id) );

