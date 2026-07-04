import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRequestOrigin } from "@/lib/security";

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }
  if (profile.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  await prisma.project.updateMany({
    where: { approvalStatus: "PENDENTE" },
    data: { approvalStatus: "APROVADO" },
  });
  return NextResponse.redirect(new URL("/admin", getRequestOrigin(request)));
}
