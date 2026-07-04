import { NextResponse } from "next/server";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import { parseJsonArray } from "@/lib/utils";
import { isJsonBodyWithinLimit } from "@/lib/security";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await requireProfile();
    const { id } = await params;
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return NextResponse.json({ error: "Projeto nao encontrado" }, { status: 404 });
    }

    if (project.ownerId !== profile.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 403 });
    }

    if (!isJsonBodyWithinLimit(request)) {
      return NextResponse.json({ error: "Payload muito grande" }, { status: 413 });
    }

    const body = await request.json();
    const parsed = projectSchema.safeParse({
      slug: project.slug,
      ...body,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = parsed.data as ProjectInput;
    const { screenshotUrl, ...projectDataWithSlug } = payload;
    const { slug, ...projectData } = projectDataWithSlug;
    void slug;
    const updated = await prisma.project.update({
      where: { id },
      data: {
        name: projectData.name,
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
        demoUrl: payload.demoUrl || null,
        websiteUrl: payload.websiteUrl || null,
        repositoryInfo: payload.repositoryInfo || null,
        reasonForSelling: payload.reasonForSelling || null,
        screenshots: screenshotUrl ? [screenshotUrl] : parseJsonArray(project.screenshots),
        approvalStatus: "PENDENTE",
      },
    });

    return NextResponse.json({
      id: updated.id,
      slug: updated.slug,
      approvalStatus: updated.approvalStatus,
    });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar projeto" },
      { status: 500 }
    );
  }
}
