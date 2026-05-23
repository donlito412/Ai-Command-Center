import type { AgentDefinition } from "./types";
import type { LlmProvider } from "./types";

type ProviderInput = {
  definition: AgentDefinition;
  prompt: string;
};

type ProviderOutput = {
  provider: LlmProvider;
  text: string;
};

const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
const CLAUDE_MODEL = process.env.CLAUDE_MODEL ?? "claude-3-5-sonnet-latest";
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";

function buildUserMessage(input: ProviderInput) {
  return [
    `Agent: ${input.definition.name}`,
    `Mission: ${input.definition.description}`,
    `User request: ${input.prompt}`,
    "Return: summary, recommended next actions, and memory log notes."
  ].join("\n");
}

async function callOpenAI(input: ProviderInput): Promise<ProviderOutput> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      instructions: input.definition.systemPrompt,
      input: buildUserMessage(input)
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status}`);
  }

  const data = await response.json();
  const text =
    data.output_text ??
    data.output?.[0]?.content?.[0]?.text ??
    "OpenAI returned no text output.";

  return { provider: "openai", text };
}

async function callClaude(input: ProviderInput): Promise<ProviderOutput> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 900,
      system: input.definition.systemPrompt,
      messages: [
        {
          role: "user",
          content: buildUserMessage(input)
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude request failed: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text ?? "Claude returned no text output.";

  return { provider: "claude", text };
}

async function callGemini(input: ProviderInput): Promise<ProviderOutput> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: input.definition.systemPrompt }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: buildUserMessage(input) }]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const data = await response.json();
  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    "Gemini returned no text output.";

  return { provider: "gemini", text };
}

function localFallback(input: ProviderInput): ProviderOutput {
  const shortPrompt = input.prompt.trim().slice(0, 160);

  return {
    provider: "local",
    text: [
      `${input.definition.name} received: ${shortPrompt}`,
      "Plan: classify the request, select the execution lane, create a concise task brief, and write a memory log entry.",
      "Action: connect the relevant provider key in Vercel to enable live model execution."
    ].join("\n")
  };
}

export async function runProvider(
  input: ProviderInput,
  preferences: LlmProvider[]
): Promise<ProviderOutput> {
  const errors: string[] = [];

  for (const provider of preferences) {
    try {
      if (provider === "openai") {
        return await callOpenAI(input);
      }
      if (provider === "claude") {
        return await callClaude(input);
      }
      if (provider === "gemini") {
        return await callGemini(input);
      }
      return localFallback(input);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  const fallback = localFallback(input);

  return {
    ...fallback,
    text: `${fallback.text}\nProvider fallback reason: ${errors.join(" | ")}`
  };
}
