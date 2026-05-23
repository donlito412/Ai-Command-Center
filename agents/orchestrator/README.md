# Main Orchestrator Agent

Endpoint: `POST /api/orchestrator`

Responsibilities:
- Route user prompts to specialized agents
- Plan execution steps
- Return memory log notes
- Fall back locally when provider keys are not configured
