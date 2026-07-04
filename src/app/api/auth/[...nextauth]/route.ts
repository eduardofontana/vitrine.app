import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/auth";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const path = requestUrl.pathname;
  const supabase = await createClient();

  if (path.endsWith("/callback")) {
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") || "/dashboard";

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data.user) {
        await getOrCreateProfile(data.user);
      }
    }

    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  if (path.endsWith("/logout")) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/", requestUrl.origin));
  }

  return NextResponse.redirect(new URL("/auth/login", requestUrl.origin));
}
