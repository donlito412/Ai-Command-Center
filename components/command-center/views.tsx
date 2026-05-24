"use client";

import { FormEvent, ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AudioWaveform,
  BadgeCheck,
  BarChart3,
  Bot,
  Boxes,
  BriefcaseBusiness,
  CalendarClock,
  CircleDollarSign,
  ClipboardCheck,
  DatabaseZap,
  FileSearch,
  Gauge,
  LayoutDashboard,
  Megaphone,
  Music2,
  Network,
  RadioTower,
  Rocket,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UploadCloud,
  Volume2,
  VolumeX,
  Workflow,
  type LucideIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { AgentResult } from "@/lib/agents/types";
import type {
  WorkflowEngine,
  WorkflowTriggerResult
} from "@/lib/automation/types";
import { useHudAudio } from "@/lib/audio/use-hud-audio";
import { useCommandCenterRealtime } from "@/lib/supabase/use-command-center-realtime";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Contracts", href: "/contracts", icon: BriefcaseBusiness },
  { label: "Wealth Empire", href: "/wealth-empire", icon: CircleDollarSign },
  { label: "Wolf Pacc", href: "/wolf-pacc", icon: Music2 },
  { label: "Game Dev", href: "/game-dev", icon: Boxes },
  { label: "Agents", href: "/agents", icon: Bot },
  { label: "Workflows", href: "/workflows", icon: Workflow }
];

const statusMetrics = [
  { label: "System Load", value: "68%", detail: "Stable", icon: Gauge },
  { label: "Running Agents", value: "12", detail: "5 active queues", icon: Bot },
  { label: "Realtime Feeds", value: "24", detail: "Supabase-ready", icon: RadioTower },
  { label: "Automation Jobs", value: "39", detail: "n8n pipeline", icon: Network }
];

const activityLog = [
  "Research agent indexed contract sources",
  "Content queue prepared 18 campaign prompts",
  "Audio release tracker synced upload checklist",
  "Game roadmap moved combat prototype to review",
  "Finance monitor refreshed lead value estimates"
];

const agentRows = [
  { name: "Orchestrator", queue: "Routing tasks", health: "98%" },
  { name: "Contracts", queue: "Reviewing bids", health: "94%" },
  { name: "Research", queue: "Scanning sources", health: "91%" },
  { name: "Content", queue: "Building campaigns", health: "96%" },
  { name: "Finance", queue: "Tracking estimates", health: "89%" }
];

const panelData = [
  {
    title: "Government Contract Center",
    subtitle: "Bid tracking, vendor compliance, deadline control",
    icon: BriefcaseBusiness,
    accent: "text-primary",
    stats: [
      { label: "Open Bids", value: "14" },
      { label: "Due This Week", value: "5" },
      { label: "Compliance", value: "92%" }
    ],
    rows: [
      { label: "SAM.gov bid scan", value: "Active", icon: FileSearch },
      { label: "Vendor docs", value: "Verified", icon: ShieldCheck },
      { label: "Deadline radar", value: "3 urgent", icon: CalendarClock }
    ]
  },
  {
    title: "AI Wealth Empire",
    subtitle: "Content pipeline, lead generation, analytics",
    icon: CircleDollarSign,
    accent: "text-secondary",
    stats: [
      { label: "Content Assets", value: "42" },
      { label: "Leads", value: "286" },
      { label: "Conversion", value: "8.4%" }
    ],
    rows: [
      { label: "Short-form queue", value: "Ready", icon: Megaphone },
      { label: "Lead magnets", value: "6 live", icon: Target },
      { label: "Revenue view", value: "Tracking", icon: BarChart3 }
    ]
  },
  {
    title: "Wolf Pacc Audio",
    subtitle: "Release pipeline, beat uploads, social growth",
    icon: AudioWaveform,
    accent: "text-accent",
    stats: [
      { label: "Releases", value: "9" },
      { label: "Beat Uploads", value: "31" },
      { label: "Growth", value: "+18%" }
    ],
    rows: [
      { label: "Distribution pack", value: "Queued", icon: UploadCloud },
      { label: "Beat marketplace", value: "Synced", icon: Music2 },
      { label: "Social monitors", value: "Online", icon: Sparkles }
    ]
  },
  {
    title: "Game Development",
    subtitle: "Roadmap tracker, asset logs, quest systems",
    icon: Trophy,
    accent: "text-chart-4",
    stats: [
      { label: "Milestones", value: "7" },
      { label: "Assets", value: "128" },
      { label: "Systems", value: "11" }
    ],
    rows: [
      { label: "Roadmap sprint", value: "Phase 2", icon: Rocket },
      { label: "Asset log", value: "Updated", icon: ClipboardCheck },
      { label: "Quest monitor", value: "Drafting", icon: ScrollText }
    ]
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 }
};

