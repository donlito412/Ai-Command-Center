"use client";

import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "./client";
import type {
  AgentLog,
  AudioRelease,
  CommandAgent,
  ContentPipeline,
  ContractBid,
  GameMilestone,
  SystemMetric
} from "./types";

type RealtimeState = {
  agents: CommandAgent[];
  bids: ContractBid[];
  content: ContentPipeline[];
  audio: AudioRelease[];
  game: GameMilestone[];
  metrics: SystemMetric[];
  logs: AgentLog[];
};

type MetricOverride = { value: string; detail: string };
type PanelStat = { label: string; value: string };

const emptyState: RealtimeState = {
  agents: [],
  bids: [],
  content: [],
  audio: [],
  game: [],
  metrics: [],
  logs: []
};

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function dueWithinWeek(bid: ContractBid) {
  if (!bid.deadline) {
    return false;
  }

  const deadline = new Date(bid.deadline).getTime();
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;

  return deadline >= now && deadline <= now + week;
}

export function useCommandCenterRealtime() {
  const [state, setState] = useState<RealtimeState>(emptyState);
  const [connectionState, setConnectionState] = useState<
    "fallback" | "connecting" | "live" | "error"
  >(isSupabaseConfigured ? "connecting" : "fallback");

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client = supabase;
    let mounted = true;

    async function loadDashboardData() {
      try {
        const [
          agentsResult,
          bidsResult,
          contentResult,
          audioResult,
          gameResult,
          metricsResult,
          logsResult
        ] = await Promise.all([
          client.from("command_agents").select("*").order("name"),
          client.from("contract_bids").select("*").order("deadline"),
          client.from("content_pipelines").select("*").order("created_at", {
            ascending: false
          }),
          client.from("audio_releases").select("*").order("created_at", {
            ascending: false
          }),
          client.from("game_milestones").select("*").order("created_at", {
            ascending: false
          }),
          client.from("system_metrics").select("*").order("created_at", {
            ascending: false
          }),
          client
            .from("agent_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(8)
        ]);

        const hasError = [
          agentsResult,
          bidsResult,
          contentResult,
          audioResult,
          gameResult,
          metricsResult,
          logsResult
        ].some((result) => result.error);

        if (!mounted) {
          return;
        }

        if (hasError) {
          setConnectionState("error");
          return;
        }

        setState({
          agents: agentsResult.data ?? [],
          bids: bidsResult.data ?? [],
          content: contentResult.data ?? [],
          audio: audioResult.data ?? [],
          game: gameResult.data ?? [],
          metrics: metricsResult.data ?? [],
          logs: logsResult.data ?? []
        });
        setConnectionState("live");
      } catch {
        if (!mounted) {
          return;
        }
        setConnectionState("error");
      }
    }

    void loadDashboardData();

    const channel = (() => {
      try {
        return client
          .channel("command-center-dashboard")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "command_agents" },
            () => void loadDashboardData()
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "contract_bids" },
            () => void loadDashboardData()
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "content_pipelines" },
            () => void loadDashboardData()
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "audio_releases" },
            () => void loadDashboardData()
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "game_milestones" },
            () => void loadDashboardData()
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "system_metrics" },
            () => void loadDashboardData()
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "agent_logs" },
            () => void loadDashboardData()
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              setConnectionState("live");
            }
          });
      } catch {
        setConnectionState("error");
        return null;
      }
    })();

    return () => {
      mounted = false;
      if (channel) {
        void client.removeChannel(channel);
      }
    };
  }, []);

  return useMemo(() => {
    const runningAgents = state.agents.filter(
      (agent) => agent.status === "running"
    );
    const averageHealth =
      state.agents.length > 0
        ? state.agents.reduce((sum, agent) => sum + agent.health_score, 0) /
          state.agents.length
        : 0;
    const systemLoad = state.metrics.find(
      (metric) => metric.metric_key === "system_load"
    );
    const activeAutomations = state.metrics.find(
      (metric) => metric.metric_key === "automation_jobs"
    );
    const realtimeFeeds = state.metrics.find(
      (metric) => metric.metric_key === "realtime_feeds"
    );
    const leadTotal = state.content.reduce(
      (sum, item) => sum + item.lead_count,
      0
    );
    const contentConversion =
      state.content.length > 0
        ? state.content.reduce((sum, item) => sum + item.conversion_rate, 0) /
          state.content.length
        : 0;
    const beatUploads = state.audio.reduce(
      (sum, release) => sum + release.upload_count,
      0
    );
    const audioGrowth =
      state.audio.length > 0
        ? state.audio.reduce((sum, release) => sum + release.growth_rate, 0) /
          state.audio.length
        : 0;
    const assetCount = state.game.reduce(
      (sum, milestone) => sum + milestone.asset_count,
      0
    );
    const gameSystems = state.game.filter(
      (milestone) => milestone.category === "system"
    );
    const complianceScore =
      state.bids.length > 0
        ? state.bids.reduce((sum, bid) => sum + bid.compliance_score, 0) /
          state.bids.length
        : 0;

    const statusMetrics: Record<string, MetricOverride | undefined> = {
      "System Load": systemLoad
        ? {
            value: formatPercent(systemLoad.metric_value),
            detail: "Live Supabase metric"
          }
        : undefined,
      "Running Agents":
        state.agents.length > 0
          ? {
              value: String(runningAgents.length),
              detail: `${state.agents.length} total agents`
            }
          : undefined,
      "Realtime Feeds": realtimeFeeds
        ? {
            value: String(Math.round(realtimeFeeds.metric_value)),
            detail: "Supabase realtime"
          }
        : undefined,
      "Automation Jobs": activeAutomations
        ? {
            value: String(Math.round(activeAutomations.metric_value)),
            detail: "Live workflow queue"
          }
        : undefined
    };

    const panelStats: Record<string, PanelStat[] | undefined> = {
      "Government Contract Center":
        state.bids.length > 0
          ? [
              { label: "Open Bids", value: String(state.bids.length) },
              {
                label: "Due This Week",
                value: String(state.bids.filter(dueWithinWeek).length)
              },
              { label: "Compliance", value: formatPercent(complianceScore) }
            ]
          : undefined,
      "AI Wealth Empire":
        state.content.length > 0
          ? [
              { label: "Content Assets", value: String(state.content.length) },
              { label: "Leads", value: String(leadTotal) },
              {
                label: "Conversion",
                value: `${contentConversion.toFixed(1)}%`
              }
            ]
          : undefined,
      "Wolf Pacc Audio":
        state.audio.length > 0
          ? [
              { label: "Releases", value: String(state.audio.length) },
              { label: "Beat Uploads", value: String(beatUploads) },
              { label: "Growth", value: `+${audioGrowth.toFixed(0)}%` }
            ]
          : undefined,
      "Game Development":
        state.game.length > 0
          ? [
              { label: "Milestones", value: String(state.game.length) },
              { label: "Assets", value: String(assetCount) },
              { label: "Systems", value: String(gameSystems.length) }
            ]
          : undefined
    };

    return {
      connectionState,
      hasLiveData:
        connectionState === "live" &&
        (state.agents.length > 0 ||
          state.bids.length > 0 ||
          state.content.length > 0 ||
          state.audio.length > 0 ||
          state.game.length > 0),
      statusMetrics,
      panelStats,
      agentRows:
        state.agents.length > 0
          ? state.agents.slice(0, 5).map((agent) => ({
              name: agent.name,
              queue: agent.queue_label,
              health: formatPercent(agent.health_score)
            }))
          : undefined,
      activityLog:
        state.logs.length > 0
          ? state.logs.map((log) => log.message).slice(0, 5)
          : undefined,
      averageHealth
    };
  }, [connectionState, state]);
}
