import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { checkRateLimit, type RateLimitKey } from "@/lib/rate-limit";

function getRateLimitKey(pathname: string, method: string): RateLimitKey | null {
  if (method !== "POST") return null;

  if (pathname === "/api/auth/login") return "login";
  if (pathname === "/api/auth/cadastro") return "signup";
  if (pathname === "/api/leads") return "lead";
  if (pathname === "/api/projects/new") return "projectCreate";
  if (pathname.startsWith("/api/admin/")) return "adminAction";

  return null;
}

export async function middleware(request: NextRequest) {
  const rateLimitKey = getRateLimitKey(request.nextUrl.pathname, request.method);

  if (rateLimitKey) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    const identifier = rateLimitKey === "adminAction"
      ? `admin:${ip}`
      : `${rateLimitKey}:${ip}`;

    const { allowed } = await checkRateLimit(rateLimitKey, identifier);
    if (!allowed) {
      return NextResponse.json(
        { error: "Muitas requisicoes. Tente novamente mais tarde." },
        { status: 429 }
      );
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
