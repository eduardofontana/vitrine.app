import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  LineChart,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/shared/project-card";
import {
  MarketplaceMockup,
  MetricStrip,
  PageShell,
  SectionHeader,
  StatTile,
} from "@/components/shared/visual";

async function getFeaturedProjects() {
  try {
    return await prisma.project.findMany({
      where: { approvalStatus: "APROVADO", isFeatured: true },
      include: { owner: { select: { name: true, username: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProjects();

  return (
    <PageShell>
      <section className="relative border-b border-white/70">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <Badge variant="secondary" className="w-fit gap-1 bg-white/80 text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" />
              Marketplace brasileiro para produtos digitais
            </Badge>
            <h1 className="mt-6 max-w-4xl font-heading text-5xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">
              Compre e venda apps prontos com cara de oportunidade real.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Encontre micro-SaaS, templates, apps e side projects com curadoria,
              metricas claras e contato direto com quem construiu.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/marketplace">
                <Button size="lg" className="gap-2">
                  Explorar projetos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/cadastro">
                <Button size="lg" variant="outline" className="gap-2">
                  <Rocket className="h-4 w-4" />
                  Anunciar projeto
                </Button>
              </Link>
            </div>
            <div className="mt-10 max-w-2xl">
              <MetricStrip />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-emerald-200/45 via-white/30 to-blue-200/45 blur-2xl" />
            <MarketplaceMockup className="relative" />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <StatTile label="Projetos listados" value="7+" icon={BriefcaseBusiness} tone="emerald" />
          <StatTile label="Devs cadastrados" value="4+" icon={Rocket} tone="blue" />
          <StatTile label="Curadoria manual" value="100%" icon={ShieldCheck} tone="emerald" />
          <StatTile label="Taxa inicial" value="R$ 0" icon={LineChart} tone="slate" />
        </div>
      </section>

      {featured.length > 0 && (
        <section className="border-y border-white/70 bg-white/55 py-16 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Curadoria"
              title="Projetos em destaque"
              description="Oportunidades selecionadas para compradores que querem velocidade, contexto e sinais de confianca."
              icon={ShieldCheck}
              actions={
                <Link href="/marketplace">
                  <Button variant="outline" className="gap-2">
                    Ver marketplace <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              }
            />

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Para vendedores",
                desc: "Publique seu projeto, receba leads e acompanhe status de curadoria em um dashboard mais visual.",
              },
              {
                title: "Para compradores",
                desc: "Compare oportunidades com preco, stack, receita e sinais de confianca antes de conversar.",
              },
              {
                title: "Para a plataforma",
                desc: "Supabase Auth e Postgres deixam o MVP pronto para crescer sem carregar infraestrutura cedo demais.",
              },
            ].map((item) => (
              <div key={item.title} className="premium-card p-6">
                <h3 className="font-heading text-lg font-bold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
