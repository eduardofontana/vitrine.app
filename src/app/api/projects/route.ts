import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category")?.slice(0, 80);
  const status = searchParams.get("status")?.slice(0, 80);
  const search = searchParams.get("search")?.trim().slice(0, 120);
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
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        category: true,
        projectType: true,
        status: true,
        price: true,
        acceptsOffers: true,
        monthlyRevenue: true,
        monthlyCosts: true,
        usersCount: true,
        demoUrl: true,
        websiteUrl: true,
        techStack: true,
        includedAssets: true,
        screenshots: true,
        isFeatured: true,
        hasVerifiedDemo: true,
        hasVerifiedCode: true,
        hasVerifiedRevenue: true,
        hasSecureSale: true,
        createdAt: true,
        owner: { select: { name: true, username: true } },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 60,
    });

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
