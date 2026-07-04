import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const hasRevenue = searchParams.get("hasRevenue");
  const hasDemo = searchParams.get("hasDemo");

  const where: Record<string, unknown> = {
    approvalStatus: "APROVADO",
  };

  if (category) where.category = category;
  if (status) where.status = status;
  if (hasRevenue === "true") where.monthlyRevenue = { gt: 0 };
  if (hasDemo === "true") where.demoUrl = { not: null };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const projects = await prisma.project.findMany({
      where: where as never,
      include: {
        owner: { select: { name: true, username: true } },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
