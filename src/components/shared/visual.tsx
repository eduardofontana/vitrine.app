import type React from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_12%_0%,rgba(16,185,129,0.14),transparent_34%),radial-gradient(circle_at_84%_4%,rgba(59,130,246,0.12),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_68%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col justify-between gap-5 sm:flex-row sm:items-end", className)}>
      <div>
        {eyebrow && (
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/75 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700 shadow-sm shadow-emerald-950/5 backdrop-blur">
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 max-w-3xl font-heading text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export function StatTile({
  label,
  value,
  icon: Icon,
  tone = "emerald",
}: {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  tone?: "emerald" | "blue" | "amber" | "red" | "slate";
}) {
  const toneClass = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    red: "bg-red-50 text-red-700 ring-red-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  }[tone];

  return (
    <div className="rounded-lg border border-white/75 bg-white/80 p-5 shadow-sm shadow-slate-900/5 ring-1 ring-slate-900/[0.03] backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        {Icon && (
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg ring-1", toneClass)}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className="mt-3 font-heading text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}

export function MarketplaceMockup({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[1.35rem] border border-white/70 bg-white/80 p-3 shadow-2xl shadow-slate-900/12 ring-1 ring-slate-900/[0.04] backdrop-blur", className)}>
      <div className="overflow-hidden rounded-[1rem] border border-slate-200/80 bg-slate-950">
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
            vitrine.app
          </span>
        </div>
        <div className="grid gap-4 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.23),transparent_32%),linear-gradient(135deg,#0f172a,#1e293b)] p-5 text-white md:grid-cols-[1fr_0.78fr]">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-emerald-200">Marketplace</p>
              <h3 className="mt-1 font-heading text-2xl font-bold">Projetos digitais prontos</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["R$ 3.2k", "MRR"],
                ["230", "usuarios"],
                ["12x", "multiplo"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/10 p-3">
                  <p className="font-heading text-lg font-bold">{value}</p>
                  <p className="text-[11px] text-slate-300">{label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-white/10 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
                <BadgeCheck className="h-4 w-4" />
                Receita, demo e stack em destaque
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-2 w-2/3 rounded-full bg-emerald-300" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {[
              ["Demo TaskFlow", "SaaS", "R$ 24k"],
              ["Demo PlantCare", "Mobile", "Propostas"],
              ["Demo FormKit", "Template", "R$ 8k"],
            ].map(([name, type, price], index) => (
              <div key={name} className="rounded-lg border border-white/10 bg-white/95 p-3 text-slate-950 shadow-lg shadow-slate-950/10">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-heading text-sm font-bold">{name}</p>
                    <p className="text-xs text-slate-500">{type}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">{price}</span>
                </div>
                <div className="mt-3 flex gap-1.5">
                  <span className="h-1.5 flex-1 rounded-full bg-emerald-200" />
                  <span className="h-1.5 flex-1 rounded-full bg-blue-200" />
                  <span className={cn("h-1.5 flex-1 rounded-full", index === 1 ? "bg-slate-200" : "bg-amber-200")} />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-lg border border-emerald-300/30 bg-emerald-400/15 px-3 py-2 text-xs font-semibold text-emerald-100">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Curadoria ativa
              </span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MetricStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        ["Curadoria", "Manual"],
        ["Leads", "Qualificados"],
        ["Venda", "Direta"],
      ].map(([label, value]) => (
        <div key={label} className="rounded-lg border border-slate-200/80 bg-white/70 px-4 py-3 shadow-sm shadow-slate-900/5">
          <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
          <p className="mt-1 font-heading text-lg font-bold text-slate-950">{value}</p>
        </div>
      ))}
    </div>
  );
}


