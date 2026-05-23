export type WorkflowEngine = "n8n" | "make" | "agent";

export type WorkflowStatus = "queued" | "running" | "completed" | "failed";

export type WorkflowTriggerRequest = {
  engine: WorkflowEngine;
  workflow: string;
  payload?: Record<string, string | number | boolean | null>;
};

export type WorkflowTriggerResult = {
  id: string;
  engine: WorkflowEngine;
  workflow: string;
  status: WorkflowStatus;
  message: string;
  triggeredAt: string;
  dashboardLog: string;
};
