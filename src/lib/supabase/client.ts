import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function createClient() {
  const { url, publishableKey, isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createBrowserClient(url!, publishableKey!);
}
