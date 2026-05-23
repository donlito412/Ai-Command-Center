import { Activity, BrainCircuit, DatabaseZap, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const systems = [
  {
    title: "Agent Grid",
    detail: "Orchestrator, research, finance, contracts, and content agents staged.",
    icon: BrainCircuit
  },
  {
    title: "Data Core",
    detail: "Supabase-ready schema and memory layers prepared for realtime panels.",
    icon: DatabaseZap
  },
  {
    title: "Automation Bus",
    detail: "n8n and Make workflow folders reserved for execution pipelines.",
    icon: Network
  }
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative flex min-h-screen items-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(45,212,191,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(236,72,153,0.08)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.18),transparent_32%),radial-gradient(circle_at_82%_28%,rgba(236,72,153,0.12),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.28),rgba(2,6,23,0.82))]" />

        <div className="relative z-10 grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-primary">
              <Activity className="h-3.5 w-3.5" />
              System Foundation Online
            </div>
            <h1 className="font-display text-4xl font-semibold leading-tight text-balance sm:text-6xl lg:text-7xl">
              AI Cyberpunk Command Center
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Frontend foundation for a cinematic operational dashboard built
              around agent workflows, realtime data, and automation control.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg">Open Dashboard</Button>
              <Button size="lg" variant="outline">
                Review Systems
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {systems.map((system) => (
              <Card key={system.title} className="bg-card/78 backdrop-blur">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className="border border-primary/35 bg-primary/10 p-2 text-primary">
                    <system.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{system.title}</CardTitle>
                    <CardDescription>{system.detail}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-2 overflow-hidden bg-muted">
                    <div className="h-full w-2/3 bg-primary shadow-[0_0_22px_hsl(var(--primary))]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
