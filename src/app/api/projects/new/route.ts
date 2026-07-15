import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import { isJsonBodyWithinLimit } from "@/lib/security";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }

    if (!isJsonBodyWithinLimit(request)) {
      return NextResponse.json({ error: "Payload muito grande" }, { status: 413 });
    }

    const body = await request.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload: ProjectInput = parsed.data;
    const existing = await prisma.project.findUnique({
      where: { slug: payload.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ja existe um projeto com este slug" },
        { status: 400 }
      );
    }

    const { screenshotUrl, ...projectData } = payload;
    const project = await prisma.project.create({
      data: {
        name: projectData.name,
        slug: projectData.slug,
        shortDescription: projectData.shortDescription,
        description: projectData.description,
        category: projectData.category,
        projectType: projectData.projectType || null,
        status: projectData.status,
        price: projectData.price,
        acceptsOffers: projectData.acceptsOffers,
        monthlyRevenue: projectData.monthlyRevenue,
        monthlyCosts: projectData.monthlyCosts,
        usersCount: projectData.usersCount,
        techStack: projectData.techStack,
        includedAssets: projectData.includedAssets,
        ownerId: profile.id,
        demoUrl: payload.demoUrl || null,
        websiteUrl: payload.websiteUrl || null,
        repositoryInfo: payload.repositoryInfo || null,
        reasonForSelling: payload.reasonForSelling || null,
        screenshots: screenshotUrl ? [screenshotUrl] : [],
        approvalStatus: "PENDENTE",
      },
    });

    return NextResponse.json(
      {
        id: project.id,
        slug: project.slug,
        approvalStatus: project.approvalStatus,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Create project error", { error: String(error) });
    return NextResponse.json(
      { error: "Erro ao criar projeto" },
      { status: 500 }
    );
  }
}
