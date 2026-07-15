"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { analyticsEvents, trackEvent } from "@/lib/analytics-events";
import { ASSET_TYPES, CATEGORIAS, STATUS_PROJETO } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export function NewProjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  function handleNameChange(value: string) {
    setName(value);
    setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const techStack = (form.get("techStack") as string)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const includedAssets: string[] = [];
    for (const asset of ASSET_TYPES) {
      if (form.get(asset.value) === "on") includedAssets.push(asset.value);
    }

    const data = {
      name: form.get("name") as string,
      slug: form.get("slug") as string,
      shortDescription: form.get("shortDescription") as string,
      description: form.get("description") as string,
      category: form.get("category") as string,
      projectType: form.get("projectType") as string,
      status: form.get("status") as string,
      price: Number(form.get("price")) || 0,
      acceptsOffers: form.get("acceptsOffers") === "on",
      monthlyRevenue: Number(form.get("monthlyRevenue")) || 0,
      monthlyCosts: Number(form.get("monthlyCosts")) || 0,
      usersCount: Number(form.get("usersCount")) || 0,
      demoUrl: (form.get("demoUrl") as string) || undefined,
      websiteUrl: (form.get("websiteUrl") as string) || undefined,
      screenshotUrl: (form.get("screenshotUrl") as string) || undefined,
      repositoryInfo: form.get("repositoryInfo") as string,
      techStack,
      includedAssets,
      reasonForSelling: form.get("reasonForSelling") as string,
    };

    try {
      const res = await fetch("/api/projects/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao cadastrar projeto");
      }

      trackEvent(analyticsEvents.projectCreated, {
        category: data.category,
        status: data.status,
        hasPrice: data.price > 0,
        hasRevenue: data.monthlyRevenue > 0,
        hasDemo: Boolean(data.demoUrl),
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar projeto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="shadow-2xl shadow-slate-900/10">
          <CardHeader>
            <CardTitle className="text-3xl">Cadastrar projeto</CardTitle>
            <CardDescription>
              Publique seu projeto para potenciais compradores com uma apresentacao clara e confiavel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do projeto *</Label>
                  <Input id="name" name="name" required value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Ex: MeuApp" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input id="slug" name="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="meu-app" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="screenshotUrl">URL da imagem de preview</Label>
                <Input id="screenshotUrl" name="screenshotUrl" placeholder="https://…/screenshot.png" type="url" />
                <p className="text-xs text-slate-500">Use uma imagem do produto para deixar o card mais confiavel.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Descricao curta *</Label>
                <Input id="shortDescription" name="shortDescription" required placeholder="Resumo do projeto em ate 200 caracteres" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descricao completa *</Label>
                <Textarea id="description" name="description" required placeholder="Descreva o projeto em detalhes…" rows={6} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select name="category" required>
                    <SelectTrigger id="category" aria-label="Categoria"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS.map((cat) => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectType">Tipo de projeto</Label>
                  <Input id="projectType" name="projectType" placeholder="Ex: SaaS, Template, API" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status do projeto *</Label>
                  <Select name="status" required>
                    <SelectTrigger id="status" aria-label="Status do projeto"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {STATUS_PROJETO.map((st) => <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preco pedido (R$) *</Label>
                  <Input id="price" name="price" type="number" step="0.01" placeholder="0 = Aberto a propostas" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="techStack">Stack (separado por virgula)</Label>
                <Input id="techStack" name="techStack" placeholder="React, Node.js, PostgreSQL" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="monthlyRevenue">Receita mensal (R$)</Label>
                  <Input id="monthlyRevenue" name="monthlyRevenue" type="number" step="0.01" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyCosts">Custos mensais (R$)</Label>
                  <Input id="monthlyCosts" name="monthlyCosts" type="number" step="0.01" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usersCount">Usuarios</Label>
                  <Input id="usersCount" name="usersCount" type="number" placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="demoUrl">URL de demonstracao</Label>
                  <Input id="demoUrl" name="demoUrl" placeholder="https://…" type="url" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">URL do site</Label>
                  <Input id="websiteUrl" name="websiteUrl" placeholder="https://…" type="url" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repositoryInfo">Informacoes do repositorio</Label>
                <Input id="repositoryInfo" name="repositoryInfo" placeholder="Link ou observacao sobre o codigo-fonte" />
              </div>

              <div className="space-y-2">
                <Label>O que esta incluso na venda</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {ASSET_TYPES.map((asset) => (
                    <label key={asset.value} className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 text-sm font-medium text-slate-600">
                      <input type="checkbox" name={asset.value} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                      {asset.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reasonForSelling">Motivo da venda</Label>
                <Textarea id="reasonForSelling" name="reasonForSelling" placeholder="Por que voce esta vendendo este projeto?" rows={3} />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="acceptsOffers" name="acceptsOffers" defaultChecked className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <Label htmlFor="acceptsOffers" className="text-sm font-normal text-slate-600">Aceito receber propostas</Label>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Cadastrando…" : "Cadastrar projeto"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
