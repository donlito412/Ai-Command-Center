import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agents/orchestrator";
import type { AgentRequest } from "@/lib/agents/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AgentRequest;
    const result = await runAgent(body);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Orchestrator request failed."
      },
      { status: 400 }
    );
  }
}
