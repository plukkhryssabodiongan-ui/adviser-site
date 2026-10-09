-- Copy everything in this file into Supabase > SQL Editor, then click "Run".

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  full_name text not null,
  email text not null,
  phone text,
  answers jsonb,
  consent boolean not null default false
);

alter table public.leads enable row level security;

-- Visitors can only ADD leads. They can never read them.
create policy "Anyone can submit a lead"
  on public.leads for insert to anon
  with check (consent = true);
