import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function hasValidSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return false;
  }

  try {
    const url = new URL(supabaseUrl);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = hasValidSupabaseConfig();

export const supabase = (() => {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    return createClient<Database>(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
  } catch {
    return null;
  }
})();
