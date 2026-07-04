import { NextResponse } from "next/server";
import { requireAdminProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  await requireAdminProfile();
  await prisma.project.updateMany({
    where: { approvalStatus: "PENDENTE" },
    data: { approvalStatus: "APROVADO" },
  });
  return NextResponse.redirect(new URL("/admin", process.env.NEXT_PUBLIC_APP_URL));
}
