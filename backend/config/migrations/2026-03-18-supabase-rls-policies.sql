-- Hardening migration for Supabase RLS advisor warnings.
-- This project uses the Express backend as the only data access layer,
-- so client roles (anon/authenticated) should not read or mutate tables directly.

alter table public.admin_sessions enable row level security;
alter table public.admin_users enable row level security;
alter table public.alumni enable row level security;
alter table public.lapak_categories enable row level security;
alter table public.provinces enable row level security;
alter table public.site_settings enable row level security;
alter table public.usaha enable row level security;

drop policy if exists "deny_all_admin_sessions" on public.admin_sessions;
drop policy if exists "deny_all_admin_users" on public.admin_users;
drop policy if exists "deny_all_alumni" on public.alumni;
drop policy if exists "deny_all_lapak_categories" on public.lapak_categories;
drop policy if exists "deny_all_provinces" on public.provinces;
drop policy if exists "deny_all_site_settings" on public.site_settings;
drop policy if exists "deny_all_usaha" on public.usaha;

create policy "deny_all_admin_sessions"
on public.admin_sessions
for all
to anon, authenticated
using (false)
with check (false);

create policy "deny_all_admin_users"
on public.admin_users
for all
to anon, authenticated
using (false)
with check (false);

create policy "deny_all_alumni"
on public.alumni
for all
to anon, authenticated
using (false)
with check (false);

create policy "deny_all_lapak_categories"
on public.lapak_categories
for all
to anon, authenticated
using (false)
with check (false);

create policy "deny_all_provinces"
on public.provinces
for all
to anon, authenticated
using (false)
with check (false);

create policy "deny_all_site_settings"
on public.site_settings
for all
to anon, authenticated
using (false)
with check (false);

create policy "deny_all_usaha"
on public.usaha
for all
to anon, authenticated
using (false)
with check (false);
