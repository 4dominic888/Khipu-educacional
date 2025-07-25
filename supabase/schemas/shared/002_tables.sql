create table public.period_time (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text
);