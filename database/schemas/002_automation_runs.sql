create table if not exists public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  run_key text not null unique,
  engine text not null check (engine in ('n8n', 'make', 'agent')),
  workflow text not null,
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed')),
  payload jsonb not null default '{}'::jsonb,
  message text not null default '',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists automation_runs_engine_created_idx
  on public.automation_runs(engine, created_at desc);

create index if not exists automation_runs_status_idx
  on public.automation_runs(status);

alter table public.automation_runs enable row level security;

drop policy if exists "Authenticated users can read automation runs" on public.automation_runs;

create policy "Authenticated users can read automation runs"
  on public.automation_runs for select
  to authenticated
  using (true);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'automation_runs'
  ) then
    alter publication supabase_realtime add table public.automation_runs;
  end if;
end $$;
