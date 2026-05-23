import { agentDefinitions } from "./definitions";
import { runProvider } from "./providers";
import type { AgentId, AgentRequest, AgentResult } from "./types";

const routingRules: Array<{ agent: AgentId; terms: string[] }> = [
  {
    agent: "contracts",
    terms: ["contract", "bid", "proposal", "sam.gov", "vendor", "compliance"]
  },
  {
    agent: "research",
    terms: ["research", "source", "scan", "study", "market", "competitor"]
  },
  {
    agent: "media-wealth",
    terms: ["content", "lead", "wealth", "offer", "music", "release", "audio"]
  }
];

function routeAgents(request: AgentRequest): AgentId[] {
  if (request.agent && request.agent !== "orchestrator") {
    return ["orchestrator", request.agent];
  }

  const prompt = request.prompt.toLowerCase();
  const matched: AgentId[] = routingRules
    .filter((rule) => rule.terms.some((term) => prompt.includes(term)))
    .map((rule) => rule.agent);
  const fallbackRoute: AgentId[] = ["research"];

  return ["orchestrator", ...(matched.length > 0 ? matched : fallbackRoute)];
}

function actionsFromText(text: string, route: AgentId[]) {
  const lines = text
    .split("\n")
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter(Boolean);

  const defaults = [
    `Route through ${route.map((agent) => agentDefinitions[agent].name).join(" -> ")}`,
    "Write result into command center memory",
    "Update execution log for realtime dashboard"
  ];

  return [...lines.slice(0, 3), ...defaults].slice(0, 4);
}

export async function runAgent(request: AgentRequest): Promise<AgentResult> {
  const prompt = request.prompt.trim();

  if (!prompt) {
    throw new Error("Prompt is required.");
  }

  const route = routeAgents(request);
  const targetAgent = route[route.length - 1];
  const definition = agentDefinitions[targetAgent];
  const providerOutput = await runProvider(
    { definition, prompt },
    definition.modelPreference
  );

  return {
    agent: targetAgent,
    provider: providerOutput.provider,
    route,
    summary: `${definition.name} handled the request via ${providerOutput.provider}.`,
    output: providerOutput.text,
    actions: actionsFromText(providerOutput.text, route),
    memoryLog: [
      {
        title: "Route",
        detail: route.map((agent) => agentDefinitions[agent].name).join(" -> ")
      },
      {
        title: "Provider",
        detail: providerOutput.provider
      },
      {
        title: "Prompt",
        detail: prompt.slice(0, 180)
      }
    ]
  };
}
