-- Run this in your Supabase project: SQL Editor > New query

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  status text not null default 'pending' check (status in ('pending','attending','declined')),
  party_size int not null default 0,
  max_guests int not null default 2,
  guests_json jsonb not null default '[]',
  song text not null default '',
  notes text not null default '',
  invite_token text unique default encode(gen_random_bytes(12), 'hex'),
  invite_sent_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

alter table guests enable row level security;

create policy "guests can read own record"
  on guests for select using (true);

create index if not exists guests_email_idx on guests (email);
create index if not exists guests_status_idx on guests (status);
create index if not exists guests_token_idx on guests (invite_token);

-- Migration: if the table already exists, add the new columns
alter table guests add column if not exists invite_token text unique default encode(gen_random_bytes(12), 'hex');
alter table guests add column if not exists max_guests int not null default 2;

-- Backfill tokens for any existing rows that don't have one
update guests set invite_token = encode(gen_random_bytes(12), 'hex') where invite_token is null;
