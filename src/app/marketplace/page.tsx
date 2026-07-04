import Link from "next/link";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/constants";
import { ProjectCard } from "@/components/shared/project-card";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    status?: string;
    search?: string;
    hasRevenue?: string;
    hasDemo?: string;
  }>;
}

function withParam(params: Record<string, string | undefined>, key: string, value?: string) {
  const next = new URLSearchParams();
  Object.entries(params).forEach(([paramKey, paramValue]) => {
    if (paramValue && paramKey !== key) next.set(paramKey, paramValue);
  });
  if (value) next.set(key, value);
  const query = next.toString();
  return query ? `/marketplace?${query}` : "/marketplace";
}

export default async function MarketplacePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const where: Record<string, unknown> = { approvalStatus: "APROVADO" };

  if (params.category) where.category = params.category;
  if (params.status) where.status = params.status;
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { shortDescription: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params.hasRevenue === "true") where.monthlyRevenue = { gt: 0 };
  if (params.hasDemo === "true") where.demoUrl = { not: null };

  const projects = await prisma.project.findMany({
    where: where as never,
    include: { owner: { select: { name: true, username: true } } },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <Badge variant="secondary" className="gap-1 bg-blue-50 text-blue-700">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Marketplace
            </Badge>
            <h1 className="mt-3 font-heading text-4xl font-bold text-slate-950">
              Explorar projetos
            </h1>
            <p className="mt-2 text-slate-500">
              {projects.length} projetos aprovados disponiveis para contato.
            </p>
          </div>
          <Link href="/dashboard/projetos/novo">
            <Button>Anunciar projeto</Button>
          </Link>
        </div>

        <form className="mt-6 flex max-w-xl gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="search"
              placeholder="Buscar por nome ou descricao..."
              defaultValue={params.search}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="outline">
            Buscar
          </Button>
        </form>
      </div>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-72">
          <div className="sticky top-24 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-950">
              <Filter className="h-4 w-4" />
              Filtros
            </h2>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase text-slate-400">Categoria</p>
              <div className="mt-2 flex flex-wrap gap-2 lg:block lg:space-y-1">
                <Link
                  href={withParam(params, "category")}
                  className={`block rounded-md px-2 py-1 text-sm ${
                    !params.category
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Todas
                </Link>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <Link
                    key={value}
                    href={withParam(params, "category", value)}
                    className={`block rounded-md px-2 py-1 text-sm ${
                      params.category === value
                        ? "bg-slate-950 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-semibold uppercase text-slate-400">Status</p>
              <div className="mt-2 flex flex-wrap gap-2 lg:block lg:space-y-1">
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <Link
                    key={value}
                    href={withParam(params, "status", value)}
                    className={`block rounded-md px-2 py-1 text-sm ${
                      params.status === value
                        ? "bg-slate-950 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-semibold uppercase text-slate-400">Sinais</p>
              <div className="mt-2 space-y-1">
                <Link
                  href={withParam(params, "hasRevenue", "true")}
                  className={`block rounded-md px-2 py-1 text-sm ${
                    params.hasRevenue === "true"
                      ? "bg-emerald-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Possui receita
                </Link>
                <Link
                  href={withParam(params, "hasDemo", "true")}
                  className={`block rounded-md px-2 py-1 text-sm ${
                    params.hasDemo === "true"
                      ? "bg-emerald-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Possui demo
                </Link>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {projects.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
              <h3 className="font-heading text-xl font-bold text-slate-950">
                Nenhum projeto encontrado
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Ajuste os filtros ou limpe a busca para ver mais oportunidades.
              </p>
              <Link href="/marketplace">
                <Button variant="outline" className="mt-5">
                  Limpar filtros
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
