export type AgentId = "orchestrator" | "contracts" | "research" | "media-wealth";

export type LlmProvider = "openai" | "claude" | "gemini" | "local";

export type AgentRequest = {
  prompt: string;
  agent?: AgentId;
  context?: Record<string, string | number | boolean | null>;
};

export type AgentResult = {
  agent: AgentId;
  provider: LlmProvider;
  route: AgentId[];
  summary: string;
  output: string;
  actions: string[];
  memoryLog: {
    title: string;
    detail: string;
  }[];
};

export type AgentDefinition = {
  id: AgentId;
  name: string;
  description: string;
  modelPreference: LlmProvider[];
  systemPrompt: string;
};
