export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CommandAgent = {
  id: string;
  name: string;
  role: string;
  status: "idle" | "running" | "paused" | "error";
  queue_label: string;
  health_score: number;
  last_run_at: string | null;
  created_at: string;
};

export type ContractBid = {
  id: string;
  title: string;
  agency: string;
  status: "watching" | "drafting" | "submitted" | "awarded" | "lost";
  deadline: string | null;
  compliance_score: number;
  value_estimate: number | null;
  created_at: string;
};

export type ContentPipeline = {
  id: string;
  title: string;
  platform: string;
  status: "idea" | "queued" | "drafting" | "scheduled" | "published";
  lead_count: number;
  conversion_rate: number;
  created_at: string;
};

export type AudioRelease = {
  id: string;
  title: string;
  release_type: "single" | "beat" | "pack" | "album";
  status: "draft" | "queued" | "distributed" | "promoting";
  upload_count: number;
  growth_rate: number;
  created_at: string;
};

export type GameMilestone = {
  id: string;
  title: string;
  category: "roadmap" | "asset" | "quest" | "system";
  status: "planned" | "active" | "review" | "done";
  asset_count: number;
  created_at: string;
};

export type SystemMetric = {
  id: string;
  metric_key: string;
  metric_value: number;
  metric_label: string;
  context: Json;
  created_at: string;
};

export type AgentLog = {
  id: string;
  agent_id: string | null;
  level: "info" | "warning" | "error" | "success";
  message: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      command_agents: {
        Row: CommandAgent;
        Insert: Omit<CommandAgent, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<CommandAgent>;
      };
      contract_bids: {
        Row: ContractBid;
        Insert: Omit<ContractBid, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ContractBid>;
      };
      content_pipelines: {
        Row: ContentPipeline;
        Insert: Omit<ContentPipeline, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ContentPipeline>;
      };
      audio_releases: {
        Row: AudioRelease;
        Insert: Omit<AudioRelease, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<AudioRelease>;
      };
      game_milestones: {
        Row: GameMilestone;
        Insert: Omit<GameMilestone, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<GameMilestone>;
      };
      system_metrics: {
        Row: SystemMetric;
        Insert: Omit<SystemMetric, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<SystemMetric>;
      };
      agent_logs: {
        Row: AgentLog;
        Insert: Omit<AgentLog, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<AgentLog>;
      };
    };
  };
};
