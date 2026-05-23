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
  Workflow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Contracts", icon: BriefcaseBusiness },
  { label: "Wealth Empire", icon: CircleDollarSign },
  { label: "Wolf Pacc", icon: Music2 },
  { label: "Game Dev", icon: Boxes },
  { label: "Agents", icon: Bot },
  { label: "Workflows", icon: Workflow }
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

const agentRows = [
  { name: "Orchestrator", queue: "Routing tasks", health: "98%" },
  { name: "Contracts", queue: "Reviewing bids", health: "94%" },
  { name: "Research", queue: "Scanning sources", health: "91%" },
  { name: "Content", queue: "Building campaigns", health: "96%" },
  { name: "Finance", queue: "Tracking estimates", health: "89%" }
];

function MetricCard({
  label,
  value,
  detail,
  icon: Icon
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Activity;
}) {
  return (
    <Card className="bg-card/72 py-5 backdrop-blur">
      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
        </div>
        <div className="border border-primary/35 bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function BusinessPanel({
  panel
}: {
  panel: (typeof panelData)[number];
}) {
  return (
    <Card className="bg-card/78 backdrop-blur">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
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
      <CardContent className="space-y-5">
        <div className="grid grid-cols-3 gap-3">
          {panel.stats.map((stat) => (
            <div
              key={stat.label}
              className="border border-border/70 bg-background/40 px-3 py-2"
            >
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 font-display text-xl font-semibold">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {panel.rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0"
            >
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
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,rgba(45,212,191,0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(236,72,153,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(45,212,191,0.18),transparent_30%),radial-gradient(circle_at_88%_22%,rgba(236,72,153,0.13),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.12),rgba(2,6,23,0.92))]" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[248px_1fr]">
        <aside className="min-w-0 border-b border-border/70 bg-sidebar/76 px-5 py-5 backdrop-blur lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="border border-primary/45 bg-primary/10 p-2 text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold">AI Command</p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Control Layer
              </p>
            </div>
          </div>

          <nav className="mt-8 flex flex-wrap gap-2 lg:block lg:space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "default" : "ghost"}
                className="h-10 justify-start rounded-md px-3 lg:w-full"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="mt-8 hidden border border-border/70 bg-background/35 p-4 lg:block">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Deployment
            </p>
            <p className="mt-2 text-sm">GitHub to Vercel</p>
            <p className="mt-1 text-xs text-primary">main branch auto deploy</p>
          </div>
        </aside>

        <section className="min-w-0 px-5 py-5 sm:px-7 lg:px-8">
          <header className="flex flex-col gap-4 border-b border-border/70 pb-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                <DatabaseZap className="h-3.5 w-3.5" />
                Operational Dashboard
              </div>
              <h1 className="font-display text-3xl font-semibold sm:text-5xl">
                AI Cyberpunk Command Center
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                Unified control surface for agents, contract pursuit, wealth
                systems, audio operations, game development, and automation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button>
                <Bot className="h-4 w-4" />
                Run Agents
              </Button>
              <Button variant="outline">
                <Workflow className="h-4 w-4" />
                View Pipelines
              </Button>
            </div>
          </header>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statusMetrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card className="bg-card/76 backdrop-blur">
              <CardHeader>
                <CardTitle>Main Dashboard</CardTitle>
                <CardDescription>
                  System status, running agents, logs, contracts, wealth, and audio stats
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 lg:grid-cols-3">
                <div className="space-y-3 lg:col-span-2">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {["Contracts", "Wealth", "Audio"].map((label, index) => (
                      <div
                        key={label}
                        className="border border-border/70 bg-background/40 p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {label}
                        </p>
                        <p className="mt-3 font-display text-2xl font-semibold">
                          {[14, 286, 31][index]}
                        </p>
                        <div className="mt-3 h-2 bg-muted">
                          <div
                            className="h-full bg-primary shadow-[0_0_18px_hsl(var(--primary)/0.6)]"
                            style={{ width: `${[72, 58, 84][index]}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border border-border/70 bg-background/40 p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="font-medium">Agent Throughput</p>
                      <span className="text-sm text-primary">Live model</span>
                    </div>
                    <div className="flex h-36 items-end gap-2">
                      {[58, 82, 44, 76, 64, 92, 70, 88, 52, 80, 68, 94].map(
                        (height, index) => (
                          <div
                            key={`${height}-${index}`}
                            className="flex-1 bg-primary/20"
                          >
                            <div
                              className="mt-auto w-full bg-primary"
                              style={{ height: `${height}%` }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Execution Log</p>
                  {activityLog.map((entry) => (
                    <div
                      key={entry}
                      className="border border-border/60 bg-background/35 px-3 py-2 text-sm text-muted-foreground"
                    >
                      {entry}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/76 backdrop-blur">
              <CardHeader>
                <CardTitle>Running Agents</CardTitle>
                <CardDescription>
                  Queue status and operational health
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {agentRows.map((agent) => (
                  <div
                    key={agent.name}
                    className="grid grid-cols-[1fr_auto] gap-3 border-b border-border/55 pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {agent.queue}
                      </p>
                    </div>
                    <span className="font-display text-lg text-primary">
                      {agent.health}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            {panelData.map((panel) => (
              <BusinessPanel key={panel.title} panel={panel} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
