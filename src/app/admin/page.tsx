import { Shield } from "lucide-react";
import { requireAdminProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APPROVAL_STATUS, CATEGORY_LABELS } from "@/lib/constants";
import { PageShell, StatTile } from "@/components/shared/visual";

function getStatusVariant(status: string) {
  switch (status) {
    case "PENDENTE":
      return "warning" as const;
    case "APROVADO":
      return "default" as const;
    case "REJEITADO":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

export default async function AdminPage() {
  await requireAdminProfile();

  const [total, pendentes, aprovados, rejeitados, leads, pendingProjects] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { approvalStatus: "PENDENTE" } }),
    prisma.project.count({ where: { approvalStatus: "APROVADO" } }),
    prisma.project.count({ where: { approvalStatus: "REJEITADO" } }),
    prisma.lead.count(),
    prisma.project.findMany({
      where: { approvalStatus: "PENDENTE" },
      include: { owner: { select: { name: true, username: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const stats = { total, pendentes, aprovados, rejeitados, leads };

  return (
    <PageShell>
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold uppercase text-emerald-700">
          <Shield className="h-4 w-4" aria-hidden="true" />
          Admin
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-slate-950">
          Curadoria
        </h1>
        <p className="mt-2 text-slate-500">Moderacao e aprovacao de projetos.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          ["Total", stats.total, "text-slate-950"],
          ["Pendentes", stats.pendentes, "text-amber-700"],
          ["Aprovados", stats.aprovados, "text-emerald-700"],
          ["Rejeitados", stats.rejeitados, "text-red-700"],
          ["Leads", stats.leads, "text-blue-700"],
        ].map(([label, value]) => (
          <StatTile key={label as string} label={label as string} value={value as number} tone={label === "Pendentes" ? "amber" : label === "Rejeitados" ? "red" : label === "Leads" ? "blue" : "emerald"} />
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-slate-950">
            Projetos pendentes
          </h2>
          <form action="/api/admin/approve-all" method="POST">
            <Button type="submit" size="sm" variant="outline">
              Aprovar Todos
            </Button>
          </form>
        </div>
        <div className="mt-4 space-y-3">
          {pendingProjects.length === 0 ? (
            <p className="premium-panel border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">
              Nenhum projeto pendente de aprovacao.
            </p>
          ) : (
            pendingProjects.map((project) => (
              <div
                key={project.id}
                className="premium-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-heading font-bold text-slate-950">
                      {project.name}
                    </p>
                    <Badge variant={getStatusVariant(project.approvalStatus)}>
                      {APPROVAL_STATUS.find((s) => s.value === project.approvalStatus)?.label ||
                        project.approvalStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">
                    {CATEGORY_LABELS[project.category] || project.category} - {project.owner.name}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <form action={`/api/admin/approve/${project.id}`} method="POST">
                    <Button type="submit" size="sm">
                      Aprovar
                    </Button>
                  </form>
                  <form action={`/api/admin/reject/${project.id}`} method="POST">
                    <Button type="submit" size="sm" variant="destructive">
                      Rejeitar
                    </Button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </PageShell>
  );
}
