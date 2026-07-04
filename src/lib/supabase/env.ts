export function getSupabaseEnv() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const url = normalizeSupabaseUrl(rawUrl);
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return { url, publishableKey, isConfigured: Boolean(url && publishableKey) };
}

function normalizeSupabaseUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  const cleanValue = value.trim().replace(/^["']|["']$/g, "");

  try {
    return new URL(cleanValue).origin;
  } catch {
    return cleanValue.replace(/\/(?:rest|auth)\/v1\/?$/, "").replace(/\/$/, "");
  }
}
