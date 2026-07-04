import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      select: { id: true, approvalStatus: true },
    });

    if (!project || project.approvalStatus !== "APROVADO") {
      return NextResponse.json(
        { error: "Projeto nao disponivel para contato" },
        { status: 404 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        projectId: data.projectId,
        buyerName: data.buyerName,
        buyerEmail: data.buyerEmail,
        message: data.message,
        interestType: data.interestType,
        offerAmount: data.offerAmount ?? null,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Lead error:", error);
    return NextResponse.json(
      { error: "Erro ao enviar interesse" },
      { status: 500 }
    );
  }
}
