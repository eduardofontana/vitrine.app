import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EditProjectForm } from "./form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const profile = await requireProfile();

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project || project.ownerId !== profile.id) {
    notFound();
  }

  return <EditProjectForm project={project} />;
}
