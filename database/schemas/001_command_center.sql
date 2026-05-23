create extension if not exists pgcrypto;

create table if not exists public.command_agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  status text not null default 'idle' check (status in ('idle', 'running', 'paused', 'error')),
  queue_label text not null default 'Standing by',
  health_score numeric not null default 100 check (health_score >= 0 and health_score <= 100),
  last_run_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.contract_bids (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  agency text not null,
  status text not null default 'watching' check (status in ('watching', 'drafting', 'submitted', 'awarded', 'lost')),
  deadline timestamptz,
  compliance_score numeric not null default 0 check (compliance_score >= 0 and compliance_score <= 100),
  value_estimate numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.content_pipelines (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  platform text not null,
  status text not null default 'idea' check (status in ('idea', 'queued', 'drafting', 'scheduled', 'published')),
  lead_count integer not null default 0,
  conversion_rate numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.audio_releases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  release_type text not null default 'beat' check (release_type in ('single', 'beat', 'pack', 'album')),
  status text not null default 'draft' check (status in ('draft', 'queued', 'distributed', 'promoting')),
  upload_count integer not null default 0,
  growth_rate numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.game_milestones (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'roadmap' check (category in ('roadmap', 'asset', 'quest', 'system')),
  status text not null default 'planned' check (status in ('planned', 'active', 'review', 'done')),
  asset_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.system_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_key text not null,
  metric_value numeric not null,
  metric_label text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_logs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.command_agents(id) on delete set null,
  level text not null default 'info' check (level in ('info', 'warning', 'error', 'success')),
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists command_agents_status_idx on public.command_agents(status);
create index if not exists contract_bids_deadline_idx on public.contract_bids(deadline);
create index if not exists content_pipelines_status_idx on public.content_pipelines(status);
create index if not exists audio_releases_status_idx on public.audio_releases(status);
create index if not exists game_milestones_status_idx on public.game_milestones(status);
create index if not exists system_metrics_key_created_idx on public.system_metrics(metric_key, created_at desc);
create index if not exists agent_logs_created_idx on public.agent_logs(created_at desc);

alter table public.command_agents enable row level security;
alter table public.contract_bids enable row level security;
alter table public.content_pipelines enable row level security;
alter table public.audio_releases enable row level security;
alter table public.game_milestones enable row level security;
alter table public.system_metrics enable row level security;
alter table public.agent_logs enable row level security;

drop policy if exists "Authenticated users can read command agents" on public.command_agents;
drop policy if exists "Authenticated users can read contract bids" on public.contract_bids;
drop policy if exists "Authenticated users can read content pipelines" on public.content_pipelines;
drop policy if exists "Authenticated users can read audio releases" on public.audio_releases;
drop policy if exists "Authenticated users can read game milestones" on public.game_milestones;
drop policy if exists "Authenticated users can read system metrics" on public.system_metrics;
drop policy if exists "Authenticated users can read agent logs" on public.agent_logs;

create policy "Authenticated users can read command agents"
  on public.command_agents for select
  to authenticated
  using (true);

create policy "Authenticated users can read contract bids"
  on public.contract_bids for select
  to authenticated
  using (true);

create policy "Authenticated users can read content pipelines"
  on public.content_pipelines for select
  to authenticated
  using (true);

create policy "Authenticated users can read audio releases"
  on public.audio_releases for select
  to authenticated
  using (true);

create policy "Authenticated users can read game milestones"
  on public.game_milestones for select
  to authenticated
  using (true);

create policy "Authenticated users can read system metrics"
  on public.system_metrics for select
  to authenticated
  using (true);

create policy "Authenticated users can read agent logs"
  on public.agent_logs for select
  to authenticated
  using (true);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'command_agents'
  ) then
    alter publication supabase_realtime add table public.command_agents;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'contract_bids'
  ) then
    alter publication supabase_realtime add table public.contract_bids;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'content_pipelines'
  ) then
    alter publication supabase_realtime add table public.content_pipelines;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'audio_releases'
  ) then
    alter publication supabase_realtime add table public.audio_releases;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'game_milestones'
  ) then
    alter publication supabase_realtime add table public.game_milestones;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'system_metrics'
  ) then
    alter publication supabase_realtime add table public.system_metrics;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'agent_logs'
  ) then
    alter publication supabase_realtime add table public.agent_logs;
  end if;
end $$;
