# AI Cyberpunk Command Center Rebuild Plan

## Project Overview
A stylized AI-powered operational dashboard built around:
- Large visual command center UI
- Agent-based workflows
- Database-driven panels
- Real-time task execution
- AI orchestration
- Automation pipelines
- Touchscreen / kiosk style interface
- Motion graphics + cinematic UI design

## Technology Stack
- **Frontend**: Next.js, React, TailwindCSS, ShadCN UI, Framer Motion
- **Visual Style**: Aceternity UI, Magic UI, React Bits, Framer Motion, Spline/Rive
- **Backend & Database**: Supabase (auth, database, storage, realtime, vectors)
- **AI Layer**: Claude (planning/reasoning), OpenAI (execution/tool calling), Gemini (multimodal/research)
- **Automation**: n8n (primary), Make/Zapier (secondary)
- **Voice AI**: ElevenLabs, OpenAI Realtime, Vapi

## Deployment & Hosting
- **Primary Hosting Platform**: Vercel (integrated directly with GitHub)
- **Deployment Process**: Automatically deploys pushes to the `main` branch.
- **Unused Hosting Platforms**: **Firebase Hosting is NOT used** for this project.

## Suggested Folder Structure
```
/apps
  /dashboard
  /contracts
  /wealth-empire
  /wolf-pacc
  /game-dev
/agents
  /orchestrator
  /contracts
  /research
  /content
  /finance
/workflows
  /n8n
  /make
/ui
  /components
  /animations
  /effects
  /themes
/database
  /schemas
  /memory
/apis
  /openai
  /claude
  /gemini
```
