import type { ProductRecordMap } from "./types";

const now = "2026-05-24T00:00:00.000Z";

export const fallbackProductData: {
  [Resource in keyof ProductRecordMap]: ProductRecordMap[Resource][];
} = {
  contract_opportunities: [
    {
      id: "contract-local-ai-services",
      title: "AI Automation Services Opportunity",
      module: "contracts",
      status: "active",
      priority: "high",
      owner: "Ai Wealth Empire",
      due_at: "2026-06-14T21:00:00.000Z",
      tags: ["ai", "automation", "services"],
      notes: "Local fallback record for contract workflow testing.",
      metadata: {},
      created_at: now,
      updated_at: now,
      agency: "City Procurement",
      source: "local-fallback",
      source_url: null,
      opportunity_number: "LOCAL-AI-001",
      value_estimate: 25000,
      fit_score: 92,
      deadline_at: "2026-06-14T21:00:00.000Z"
    }
  ],
  content_assets: [
    {
      id: "content-ai-workflows-short",
      title: "AI workflow short-form campaign",
      module: "wealth",
      status: "queued",
      priority: "medium",
      owner: "AI Wealth Empire",
      due_at: null,
      tags: ["short-form", "ai", "lead-gen"],
      notes: "Seed asset for content workflow testing.",
      metadata: {},
      created_at: now,
      updated_at: now,
      platform: "TikTok",
      asset_type: "short_form",
      hook: "Stop doing manual business tasks.",
      call_to_action: "Book the AI workflow audit.",
      publish_at: null
    }
  ],
  wealth_leads: [],
  wealth_campaigns: [],
  audio_release_plans: [],
  beat_uploads: [],
  game_tasks: [],
  agent_runs: [],
  workflow_runs: [],
  command_notes: [],
  activity_events: []
};
