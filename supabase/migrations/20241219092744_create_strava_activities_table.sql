create table public.strava_activities (
  id bigint primary key,
  profile_id uuid not null references public.profiles(id) on delete cascade,

  activity_summary_json jsonb,
  activity_json jsonb
);

alter table public.strava_activities enable row level security;

create policy "Users can view their own strava_activities."
  on strava_activities for select
  using ( auth.uid() = profile_id );

create policy "Users can insert their own strava_activities."
  on strava_activities for insert
  with check ( auth.uid() = profile_id );

create policy "Users can update own strava_activities."
  on strava_activities for update
  using ( auth.uid() = profile_id );