const staggerGroup = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

function Shell({
  title,
  eyebrow,
  description,
  children
}: {
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const realtime = useCommandCenterRealtime();
  const hudAudio = useHudAudio();

  return (
    <main className="touch-kiosk min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 animated-grid bg-[linear-gradient(90deg,rgba(45,212,191,0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(236,72,153,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(45,212,191,0.18),transparent_30%),radial-gradient(circle_at_88%_22%,rgba(236,72,153,0.13),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.12),rgba(2,6,23,0.92))]" />
      <div className="scanline-layer" />
      <div className="crt-noise-layer" />
      <div className="cinematic-vignette" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[248px_1fr]">
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="holo-sidebar min-w-0 border-b border-border/70 bg-sidebar/76 px-5 py-5 backdrop-blur lg:border-b-0 lg:border-r"
        >
          <div className="relative z-10 flex items-center gap-3">
            <div className="pulse-node border border-primary/45 bg-primary/10 p-2 text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold">AI Command</p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Control Layer
              </p>
            </div>
          </div>

          <nav className="relative z-10 mt-8 flex flex-wrap gap-2 lg:block lg:space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <motion.div key={item.href} whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    asChild
                    variant={active ? "default" : "ghost"}
                    className="h-10 justify-start rounded-md px-3 lg:w-full"
                    onPointerEnter={() => hudAudio.play("click")}
                  >
                    <Link href={item.href} onClick={() => hudAudio.play("transition")}>
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                </motion.div>
              );
            })}
          </nav>

        </motion.aside>

        <section className="min-w-0 px-5 py-5 sm:px-7 lg:px-8">
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
            className="flex flex-col gap-4 border-b border-border/70 pb-5 xl:flex-row xl:items-center xl:justify-between"
          >
            <div>
              <div className="glow-label mb-3 inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                <DatabaseZap className="h-3.5 w-3.5" />
                {eyebrow} / Supabase {realtime.connectionState}
              </div>
              <h1 className="font-display text-3xl font-semibold sm:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="icon"
                aria-label={hudAudio.enabled ? "Mute HUD audio" : "Enable HUD audio"}
                aria-pressed={hudAudio.enabled}
                onClick={() => {
                  hudAudio.play("click");
                  hudAudio.toggle();
                }}
              >
                {hudAudio.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button asChild onPointerEnter={() => hudAudio.play("click")}>
                <Link href="/agents" onClick={() => hudAudio.play("transition")}>
                  <Bot className="h-4 w-4" />
                  Run Agents
                </Link>
              </Button>
              <Button asChild variant="outline" onPointerEnter={() => hudAudio.play("click")}>
                <Link href="/workflows" onClick={() => hudAudio.play("transition")}>
                  <Workflow className="h-4 w-4" />
                  View Pipelines
                </Link>
              </Button>
            </div>
          </motion.header>

          {children}
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -4, scale: 1.01 }}>
      <Card className="hud-panel holo-card bg-card/72 py-5 backdrop-blur">
        <CardContent className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
          </div>
          <div className="pulse-node border border-primary/35 bg-primary/10 p-3 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function BusinessPanel({
  panel,
  liveStats
}: {
  panel: (typeof panelData)[number];
  liveStats?: { label: string; value: string }[];
}) {
  const stats = liveStats ?? panel.stats;

  return (
    <motion.div variants={fadeUp} whileHover={{ y: -5 }}>
      <Card className="hud-panel holo-card bg-card/78 backdrop-blur">
        <CardHeader>
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className={`border border-current/40 bg-current/10 p-2 ${panel.accent}`}>
                <panel.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base">{panel.title}</CardTitle>
                <CardDescription>{panel.subtitle}</CardDescription>
              </div>
            </div>
            <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="border border-border/70 bg-background/40 px-3 py-2">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-1 font-display text-xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {panel.rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                <div className="flex min-w-0 items-center gap-3">
                  <row.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm">{row.label}</span>
                </div>
                <span className="shrink-0 text-sm font-medium text-primary">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RadarDisplay() {
  return (
    <div className="radar-shell">
      <div className="radar-grid" />
      <div className="radar-sweep" />
      <div className="radar-ring radar-ring-one" />
      <div className="radar-ring radar-ring-two" />
      <span className="radar-dot radar-dot-one" />
      <span className="radar-dot radar-dot-two" />
      <span className="radar-dot radar-dot-three" />
    </div>
  );
}

function AgentChatPanel() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<AgentResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const hudAudio = useHudAudio();

  async function submitPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!prompt.trim()) {
      hudAudio.play("alert");
      return;
    }

    setIsRunning(true);
    setError("");
    hudAudio.play("scan");

    try {
      const response = await fetch("/api/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Agent request failed.");
      }

      setResult(data as AgentResult);
      hudAudio.play("transition");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Agent request failed.");
      hudAudio.play("alert");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <Card className="hud-panel holo-card bg-card/76 backdrop-blur">
      <CardHeader className="relative z-10">
        <CardTitle>Operational Agent Chat</CardTitle>
        <CardDescription>Route prompts through the orchestrator and specialized agents</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10 space-y-4">
        <form className="grid gap-3" onSubmit={submitPrompt}>
          <textarea
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
              hudAudio.play("click");
            }}
            placeholder="Send a command to the orchestrator..."
            className="min-h-28 resize-none rounded-md border border-border/70 bg-background/55 px-3 py-3 text-sm outline-none ring-ring/40 transition focus:ring-2"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isRunning} onPointerEnter={() => hudAudio.play("click")}>
              <Bot className="h-4 w-4" />
              {isRunning ? "Routing..." : "Route Prompt"}
            </Button>
            {result ? (
              <span className="text-xs uppercase tracking-[0.18em] text-primary">
                {result.provider} / {result.agent}
              </span>
            ) : null}
          </div>
        </form>

        {error ? (
          <div className="border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {result ? (
          <div className="space-y-4">
            <div className="border border-border/70 bg-background/40 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Output</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6">{result.output}</p>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="border border-border/70 bg-background/40 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Route</p>
                <p className="mt-2 text-sm">{result.route.join(" -> ")}</p>
              </div>
              <div className="border border-border/70 bg-background/40 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Actions</p>
                <ul className="mt-2 space-y-2 text-sm">
                  {result.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function WorkflowControlPanel() {
  const [engine, setEngine] = useState<WorkflowEngine>("n8n");
  const [workflow, setWorkflow] = useState("agent-execution-pipeline");
  const [result, setResult] = useState<WorkflowTriggerResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const hudAudio = useHudAudio();

  async function triggerAutomation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsRunning(true);
    setError("");
    hudAudio.play("scan");

    try {
      const response = await fetch("/api/workflows/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          engine,
          workflow,
          payload: {
            source: "command-center",
            requestedBy: "dashboard"
          }
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Workflow trigger failed.");
      }

      setResult(data as WorkflowTriggerResult);
      hudAudio.play("transition");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Workflow trigger failed."
      );
      hudAudio.play("alert");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <Card className="hud-panel holo-card bg-card/76 backdrop-blur lg:col-span-3">
      <CardHeader className="relative z-10">
        <CardTitle>Automation Trigger Console</CardTitle>
        <CardDescription>
          Dispatch workflow runs to n8n, Make, or agent webhooks
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10 space-y-4">
        <form className="grid gap-3 lg:grid-cols-[180px_1fr_auto]" onSubmit={triggerAutomation}>
          <select
            value={engine}
            onChange={(event) => {
              setEngine(event.target.value as WorkflowEngine);
              hudAudio.play("click");
            }}
            className="h-10 rounded-md border border-border/70 bg-background/55 px-3 text-sm outline-none ring-ring/40 transition focus:ring-2"
          >
            <option value="n8n">n8n</option>
            <option value="make">Make</option>
            <option value="agent">Agent</option>
          </select>
          <input
            value={workflow}
            onChange={(event) => {
              setWorkflow(event.target.value);
              hudAudio.play("click");
            }}
            className="h-10 rounded-md border border-border/70 bg-background/55 px-3 text-sm outline-none ring-ring/40 transition focus:ring-2"
          />
          <Button type="submit" disabled={isRunning} onPointerEnter={() => hudAudio.play("click")}>
            <Workflow className="h-4 w-4" />
            {isRunning ? "Triggering..." : "Trigger Run"}
          </Button>
        </form>

        {error ? (
          <div className="border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {result ? (
          <div className="grid gap-3 lg:grid-cols-4">
            {[
              ["Run ID", result.id],
              ["Engine", result.engine],
              ["Status", result.status],
              ["Message", result.message]
            ].map(([label, value]) => (
              <div key={label} className="border border-border/70 bg-background/40 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 break-words text-sm">{value}</p>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function DashboardContent() {
  const realtime = useCommandCenterRealtime();
  const dashboardStatusMetrics = statusMetrics.map((metric) => ({
    ...metric,
    ...(realtime.statusMetrics[metric.label] ?? {})
  }));
  const dashboardActivityLog = realtime.activityLog ?? activityLog;
  const dashboardAgentRows = realtime.agentRows ?? agentRows;

  return (
    <>
      <motion.div variants={staggerGroup} initial="hidden" animate="visible" className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStatusMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </motion.div>

      <motion.div variants={staggerGroup} initial="hidden" animate="visible" className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.div variants={fadeUp}>
          <Card className="hud-panel holo-card bg-card/76 backdrop-blur">
            <CardHeader className="relative z-10">
              <CardTitle>Main Dashboard</CardTitle>
              <CardDescription>System status, running agents, logs, contracts, wealth, and audio stats</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 grid gap-5 lg:grid-cols-3">
              <div className="space-y-3 lg:col-span-2">
                <div className="grid gap-3 sm:grid-cols-3">
                  {["Contracts", "Wealth", "Audio"].map((label, index) => (
                    <motion.div key={label} className="hud-panel border border-border/70 bg-background/40 p-4" whileHover={{ y: -3 }}>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                      <p className="mt-3 font-display text-2xl font-semibold">{[14, 286, 31][index]}</p>
                      <div className="mt-3 h-2 bg-muted">
                        <div className="meter-fill h-full bg-primary shadow-[0_0_18px_hsl(var(--primary)/0.6)]" style={{ width: `${[72, 58, 84][index]}%` }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="hud-panel border border-border/70 bg-background/40 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="font-medium">Agent Throughput</p>
                    <span className="text-sm text-primary">Live model</span>
                  </div>
                  <div className="flex h-36 items-end gap-2">
                    {[58, 82, 44, 76, 64, 92, 70, 88, 52, 80, 68, 94].map((height, index) => (
                      <div key={`${height}-${index}`} className="flex-1 bg-primary/20">
                        <div className="bar-pulse mt-auto w-full bg-primary" style={{ height: `${height}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium">Execution Log</p>
                {dashboardActivityLog.map((entry) => (
                  <motion.div key={entry} className="hud-panel border border-border/60 bg-background/35 px-3 py-2 text-sm text-muted-foreground" whileHover={{ x: 4 }}>
                    {entry}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="hud-panel holo-card bg-card/76 backdrop-blur">
            <CardHeader className="relative z-10">
              <CardTitle>Running Agents</CardTitle>
              <CardDescription>Queue status and operational health</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-5">
              <RadarDisplay />
              {dashboardAgentRows.map((agent) => (
                <motion.div key={agent.name} className="grid grid-cols-[1fr_auto] gap-3 border-b border-border/55 pb-4 last:border-0 last:pb-0" whileHover={{ x: 3 }}>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">{agent.queue}</p>
                  </div>
                  <span className="font-display text-lg text-primary">{agent.health}</span>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
}

function SinglePanelPage({ panelTitle }: { panelTitle: string }) {
  const realtime = useCommandCenterRealtime();
  const panel = panelData.find((item) => item.title === panelTitle) ?? panelData[0];

  return (
    <motion.div variants={staggerGroup} initial="hidden" animate="visible" className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.75fr]">
      <BusinessPanel panel={panel} liveStats={realtime.panelStats[panel.title]} />
      <Card className="hud-panel holo-card bg-card/76 backdrop-blur">
        <CardHeader className="relative z-10">
          <CardTitle>Operations Queue</CardTitle>
          <CardDescription>{panel.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 space-y-3">
          {panel.rows.map((row) => (
            <div key={row.label} className="border border-border/70 bg-background/40 p-4">
              <div className="flex items-center gap-3">
                <row.icon className="h-4 w-4 text-primary" />
                <p className="font-medium">{row.label}</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{row.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardHome() {
  return (
    <Shell
      title="AI Cyberpunk Command Center"
      eyebrow="Operational Dashboard"
      description="Unified control surface for agents, contract pursuit, wealth systems, audio operations, game development, and automation."
    >
      <DashboardContent />
    </Shell>
  );
}

export function ContractsView() {
  return (
    <Shell title="Government Contract Center" eyebrow="Contracts" description="Bid tracking, vendor compliance, and deadline control.">
      <SinglePanelPage panelTitle="Government Contract Center" />
    </Shell>
  );
}

export function WealthEmpireView() {
  return (
    <Shell title="AI Wealth Empire" eyebrow="Wealth Empire" description="Content pipeline, lead generation, and analytics operations.">
      <SinglePanelPage panelTitle="AI Wealth Empire" />
    </Shell>
  );
}

export function WolfPaccView() {
  return (
    <Shell title="Wolf Pacc Audio" eyebrow="Wolf Pacc" description="Release pipeline, beat uploads, and social growth monitors.">
      <SinglePanelPage panelTitle="Wolf Pacc Audio" />
    </Shell>
  );
}

export function GameDevView() {
  return (
    <Shell title="Game Development" eyebrow="Game Dev" description="Roadmap tracker, asset logs, and quest system monitoring.">
      <SinglePanelPage panelTitle="Game Development" />
    </Shell>
  );
}

export function AgentsView() {
  return (
    <Shell title="Agent Orchestrator" eyebrow="Agents" description="Route prompts through the orchestrator and specialized AI agents.">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-6">
        <AgentChatPanel />
      </motion.div>
    </Shell>
  );
}

export function WorkflowsView() {
  return (
    <Shell title="Workflow Automation" eyebrow="Workflows" description="Automation pipeline control for n8n, Make, and connected agent execution.">
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {["n8n Primary", "Make Secondary", "Agent Triggers"].map((label) => (
          <Card key={label} className="hud-panel holo-card bg-card/76 backdrop-blur">
            <CardHeader className="relative z-10">
              <CardTitle>{label}</CardTitle>
              <CardDescription>Ready for TASK-008 integration.</CardDescription>
            </CardHeader>
          </Card>
        ))}
        <WorkflowControlPanel />
      </div>
    </Shell>
  );
}
