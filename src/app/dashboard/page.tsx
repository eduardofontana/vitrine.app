import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Edit,
  ExternalLink,
  Eye,
  Plus,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APPROVAL_STATUS, CATEGORY_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { PageShell, SectionHeader, StatTile } from "@/components/shared/visual";

export default async function DashboardPage() {
  const profile = await requireProfile();

  const projects = await prisma.project.findMany({
    where: { ownerId: profile.id },
    include: { _count: { select: { leads: true } } },
    orderBy: { createdAt: "desc" },
  });

  let totalLeads = 0;
  let totalViews = 0;
  let totalRevenue = 0;
  let pendingCount = 0;

  for (const p of projects) {
    totalLeads += p._count.leads;
    totalViews += p.viewCount;
    totalRevenue += Number(p.monthlyRevenue);
    if (p.approvalStatus === "PENDENTE") pendingCount++;
  }
  const pendingProjects = pendingCount;

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
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Dashboard"
          title={`Bem-vindo, ${profile.name}`}
          description="Gerencie seus projetos, leads e status de curadoria em uma visao operacional."
          icon={TrendingUp}
          actions={
            <>
              <Link href="/dashboard/perfil">
                <Button variant="outline" className="gap-2">
                  <UserRound className="h-4 w-4" />
                  Editar Perfil
                </Button>
              </Link>
              <Link href="/dashboard/projetos/novo">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Projeto
                </Button>
              </Link>
            </>
          }
        />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile label="Projetos" value={projects.length} icon={CheckCircle2} tone="emerald" />
          <StatTile label="Visualizacoes" value={totalViews} icon={Eye} tone="blue" />
          <StatTile label="Interessados" value={totalLeads} icon={TrendingUp} tone="emerald" />
          <StatTile label="MRR anunciado" value={formatPrice(totalRevenue)} icon={Clock3} tone={pendingProjects > 0 ? "amber" : "slate"} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <section className="premium-panel p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">Sinais da vitrine</p>
                <h2 className="mt-1 font-heading text-2xl font-bold text-slate-950">
                  Performance dos projetos
                </h2>
              </div>
              <Badge variant={pendingProjects > 0 ? "warning" : "secondary"}>
                {pendingProjects > 0 ? `${pendingProjects} pendente(s)` : "Em dia"}
              </Badge>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase text-slate-400">Leads</p>
                <p className="mt-1 font-heading text-2xl font-bold text-slate-950">{totalLeads}</p>
              </div>
              <div className="rounded-lg border border-slate-200/80 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase text-slate-400">Receita</p>
                <p className="mt-1 font-heading text-2xl font-bold text-slate-950">{formatPrice(totalRevenue)}</p>
              </div>
            </div>
          </section>

          <section className="premium-panel p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-heading text-2xl font-bold text-slate-950">
                  Seus projetos
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Acompanhe curadoria, leads e detalhes comerciais.
                </p>
              </div>
              <Link href="/dashboard/leads">
                <Button variant="outline" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Ver Leads
                </Button>
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white/70 p-12 text-center">
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
              <div className="mt-6 space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-lg border border-slate-200/80 bg-white/85 p-4 shadow-sm shadow-slate-900/[0.03]"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </PageShell>
  );
}
