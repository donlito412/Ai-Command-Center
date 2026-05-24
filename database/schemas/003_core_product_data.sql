create extension if not exists pgcrypto;

create table if not exists public.contract_opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  module text not null default 'contracts' check (module = 'contracts'),
  status text not null default 'new',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  owner text,
  due_at timestamptz,
  tags text[] not null default '{}',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  agency text not null default '',
  source text not null default '',
  source_url text,
  opportunity_number text,
  value_estimate numeric,
  fit_score numeric not null default 0 check (fit_score >= 0 and fit_score <= 100),
  deadline_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  module text not null default 'wealth' check (module = 'wealth'),
  status text not null default 'new',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  owner text,
  due_at timestamptz,
  tags text[] not null default '{}',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  platform text not null default '',
  asset_type text not null default 'short_form' check (asset_type in ('short_form', 'long_form', 'email', 'lead_magnet', 'ad', 'script', 'book')),
  hook text,
  call_to_action text,
  publish_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wealth_leads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  module text not null default 'wealth' check (module = 'wealth'),
  status text not null default 'new',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  owner text,
  due_at timestamptz,
  tags text[] not null default '{}',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  contact_name text not null default '',
  contact_email text,
  source text not null default '',
  offer text,
  value_estimate numeric,
  follow_up_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wealth_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  module text not null default 'wealth' check (module = 'wealth'),
  status text not null default 'new',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  owner text,
  due_at timestamptz,
  tags text[] not null default '{}',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  campaign_type text not null default 'content' check (campaign_type in ('content', 'email', 'ads', 'lead_generation', 'launch')),
  channel text not null default '',
  budget numeric,
  expected_value numeric,
  start_at timestamptz,
  end_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audio_release_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  module text not null default 'wolf_pacc' check (module = 'wolf_pacc'),
  status text not null default 'new',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  owner text,
  due_at timestamptz,
  tags text[] not null default '{}',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  artist text not null default '',
  release_type text not null default 'single' check (release_type in ('single', 'ep', 'album', 'beat_pack')),
  distribution_platform text,
  release_at timestamptz,
  asset_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.beat_uploads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  module text not null default 'wolf_pacc' check (module = 'wolf_pacc'),
  status text not null default 'new',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  owner text,
  due_at timestamptz,
  tags text[] not null default '{}',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  bpm integer,
  musical_key text,
  genre text,
  price numeric,
  license_type text check (license_type in ('basic', 'premium', 'exclusive')),
  marketplace_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  module text not null default 'game_dev' check (module = 'game_dev'),
  status text not null default 'new',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  owner text,
  due_at timestamptz,
  tags text[] not null default '{}',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  task_type text not null default 'roadmap' check (task_type in ('roadmap', 'asset', 'mechanic', 'quest', 'bug', 'playtest', 'build')),
  system_area text,
  build_version text,
  asset_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  module text not null default 'agents' check (module = 'agents'),
  status text not null default 'new',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  owner text,
  due_at timestamptz,
  tags text[] not null default '{}',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  agent_name text not null default '',
  provider text not null default 'local' check (provider in ('openai', 'claude', 'gemini', 'local')),
  prompt text not null default '',
  output text,
  cost_estimate numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  module text not null default 'workflows' check (module = 'workflows'),
  status text not null default 'new',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  owner text,
  due_at timestamptz,
  tags text[] not null default '{}',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  engine text not null default 'agent' check (engine in ('n8n', 'make', 'agent')),
  workflow_name text not null default '',
  payload jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.command_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  module text not null default 'dashboard' check (module in ('contracts', 'wealth', 'wolf_pacc', 'game_dev', 'agents', 'workflows', 'dashboard')),
  status text not null default 'active',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  owner text,
  due_at timestamptz,
  tags text[] not null default '{}',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  linked_resource text,
  linked_id uuid,
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  module text not null check (module in ('contracts', 'wealth', 'wolf_pacc', 'game_dev', 'agents', 'workflows', 'dashboard')),
  resource text not null,
  record_id uuid,
  action text not null check (action in ('created', 'updated', 'deleted', 'status_changed', 'automation', 'agent_run')),
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists contract_opportunities_status_idx on public.contract_opportunities(status, updated_at desc);
create index if not exists contract_opportunities_deadline_idx on public.contract_opportunities(deadline_at);
create index if not exists content_assets_status_idx on public.content_assets(status, updated_at desc);
create index if not exists wealth_leads_status_idx on public.wealth_leads(status, updated_at desc);
create index if not exists wealth_campaigns_status_idx on public.wealth_campaigns(status, updated_at desc);
create index if not exists audio_release_plans_status_idx on public.audio_release_plans(status, updated_at desc);
create index if not exists beat_uploads_status_idx on public.beat_uploads(status, updated_at desc);
create index if not exists game_tasks_status_idx on public.game_tasks(status, updated_at desc);
create index if not exists agent_runs_status_idx on public.agent_runs(status, updated_at desc);
create index if not exists workflow_runs_status_idx on public.workflow_runs(status, updated_at desc);
create index if not exists command_notes_linked_idx on public.command_notes(linked_resource, linked_id);
create index if not exists activity_events_created_idx on public.activity_events(created_at desc);

alter table public.contract_opportunities enable row level security;
alter table public.content_assets enable row level security;
alter table public.wealth_leads enable row level security;
alter table public.wealth_campaigns enable row level security;
alter table public.audio_release_plans enable row level security;
alter table public.beat_uploads enable row level security;
alter table public.game_tasks enable row level security;
alter table public.agent_runs enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.command_notes enable row level security;
alter table public.activity_events enable row level security;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'contract_opportunities',
    'content_assets',
    'wealth_leads',
    'wealth_campaigns',
    'audio_release_plans',
    'beat_uploads',
    'game_tasks',
    'agent_runs',
    'workflow_runs',
    'command_notes',
    'activity_events'
  ]
  loop
    execute format('drop policy if exists "Authenticated users can manage %I" on public.%I', table_name, table_name);
    execute format(
      'create policy "Authenticated users can manage %I" on public.%I for all to authenticated using (true) with check (true)',
      table_name,
      table_name
    );

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = table_name
    ) then
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    end if;
  end loop;
end $$;
