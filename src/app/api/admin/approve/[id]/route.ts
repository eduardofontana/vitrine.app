import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRequestOrigin } from "@/lib/security";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
  }
  if (profile.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.project.update({
    where: { id },
    data: { approvalStatus: "APROVADO" },
  });
  return NextResponse.redirect(new URL("/admin", getRequestOrigin(request)));
}
