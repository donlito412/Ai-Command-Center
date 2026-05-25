"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  ActivityEvent,
  AgentRunRecord,
  AudioReleasePlan,
  BeatUpload,
  ContentAsset,
  ContractOpportunity,
  GameTask,
  ProductListResponse,
  WorkflowRunRecord
} from "@/lib/products/types";

type ProductDashboardState = {
  contracts: ContractOpportunity[];
  content: ContentAsset[];
  audio: AudioReleasePlan[];
  beats: BeatUpload[];
  game: GameTask[];
  agents: AgentRunRecord[];
  workflows: WorkflowRunRecord[];
  activity: ActivityEvent[];
};

type MetricOverride = { value: string; detail: string };
type PanelStat = { label: string; value: string };

const emptyState: ProductDashboardState = {
  contracts: [],
  content: [],
  audio: [],
  beats: [],
  game: [],
  agents: [],
  workflows: [],
  activity: []
};

async function fetchProductResource(resource: string) {
  const response = await fetch(`/api/products/${resource}?limit=100`);
  const data = (await response.json()) as ProductListResponse | { error?: string };

  if (!response.ok || "error" in data) {
    throw new Error("Product dashboard load failed.");
  }

  return data as ProductListResponse;
}

function dueWithinWeek(record: { deadline_at?: string | null; due_at?: string | null }) {
  const deadline = record.deadline_at ?? record.due_at;

  if (!deadline) {
    return false;
  }

  const deadlineTime = new Date(deadline).getTime();
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;

  return deadlineTime >= now && deadlineTime <= now + week;
}

export function useCommandCenterRealtime() {
  const [state, setState] = useState<ProductDashboardState>(emptyState);
  const [connectionState, setConnectionState] = useState<
    "fallback" | "connecting" | "live" | "error"
  >("connecting");

  useEffect(() => {
    let mounted = true;

    async function loadDashboardData() {
      try {
        const [
          contractsResult,
          contentResult,
          audioResult,
          beatsResult,
          gameResult,
          agentsResult,
          workflowsResult,
          activityResult
        ] = await Promise.all([
          fetchProductResource("contract_opportunities"),
          fetchProductResource("content_assets"),
          fetchProductResource("audio_release_plans"),
          fetchProductResource("beat_uploads"),
          fetchProductResource("game_tasks"),
          fetchProductResource("agent_runs"),
          fetchProductResource("workflow_runs"),
          fetchProductResource("activity_events")
        ]);

        if (!mounted) {
          return;
        }

        setState({
          contracts: contractsResult.records as ContractOpportunity[],
          content: contentResult.records as ContentAsset[],
          audio: audioResult.records as AudioReleasePlan[],
          beats: beatsResult.records as BeatUpload[],
          game: gameResult.records as GameTask[],
          agents: agentsResult.records as AgentRunRecord[],
          workflows: workflowsResult.records as WorkflowRunRecord[],
          activity: activityResult.records as ActivityEvent[]
        });
        setConnectionState(
          [
            contractsResult,
            contentResult,
            audioResult,
            beatsResult,
            gameResult,
            agentsResult,
            workflowsResult,
            activityResult
          ].every((result) => result.source === "supabase")
            ? "live"
            : "fallback"
        );
      } catch {
        if (mounted) {
          setConnectionState("error");
        }
      }
    }

    void loadDashboardData();

    const interval = window.setInterval(loadDashboardData, 30000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return useMemo(() => {
    const activeContracts = state.contracts.filter((contract) => contract.status === "active");
    const activeAgents = state.agents.filter((agent) => agent.status === "in_progress");
    const queuedWorkflows = state.workflows.filter((workflow) =>
      ["queued", "in_progress", "active"].includes(workflow.status)
    );
    const averageFit =
      state.contracts.length > 0
        ? state.contracts.reduce((sum, contract) => sum + contract.fit_score, 0) /
          state.contracts.length
        : 0;

    const statusMetrics: Record<string, MetricOverride | undefined> = {
      "System Load": {
        value: connectionState === "live" ? "Live" : connectionState === "fallback" ? "Local" : "Checking",
        detail: connectionState === "live" ? "Supabase persistence" : "Fallback data"
      },
      "Running Agents":
        state.agents.length > 0
          ? {
              value: String(activeAgents.length),
              detail: `${state.agents.length} agent runs`
            }
          : undefined,
      "Realtime Feeds": {
        value: String(state.contracts.length + state.content.length + state.audio.length + state.game.length),
        detail: "Product records"
      },
      "Automation Jobs":
        state.workflows.length > 0
          ? {
              value: String(queuedWorkflows.length),
              detail: `${state.workflows.length} workflow runs`
            }
          : undefined
    };

    const panelStats: Record<string, PanelStat[] | undefined> = {
      "Government Contract Center":
        state.contracts.length > 0
          ? [
              { label: "Open Bids", value: String(activeContracts.length) },
              {
                label: "Due This Week",
                value: String(state.contracts.filter(dueWithinWeek).length)
              },
              { label: "Avg Fit", value: `${Math.round(averageFit)}%` }
            ]
          : undefined,
      "AI Wealth Empire":
        state.content.length > 0
          ? [
              { label: "Content Assets", value: String(state.content.length) },
              { label: "Queued", value: String(state.content.filter((item) => item.status === "queued").length) },
              { label: "Scheduled", value: String(state.content.filter((item) => item.status === "scheduled").length) }
            ]
          : undefined,
      "Wolf Pacc Audio":
        state.audio.length + state.beats.length > 0
          ? [
              { label: "Releases", value: String(state.audio.length) },
              { label: "Beat Uploads", value: String(state.beats.length) },
              { label: "Scheduled", value: String(state.audio.filter((item) => item.status === "scheduled").length) }
            ]
          : undefined,
      "Game Development":
        state.game.length > 0
          ? [
              { label: "Tasks", value: String(state.game.length) },
              { label: "In Progress", value: String(state.game.filter((task) => task.status === "in_progress").length) },
              { label: "Blocked", value: String(state.game.filter((task) => task.status === "blocked").length) }
            ]
          : undefined
    };

    return {
      connectionState,
      hasLiveData: state.contracts.length + state.content.length + state.audio.length + state.game.length > 0,
      statusMetrics,
      panelStats,
      agentRows:
        state.agents.length > 0
          ? state.agents.slice(0, 5).map((agent) => ({
              name: agent.agent_name,
              queue: agent.status,
              health: agent.priority.toUpperCase()
            }))
          : undefined,
      activityLog:
        state.activity.length > 0
          ? state.activity.map((event) => event.summary).slice(0, 5)
          : undefined,
      averageHealth: averageFit
    };
  }, [connectionState, state]);
}
