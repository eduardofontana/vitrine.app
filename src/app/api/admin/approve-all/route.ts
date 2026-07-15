import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRequestOrigin } from "@/lib/security";
import { validateCsrfToken } from "@/lib/csrf";
import { logger } from "@/lib/logger";

async function getCsrfToken(request: Request): Promise<string | null> {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await request.text();
    const params = new URLSearchParams(text);
    return params.get("csrf_token");
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    if (profile.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const csrfToken = await getCsrfToken(request);
    if (!csrfToken || !(await validateCsrfToken(csrfToken))) {
      return NextResponse.json({ error: "Token invalido" }, { status: 403 });
    }

    await prisma.project.updateMany({
      where: { approvalStatus: "PENDENTE" },
      data: { approvalStatus: "APROVADO" },
    });
    logger.admin.action(profile.id, "approve-all", "bulk");
    return NextResponse.redirect(new URL("/admin", getRequestOrigin(request)));
  } catch (error) {
    logger.error("Approve all error", { error: String(error) });
    return NextResponse.json(
      { error: "Erro ao aprovar projetos" },
      { status: 500 }
    );
  }
}
