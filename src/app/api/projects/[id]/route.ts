import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import { parseJsonArray } from "@/lib/utils";
import { isJsonBodyWithinLimit } from "@/lib/security";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }

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

    const payload: ProjectInput = parsed.data;
    const { screenshotUrl, ...rest } = payload;
    const updated = await prisma.project.update({
      where: { id },
      data: {
        name: rest.name,
        shortDescription: rest.shortDescription,
        description: rest.description,
        category: rest.category,
        projectType: rest.projectType || null,
        status: rest.status,
        price: rest.price,
        acceptsOffers: rest.acceptsOffers,
        monthlyRevenue: rest.monthlyRevenue,
        monthlyCosts: rest.monthlyCosts,
        usersCount: rest.usersCount,
        techStack: rest.techStack,
        includedAssets: rest.includedAssets,
        demoUrl: rest.demoUrl || null,
        websiteUrl: rest.websiteUrl || null,
        repositoryInfo: rest.repositoryInfo || null,
        reasonForSelling: rest.reasonForSelling || null,
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
