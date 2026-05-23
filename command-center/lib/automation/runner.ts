import { supabaseServer } from "@/lib/supabase/server";
import type { WorkflowTriggerRequest, WorkflowTriggerResult } from "./types";

const workflowEndpoints = {
  n8n: process.env.N8N_WEBHOOK_URL,
  make: process.env.MAKE_WEBHOOK_URL,
  agent: process.env.AGENT_WORKFLOW_WEBHOOK_URL
};

function createRunId() {
  return `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function dispatchWebhook(request: WorkflowTriggerRequest, id: string) {
  const endpoint = workflowEndpoints[request.engine];

  if (!endpoint) {
    return {
      status: "queued" as const,
      message: `${request.engine} webhook not configured. Run queued locally.`
    };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.AUTOMATION_WEBHOOK_SECRET
        ? { Authorization: `Bearer ${process.env.AUTOMATION_WEBHOOK_SECRET}` }
        : {})
    },
    body: JSON.stringify({
      id,
      workflow: request.workflow,
      engine: request.engine,
      payload: request.payload ?? {}
    })
  });

  if (!response.ok) {
    return {
      status: "failed" as const,
      message: `${request.engine} webhook failed with ${response.status}.`
    };
  }

  return {
    status: "running" as const,
    message: `${request.engine} workflow dispatched.`
  };
}

async function writeAutomationLog(result: WorkflowTriggerResult) {
  if (!supabaseServer) {
    return;
  }

  await supabaseServer.from("automation_runs").insert({
    run_key: result.id,
    engine: result.engine,
    workflow: result.workflow,
    status: result.status,
    payload: {},
    message: result.message
  });

  await supabaseServer.from("agent_logs").insert({
    level: result.status === "failed" ? "error" : "success",
    message: result.dashboardLog
  });
}

export async function triggerWorkflow(
  request: WorkflowTriggerRequest
): Promise<WorkflowTriggerResult> {
  if (!request.workflow?.trim()) {
    throw new Error("Workflow name is required.");
  }

  const id = createRunId();
  const triggeredAt = new Date().toISOString();
  const dispatch = await dispatchWebhook(request, id);
  const result: WorkflowTriggerResult = {
    id,
    engine: request.engine,
    workflow: request.workflow,
    status: dispatch.status,
    message: dispatch.message,
    triggeredAt,
    dashboardLog: `${request.engine.toUpperCase()} workflow "${request.workflow}" ${dispatch.status}.`
  };

  await writeAutomationLog(result);

  return result;
}
