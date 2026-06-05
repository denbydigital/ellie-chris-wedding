-- Run this in your Supabase project: SQL Editor > New query

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  status text not null default 'pending' check (status in ('pending','attending','declined')),
  party_size int not null default 0,
  guests_json jsonb not null default '[]',
  song text not null default '',
  notes text not null default '',
  invite_sent_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

-- Row-level security: only service role can write; anon can insert/update via API routes
alter table guests enable row level security;

-- Allow API routes (service role) full access — no policy needed for service role
-- Public read for the site (so guests can look up their own record by email)
create policy "guests can read own record"
  on guests for select
  using (true);

-- Index for fast email lookups
create index if not exists guests_email_idx on guests (email);
create index if not exists guests_status_idx on guests (status);
