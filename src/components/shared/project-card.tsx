import Link from "next/link";
import { ArrowUpRight, Code2, ShieldCheck, TrendingUp } from "lucide-react";
import type { Project, Profile } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS } from "@/lib/constants";
import { firstImage, formatPrice, parseJsonArray } from "@/lib/utils";
import { cn } from "@/lib/utils";

type ProjectCardProject = Project & {
  owner?: Pick<Profile, "name" | "username">;
};

interface ProjectCardProps {
  project: ProjectCardProject;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const image = firstImage(project.screenshots);
  const techStack = parseJsonArray(project.techStack).slice(0, 3);

  return (
    <Link href={`/projetos/${project.slug}`} className={cn("group block h-full", className)}>
      <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
        <div className="relative aspect-video overflow-hidden bg-slate-100">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={`Preview de ${project.name}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,#d1fae5,transparent_34%),linear-gradient(135deg,#f8fafc,#e2e8f0)]">
              <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
                <Code2 className="h-8 w-8 text-slate-500" />
              </div>
            </div>
          )}
          {project.isFeatured && (
            <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm">
              Destaque
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <Badge variant="secondary">
              {CATEGORY_LABELS[project.category] || project.category}
            </Badge>
            <span className="text-sm font-bold text-slate-950">
              {project.price > 0 ? formatPrice(Number(project.price)) : "Propostas"}
            </span>
          </div>

          <h3 className="mt-4 font-heading text-lg font-bold text-slate-950 group-hover:text-emerald-700">
            {project.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {project.shortDescription}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              {project.monthlyRevenue > 0 && (
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {formatPrice(Number(project.monthlyRevenue))}/mes
                </span>
              )}
              {project.hasVerifiedDemo && (
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Demo
                </span>
              )}
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-emerald-700" />
          </div>

          {project.owner && (
            <p className="mt-3 text-xs text-slate-400">por {project.owner.name}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
