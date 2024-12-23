-- add slug text field to profiles table schema
alter table public.profiles add column slug text unique;

-- inserts a row into public.profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, slug)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'slug');
  return new;
end;
$$;
