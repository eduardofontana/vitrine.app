import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/auth";
import { safeInternalPath } from "@/lib/security";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const path = requestUrl.pathname;
  const supabase = await createClient();

  if (path.endsWith("/callback")) {
    const code = requestUrl.searchParams.get("code");
    const next = safeInternalPath(requestUrl.searchParams.get("next"));

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

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const path = requestUrl.pathname;

  if (!path.endsWith("/logout")) {
    return NextResponse.json({ error: "Rota nao encontrada" }, { status: 404 });
  }

  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.json({ ok: true });
}
