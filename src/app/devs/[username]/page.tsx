import { notFound } from "next/navigation";
import { Store } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectCard } from "@/components/shared/project-card";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function DevProfilePage({ params }: PageProps) {
  const { username } = await params;

  const profile = await prisma.profile.findUnique({
    where: { username },
    include: {
      projects: {
        where: { approvalStatus: "APROVADO" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!profile) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 rounded-lg border border-slate-200 bg-white p-8">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
          <Avatar className="h-24 w-24">
            {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name} />}
            <AvatarFallback className="text-2xl">
              {profile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="font-heading text-3xl font-bold text-slate-950">
              {profile.name}
            </h1>
            <p className="text-slate-500">@{profile.username}</p>
            {profile.bio && (
              <p className="mt-3 max-w-2xl text-slate-600">{profile.bio}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Badge variant="secondary" className="gap-1">
                <Store className="h-3 w-3" />
                {profile.projects.length} projetos publicados
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-heading text-2xl font-bold text-slate-950">
          Projetos publicados
        </h2>
        {profile.projects.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-500">Nenhum projeto publicado ainda.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profile.projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={{ ...project, owner: { name: profile.name, username: profile.username } }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
