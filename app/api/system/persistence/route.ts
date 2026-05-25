import { NextResponse } from "next/server";
import {
  isSupabaseServerConfigured,
  supabaseServer
} from "@/lib/supabase/server";

const requiredTables = [
  "contract_opportunities",
  "content_assets",
  "wealth_leads",
  "wealth_campaigns",
  "audio_release_plans",
  "beat_uploads",
  "game_tasks",
  "agent_runs",
  "workflow_runs",
  "command_notes",
  "activity_events"
] as const;

export async function GET() {
  const clientConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (!isSupabaseServerConfigured || !supabaseServer) {
    return NextResponse.json({
      mode: "fallback",
      clientConfigured,
      serverConfigured: false,
      tables: [],
      message: "Supabase server env is missing. Product writes will use local fallback only."
    });
  }

  const client = supabaseServer;
  const tableChecks = await Promise.all(
    requiredTables.map(async (table) => {
      const { error } = await client
        .from(table)
        .select("id", { count: "exact", head: true });

      return {
        table,
        ok: !error,
        error: error?.message ?? null
      };
    })
  );
  const ok = tableChecks.every((table) => table.ok);

  return NextResponse.json({
    mode: ok ? "supabase" : "supabase_error",
    clientConfigured,
    serverConfigured: true,
    tables: tableChecks,
    message: ok
      ? "Supabase persistence is ready."
      : "Supabase is configured, but one or more product tables are missing or inaccessible."
  });
}
