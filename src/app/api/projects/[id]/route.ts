import { NextResponse } from "next/server";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations";
import { parseJsonArray } from "@/lib/utils";

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

    const payload = parsed.data;
    const { screenshotUrl, ...projectDataWithSlug } = payload;
    const { slug, ...projectData } = projectDataWithSlug;
    void slug;
    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        demoUrl: payload.demoUrl || null,
        websiteUrl: payload.websiteUrl || null,
        repositoryInfo: payload.repositoryInfo || null,
        reasonForSelling: payload.reasonForSelling || null,
        screenshots: screenshotUrl ? [screenshotUrl] : parseJsonArray(project.screenshots),
        approvalStatus: "PENDENTE",
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar projeto" },
      { status: 500 }
    );
  }
}
