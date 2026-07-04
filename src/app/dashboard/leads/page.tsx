import { MessageSquare } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ projectId?: string }>;
}

const interestLabels: Record<string, string> = {
  QUERO_COMPRAR: "Quero comprar",
  QUERO_NEGOCIAR: "Quero negociar",
  QUERO_SABER_MAIS: "Quero saber mais",
};

export default async function LeadsPage({ searchParams }: PageProps) {
  const profile = await requireProfile();
  const params = await searchParams;
  const where: Prisma.LeadWhereInput = {
    project: { ownerId: profile.id },
  };
  if (params.projectId) where.projectId = params.projectId;

  const leads = await prisma.lead.findMany({
    where,
    include: { project: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  const interestVariant = (type: string) => {
    switch (type) {
      case "QUERO_COMPRAR":
        return "default" as const;
      case "QUERO_NEGOCIAR":
        return "secondary" as const;
      case "QUERO_SABER_MAIS":
        return "outline" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase text-emerald-700">Leads</p>
        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-slate-950">
          Leads recebidos
        </h1>
        <p className="mt-2 text-slate-500">
          Interessados nos seus projetos publicados.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {leads.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-slate-500">Nenhum lead recebido ainda.</p>
          </div>
        ) : (
          leads.map((lead) => (
            <Card key={lead.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">{lead.buyerName}</CardTitle>
                    <CardDescription>{lead.buyerEmail}</CardDescription>
                  </div>
                  <Badge variant={interestVariant(lead.interestType)}>
                    {interestLabels[lead.interestType] || lead.interestType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Projeto</p>
                    <p className="text-sm text-slate-950">{lead.project.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Mensagem</p>
                    <p className="text-sm leading-6 text-slate-600">{lead.message}</p>
                  </div>
                  {lead.offerAmount && (
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Proposta</p>
                      <p className="text-sm font-bold text-slate-950">
                        {formatPrice(Number(lead.offerAmount))}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-slate-400">
                    Recebido em {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
