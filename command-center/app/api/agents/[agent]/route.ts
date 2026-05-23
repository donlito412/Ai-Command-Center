import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agents/orchestrator";
import { agentDefinitions } from "@/lib/agents/definitions";
import type { AgentId, AgentRequest } from "@/lib/agents/types";

type RouteContext = {
  params: Promise<{
    agent: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { agent } = await context.params;

    if (!Object.hasOwn(agentDefinitions, agent)) {
      return NextResponse.json({ error: "Unknown agent." }, { status: 404 });
    }

    const body = (await request.json()) as AgentRequest;
    const result = await runAgent({
      ...body,
      agent: agent as AgentId
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Agent request failed."
      },
      { status: 400 }
    );
  }
}
