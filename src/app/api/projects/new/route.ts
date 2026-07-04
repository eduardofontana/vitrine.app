import { NextResponse } from "next/server";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const profile = await requireProfile();
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = parsed.data;
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
        ...projectData,
        ownerId: profile.id,
        demoUrl: payload.demoUrl || null,
        websiteUrl: payload.websiteUrl || null,
        repositoryInfo: payload.repositoryInfo || null,
        reasonForSelling: payload.reasonForSelling || null,
        screenshots: screenshotUrl ? [screenshotUrl] : [],
        approvalStatus: "PENDENTE",
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Erro ao criar projeto" },
      { status: 500 }
    );
  }
}
