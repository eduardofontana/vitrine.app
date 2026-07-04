import Link from "next/link";
import { Edit, ExternalLink, Eye, Plus, TrendingUp } from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APPROVAL_STATUS, CATEGORY_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export default async function DashboardPage() {
  const profile = await requireProfile();

  const projects = await prisma.project.findMany({
    where: { ownerId: profile.id },
    include: { _count: { select: { leads: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalLeads = projects.reduce((acc, p) => acc + p._count.leads, 0);
  const totalViews = projects.reduce((acc, p) => acc + p.viewCount, 0);
  const totalRevenue = projects.reduce((acc, p) => acc + Number(p.monthlyRevenue), 0);

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "APROVADO":
        return "default" as const;
      case "PENDENTE":
        return "warning" as const;
      case "REJEITADO":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-emerald-700">Dashboard</p>
          <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-slate-950">
            Bem-vindo, {profile.name}
          </h1>
          <p className="mt-2 text-slate-500">
            Gerencie projetos, leads e status de curadoria.
          </p>
        </div>
        <Link href="/dashboard/projetos/novo">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo projeto
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
        {[
          ["Projetos", projects.length],
          ["Visualizacoes", totalViews],
          ["Interessados", totalLeads],
          ["MRR anunciado", formatPrice(totalRevenue)],
        ].map(([label, value]) => (
          <Card key={label as string}>
            <CardHeader className="pb-3">
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-3xl">{value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-slate-950">
            Seus projetos
          </h2>
          <Link href="/dashboard/leads">
            <Button variant="outline" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Ver leads
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-500">
              Voce ainda nao cadastrou nenhum projeto.
            </p>
            <Link href="/dashboard/projetos/novo">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Cadastrar primeiro projeto
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading font-bold text-slate-950">
                        {project.name}
                      </h3>
                      <Badge variant={statusBadgeVariant(project.approvalStatus)}>
                        {APPROVAL_STATUS.find((s) => s.value === project.approvalStatus)?.label ||
                          project.approvalStatus}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span>{CATEGORY_LABELS[project.category] || project.category}</span>
                      <span>
                        {project.price > 0
                          ? formatPrice(Number(project.price))
                          : "Aberto a propostas"}
                      </span>
                      <span>{project._count.leads} interessados</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Link href={`/dashboard/projetos/${project.id}/editar`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Editar
                      </Button>
                    </Link>
                    <Link href={`/projetos/${project.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" aria-label="Abrir projeto">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/leads?projectId=${project.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye className="h-4 w-4" />
                        Leads
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
