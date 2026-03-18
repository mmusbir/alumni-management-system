-- Hardening migration for Supabase advisor warning:
-- function_search_path_mutable on public.set_updated_at

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$;
