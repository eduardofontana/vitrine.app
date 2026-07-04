import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRequestOrigin } from "@/lib/security";
import { createClient } from "@/lib/supabase/server";

function clearSupabaseCookies(request: NextRequest, response: NextResponse) {
  request.cookies.getAll().forEach((cookie) => {
    if (cookie.name.startsWith("sb-") || cookie.name.includes("supabase")) {
      response.cookies.set(cookie.name, "", {
        expires: new Date(0),
        path: "/",
      });
    }
  });
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const response = NextResponse.redirect(new URL("/", getRequestOrigin(request)));
  clearSupabaseCookies(request, response);
  return response;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const response = NextResponse.json({ ok: true });
  clearSupabaseCookies(request, response);
  return response;
}
