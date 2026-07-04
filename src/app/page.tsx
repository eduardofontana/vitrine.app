import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
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
    <div>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_20%_10%,#d1fae5,transparent_30%),radial-gradient(circle_at_80%_0%,#dbeafe,transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
          <div>
            <Badge variant="secondary" className="gap-1 bg-emerald-50 text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" />
              Marketplace brasileiro para produtos digitais
            </Badge>
            <h1 className="mt-6 max-w-4xl font-heading text-5xl font-bold leading-tight text-slate-950 sm:text-6xl">
              Compre e venda apps prontos com mais confianca.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Encontre micro-SaaS, templates, apps e side projects com
              curadoria, metricas claras e contato direto com quem construiu.
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
            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["Curadoria manual", ShieldCheck],
                ["Leads qualificados", BriefcaseBusiness],
                ["Metricas visiveis", LineChart],
              ].map(([label, Icon]) => (
                <div key={label as string} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                  <Icon className="h-4 w-4 text-emerald-600" />
                  {label as string}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-xl shadow-slate-200/70">
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Deal em destaque</p>
                  <h2 className="mt-1 font-heading text-2xl font-bold text-slate-950">
                    Micro-SaaS validado
                  </h2>
                </div>
                <Badge className="bg-emerald-600">Receita</Badge>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  ["R$ 3.2k", "MRR"],
                  ["230", "usuarios"],
                  ["12x", "multiplo"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="font-heading text-xl font-bold">{value}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg bg-slate-950 p-5 text-white">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                  <BadgeCheck className="h-4 w-4" />
                  Demo e receita verificaveis
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  O card do projeto mostra preco, stack, status e sinais de
                  confianca antes do comprador iniciar contato.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: "7+", label: "Projetos listados" },
              { value: "4+", label: "Devs cadastrados" },
              { value: "100%", label: "Curadoria manual" },
              { value: "R$ 0", label: "Taxa inicial" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5">
                <p className="font-heading text-3xl font-bold text-slate-950">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="border-y border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase text-emerald-700">
                  Curadoria
                </p>
                <h2 className="mt-2 font-heading text-3xl font-bold text-slate-950">
                  Projetos em destaque
                </h2>
                <p className="mt-2 text-slate-500">
                  Oportunidades selecionadas para compradores que querem velocidade.
                </p>
              </div>
              <Link href="/marketplace">
                <Button variant="outline" className="gap-2">
                  Ver marketplace <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

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
                desc: "Publique seu projeto, receba leads e acompanhe status de curadoria em um dashboard simples.",
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
              <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-6">
                <h3 className="font-heading text-lg font-bold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
