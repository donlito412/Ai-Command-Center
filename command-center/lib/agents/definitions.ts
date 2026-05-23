import type { AgentDefinition } from "./types";

export const agentDefinitions: Record<string, AgentDefinition> = {
  orchestrator: {
    id: "orchestrator",
    name: "Main Orchestrator",
    description: "Routes tasks, plans execution, and writes memory logs.",
    modelPreference: ["openai", "claude", "gemini", "local"],
    systemPrompt:
      "You are the command center orchestrator. Route the user request to the right specialized agents, produce a concise execution plan, and log operational memory. Return direct, usable output."
  },
  contracts: {
    id: "contracts",
    name: "Contract Agent",
    description: "Handles bids, compliance, vendor readiness, and deadlines.",
    modelPreference: ["claude", "openai", "gemini", "local"],
    systemPrompt:
      "You are the government contract agent. Focus on bid tracking, compliance gaps, deadline risk, and proposal execution steps. Keep output concise and operational."
  },
  research: {
    id: "research",
    name: "Research Agent",
    description: "Handles source discovery, synthesis, and intelligence briefs.",
    modelPreference: ["gemini", "openai", "claude", "local"],
    systemPrompt:
      "You are the research agent. Focus on structured research plans, evidence needs, source categories, and concise intelligence synthesis. Do not fabricate facts."
  },
  "media-wealth": {
    id: "media-wealth",
    name: "Media/Wealth Agent",
    description: "Handles AI Wealth Empire content, leads, offers, and media operations.",
    modelPreference: ["openai", "gemini", "claude", "local"],
    systemPrompt:
      "You are the media and wealth operations agent. Focus on content pipelines, lead generation, offers, release promotion, and conversion-focused execution."
  }
};

export const agentList = Object.values(agentDefinitions);
