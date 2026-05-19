-- Content log setup for the portfolio.
-- Run this in Supabase Dashboard -> SQL Editor.
-- Replace the email below before running.

create table if not exists public.content_entries (
  id bigserial primary key,
  date date not null,
  category text not null default 'article'
    check (category in ('video', 'article', 'book', 'build')),
  title text not null,
  url text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.content_entries enable row level security;

drop policy if exists "content entries are public readable" on public.content_entries;
drop policy if exists "only admin can insert content entries" on public.content_entries;
drop policy if exists "only admin can update content entries" on public.content_entries;
drop policy if exists "only admin can delete content entries" on public.content_entries;

create policy "content entries are public readable"
on public.content_entries
for select
to anon, authenticated
using (true);

create policy "only admin can insert content entries"
on public.content_entries
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'tsnsenthil01@gmail.com');

create policy "only admin can update content entries"
on public.content_entries
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'tsnsenthil01@gmail.com')
with check ((auth.jwt() ->> 'email') = 'tsnsenthil01@gmail.com');

create policy "only admin can delete content entries"
on public.content_entries
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'tsnsenthil01@gmail.com');

create index if not exists content_entries_date_idx on public.content_entries (date desc, id desc);
