import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  DollarSign,
  ExternalLink,
  Globe,
  Monitor,
  ShieldCheck,
  ShoppingCart,
  TrendingDown,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/constants";
import { firstImage, formatPrice, parseJsonArray } from "@/lib/utils";
import { LeadForm } from "@/components/shared/lead-form";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const includedAssetsLabels: Record<string, string> = {
  CODIGO_FONTE: "Codigo-fonte",
  DOMINIO: "Dominio",
  MARCA: "Marca",
  DOCUMENTACAO: "Documentacao",
  CLIENTES: "Clientes",
  BANCO_DADOS: "Banco de dados",
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      owner: { select: { id: true, name: true, username: true, bio: true, avatarUrl: true } },
    },
  });

  if (!project || project.approvalStatus !== "APROVADO") {
    notFound();
  }

  const image = firstImage(project.screenshots);
  const techStack = parseJsonArray(project.techStack);
  const includedAssets = parseJsonArray(project.includedAssets);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="aspect-video bg-slate-100">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={`Preview de ${project.name}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,#d1fae5,transparent_32%),linear-gradient(135deg,#f8fafc,#e2e8f0)]">
                  <Monitor className="h-16 w-16 text-slate-400" />
                </div>
              )}
            </div>
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">
                {CATEGORY_LABELS[project.category] || project.category}
              </Badge>
              <Badge variant="outline">{project.projectType || "Digital"}</Badge>
              <Badge
                variant={
                  project.status === "PRONTO_PARA_VENDA" ||
                  project.status === "COM_RECEITA"
                    ? "default"
                    : "warning"
                }
              >
                {STATUS_LABELS[project.status] || project.status}
              </Badge>
            </div>

            <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-slate-950">
              {project.name}
            </h1>
            <p className="mt-3 text-lg leading-8 text-slate-600">
              {project.shortDescription}
            </p>

            {(project.demoUrl || project.websiteUrl) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2">
                      <Monitor className="h-4 w-4" />
                      Ver demo
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                )}
                {project.websiteUrl && (
                  <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2">
                      <Globe className="h-4 w-4" />
                      Site
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                )}
              </div>
            )}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-heading text-2xl font-bold text-slate-950">
              Sobre o projeto
            </h2>
            <div className="mt-4 whitespace-pre-line leading-8 text-slate-600">
              {project.description}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="font-heading text-2xl font-bold text-slate-950">Stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span key={tech} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600">
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {includedAssets.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="font-heading text-2xl font-bold text-slate-950">
                Incluso na venda
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {includedAssets.map((asset) => (
                  <div key={asset} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                    {includedAssetsLabels[asset] || asset}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-5">
          <div className="sticky top-24 space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Preco pedido</p>
              <p className="mt-1 font-heading text-3xl font-bold text-slate-950">
                {project.price > 0
                  ? formatPrice(Number(project.price))
                  : "Aberto a propostas"}
              </p>
              {project.acceptsOffers && project.price > 0 && (
                <p className="mt-1 text-sm text-emerald-700">Aceita propostas</p>
              )}
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="text-sm font-bold uppercase text-slate-400">Metricas</h3>
              <div className="mt-4 space-y-4">
                {project.monthlyRevenue > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-slate-500">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      Receita mensal
                    </span>
                    <span className="text-sm font-bold text-slate-950">
                      {formatPrice(Number(project.monthlyRevenue))}
                    </span>
                  </div>
                )}
                {project.monthlyCosts > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-slate-500">
                      <TrendingDown className="h-4 w-4" />
                      Custos mensais
                    </span>
                    <span className="text-sm font-bold text-slate-950">
                      {formatPrice(Number(project.monthlyCosts))}
                    </span>
                  </div>
                )}
                {project.usersCount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-slate-500">
                      <Users className="h-4 w-4" />
                      Usuarios
                    </span>
                    <span className="text-sm font-bold text-slate-950">
                      {project.usersCount}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {project.owner.avatarUrl && <AvatarImage src={project.owner.avatarUrl} alt={project.owner.name} />}
                  <AvatarFallback>{project.owner.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/devs/${project.owner.username}`} className="font-bold text-slate-950 hover:text-emerald-700">
                    {project.owner.name}
                  </Link>
                  <p className="text-sm text-slate-500">@{project.owner.username}</p>
                </div>
              </div>
              {project.owner.bio && (
                <p className="mt-3 text-sm leading-6 text-slate-600">{project.owner.bio}</p>
              )}
            </div>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
              <h3 className="flex items-center gap-2 font-bold text-emerald-950">
                <ShoppingCart className="h-4 w-4" />
                Tem interesse?
              </h3>
              <p className="mt-2 text-sm leading-6 text-emerald-800">
                Envie uma mensagem ao vendedor. A negociacao e direta entre as partes.
              </p>
            </div>

            <LeadForm projectId={project.id} projectName={project.name} />

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-xs leading-5 text-slate-500">
                  O Vitrine App conecta compradores e vendedores. Due diligence,
                  pagamento e transferencia devem ser combinados entre as partes.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
