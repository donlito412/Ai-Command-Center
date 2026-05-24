import type { Json } from "@/lib/supabase/types";

export const productResources = [
  "contract_opportunities",
  "content_assets",
  "wealth_leads",
  "wealth_campaigns",
  "audio_release_plans",
  "beat_uploads",
  "game_tasks",
  "agent_runs",
  "workflow_runs",
  "command_notes",
  "activity_events"
] as const;

export type ProductResource = (typeof productResources)[number];

export type ProductModule =
  | "contracts"
  | "wealth"
  | "wolf_pacc"
  | "game_dev"
  | "agents"
  | "workflows"
  | "dashboard";

export type ProductStatus =
  | "new"
  | "active"
  | "reviewing"
  | "saved"
  | "queued"
  | "in_progress"
  | "blocked"
  | "scheduled"
  | "completed"
  | "archived";

export type ProductRecordBase = {
  id: string;
  title: string;
  module: ProductModule;
  status: ProductStatus;
  priority: "low" | "medium" | "high" | "urgent";
  owner: string | null;
  due_at: string | null;
  tags: string[];
  notes: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
};

export type ContractOpportunity = ProductRecordBase & {
  module: "contracts";
  agency: string;
  source: string;
  source_url: string | null;
  opportunity_number: string | null;
  value_estimate: number | null;
  fit_score: number;
  deadline_at: string | null;
};

export type ContentAsset = ProductRecordBase & {
  module: "wealth";
  platform: string;
  asset_type: "short_form" | "long_form" | "email" | "lead_magnet" | "ad" | "script" | "book";
  hook: string | null;
  call_to_action: string | null;
  publish_at: string | null;
};

export type WealthLead = ProductRecordBase & {
  module: "wealth";
  contact_name: string;
  contact_email: string | null;
  source: string;
  offer: string | null;
  value_estimate: number | null;
  follow_up_at: string | null;
};

export type WealthCampaign = ProductRecordBase & {
  module: "wealth";
  campaign_type: "content" | "email" | "ads" | "lead_generation" | "launch";
  channel: string;
  budget: number | null;
  expected_value: number | null;
  start_at: string | null;
  end_at: string | null;
};

export type AudioReleasePlan = ProductRecordBase & {
  module: "wolf_pacc";
  artist: string;
  release_type: "single" | "ep" | "album" | "beat_pack";
  distribution_platform: string | null;
  release_at: string | null;
  asset_url: string | null;
};

export type BeatUpload = ProductRecordBase & {
  module: "wolf_pacc";
  bpm: number | null;
  musical_key: string | null;
  genre: string | null;
  price: number | null;
  license_type: "basic" | "premium" | "exclusive" | null;
  marketplace_url: string | null;
};

export type GameTask = ProductRecordBase & {
  module: "game_dev";
  task_type: "roadmap" | "asset" | "mechanic" | "quest" | "bug" | "playtest" | "build";
  system_area: string | null;
  build_version: string | null;
  asset_url: string | null;
};

export type AgentRunRecord = ProductRecordBase & {
  module: "agents";
  agent_name: string;
  provider: "openai" | "claude" | "gemini" | "local";
  prompt: string;
  output: string | null;
  cost_estimate: number | null;
};

export type WorkflowRunRecord = ProductRecordBase & {
  module: "workflows";
  engine: "n8n" | "make" | "agent";
  workflow_name: string;
  payload: Json;
  result: Json;
  started_at: string | null;
  completed_at: string | null;
};

export type CommandNote = ProductRecordBase & {
  linked_resource: ProductResource | null;
  linked_id: string | null;
  body: string;
};

export type ActivityEvent = {
  id: string;
  module: ProductModule;
  resource: ProductResource;
  record_id: string | null;
  action: "created" | "updated" | "deleted" | "status_changed" | "automation" | "agent_run";
  summary: string;
  metadata: Json;
  created_at: string;
};

export type ProductRecordMap = {
  contract_opportunities: ContractOpportunity;
  content_assets: ContentAsset;
  wealth_leads: WealthLead;
  wealth_campaigns: WealthCampaign;
  audio_release_plans: AudioReleasePlan;
  beat_uploads: BeatUpload;
  game_tasks: GameTask;
  agent_runs: AgentRunRecord;
  workflow_runs: WorkflowRunRecord;
  command_notes: CommandNote;
  activity_events: ActivityEvent;
};

export type ProductRecord = ProductRecordMap[ProductResource];

export type ProductListResponse<Resource extends ProductResource = ProductResource> = {
  resource: Resource;
  source: "supabase" | "fallback";
  records: ProductRecordMap[Resource][];
};

export type ProductMutationResponse<Resource extends ProductResource = ProductResource> = {
  resource: Resource;
  source: "supabase" | "fallback";
  record: ProductRecordMap[Resource];
};
