import { NextResponse } from "next/server";
import { requireAdminProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdminProfile();
  const { id } = await params;
  await prisma.project.update({
    where: { id },
    data: { approvalStatus: "REJEITADO" },
  });
  return NextResponse.redirect(new URL("/admin", process.env.NEXT_PUBLIC_APP_URL));
}
