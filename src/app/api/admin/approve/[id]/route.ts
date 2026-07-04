import { NextResponse } from "next/server";
import { requireAdminProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRequestOrigin } from "@/lib/security";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdminProfile();
  const { id } = await params;
  await prisma.project.update({
    where: { id },
    data: { approvalStatus: "APROVADO" },
  });
  return NextResponse.redirect(new URL("/admin", getRequestOrigin(request)));
}
