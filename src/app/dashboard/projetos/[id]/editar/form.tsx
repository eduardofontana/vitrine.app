"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageShell } from "@/components/shared/visual";
import { CATEGORIAS, STATUS_PROJETO } from "@/lib/constants";
import { parseJsonArray } from "@/lib/utils";

interface EditProjectFormProps {
  project: Project;
}

export function EditProjectForm({ project }: EditProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const techStack = (form.get("techStack") as string)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const data = {
      name: form.get("name") as string,
      shortDescription: form.get("shortDescription") as string,
      description: form.get("description") as string,
      category: form.get("category") as string,
      projectType: form.get("projectType") as string,
      status: form.get("status") as string,
      price: Number(form.get("price")) || 0,
      acceptsOffers: project.acceptsOffers,
      monthlyRevenue: Number(form.get("monthlyRevenue")) || 0,
      monthlyCosts: Number(form.get("monthlyCosts")) || 0,
      usersCount: Number(form.get("usersCount")) || 0,
      demoUrl: (form.get("demoUrl") as string) || undefined,
      websiteUrl: (form.get("websiteUrl") as string) || undefined,
      screenshotUrl: (form.get("screenshotUrl") as string) || undefined,
      repositoryInfo: form.get("repositoryInfo") as string,
      techStack,
      includedAssets: parseJsonArray(project.includedAssets),
      reasonForSelling: form.get("reasonForSelling") as string,
    };

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erro ao atualizar");

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Erro ao atualizar projeto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="shadow-2xl shadow-slate-900/10">
          <CardHeader>
            <CardTitle className="text-3xl">Editar projeto</CardTitle>
            <CardDescription>
              Atualize as informacoes comerciais e envie novamente para curadoria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do projeto</Label>
                  <Input id="name" name="name" required defaultValue={project.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="screenshotUrl">URL da imagem de preview</Label>
                  <Input id="screenshotUrl" name="screenshotUrl" defaultValue={parseJsonArray(project.screenshots)[0] || ""} placeholder="https://.../screenshot.png" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Descricao curta</Label>
                <Input id="shortDescription" name="shortDescription" required defaultValue={project.shortDescription} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descricao completa</Label>
                <Textarea id="description" name="description" required defaultValue={project.description} rows={6} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select name="category" defaultValue={project.category}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS.map((cat) => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={project.status}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_PROJETO.map((st) => <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Preco (R$)</Label>
                  <Input id="price" name="price" type="number" step="0.01" defaultValue={String(project.price)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demoUrl">URL demo</Label>
                  <Input id="demoUrl" name="demoUrl" defaultValue={project.demoUrl || ""} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="techStack">Stack (separado por virgula)</Label>
                <Input id="techStack" name="techStack" defaultValue={parseJsonArray(project.techStack).join(", ")} placeholder="React, Node.js, PostgreSQL" />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Salvar alteracoes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
