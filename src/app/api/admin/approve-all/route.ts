import { NextResponse } from "next/server";
import { requireAdminProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRequestOrigin } from "@/lib/security";

export async function POST(request: Request) {
  await requireAdminProfile();
  await prisma.project.updateMany({
    where: { approvalStatus: "PENDENTE" },
    data: { approvalStatus: "APROVADO" },
  });
  return NextResponse.redirect(new URL("/admin", getRequestOrigin(request)));
}
