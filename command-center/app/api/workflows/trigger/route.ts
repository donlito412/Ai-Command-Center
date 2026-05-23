import { NextResponse } from "next/server";
import { triggerWorkflow } from "@/lib/automation/runner";
import type { WorkflowTriggerRequest } from "@/lib/automation/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WorkflowTriggerRequest;
    const result = await triggerWorkflow(body);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Workflow trigger failed."
      },
      { status: 400 }
    );
  }
}
