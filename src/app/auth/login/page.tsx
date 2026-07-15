"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chrome, Github, Loader2, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/auth-errors";
import { analyticsEvents, trackEvent } from "@/lib/analytics-events";
import { safeInternalPath } from "@/lib/security";
import { loginSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MarketplaceMockup, PageShell } from "@/components/shared/visual";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading("password");

    const form = new FormData(e.currentTarget);
    const parsed = loginSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      setError(firstIssue?.message || "Revise os dados informados.");
      setLoading(null);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (signInError) {
      setError(authErrorMessage(signInError.message));
      setLoading(null);
      return;
    }

    trackEvent(analyticsEvents.loginCompleted, { method: "password" });
    router.push("/dashboard");
    router.refresh();
  }

  async function handleOAuth(provider: "google" | "github") {
    setError("");
    setLoading(provider);
    const supabase = createClient();
    const searchParams = new URLSearchParams(window.location.search);
    const next = safeInternalPath(searchParams.get("next"));
    const redirectTo = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`;

    trackEvent(analyticsEvents.socialAuthStarted, { provider, flow: "login" });
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });

    if (oauthError) {
      setError(authErrorMessage(oauthError.message));
      setLoading(null);
    }
  }

  return (
    <PageShell>
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden flex-col justify-center lg:flex">
          <div className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur">
            Marketplace curado para produtos digitais
          </div>
          <h1 className="mt-6 font-heading text-5xl font-bold text-slate-950">
            Entre para vender, comprar ou acompanhar oportunidades.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Acesse seu dashboard, publique projetos e converse com compradores
            qualificados em uma experiencia mais simples e segura.
          </p>
          <div className="mt-8 max-w-xl">
            <MarketplaceMockup />
          </div>
        </div>

        <Card className="shadow-2xl shadow-slate-900/10">
          <CardHeader className="text-center">
            <Link href="/" className="mx-auto flex items-center justify-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
                <Store className="h-5 w-5" />
              </span>
              <span className="font-heading text-xl font-bold text-slate-950">
                Vitrine App
              </span>
            </Link>
            <CardTitle className="pt-4 text-2xl">Entrar</CardTitle>
            <CardDescription>Acesse sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={!!loading}
                onClick={() => handleOAuth("google")}
              >
                {loading === "google" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Chrome className="h-4 w-4" />
                )}
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={!!loading}
                onClick={() => handleOAuth("github")}
              >
                {loading === "github" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
                GitHub
              </Button>
            </div>

            <div className="my-6 flex items-center gap-3 text-xs uppercase text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              ou entre com email
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="seu@email.com" autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" name="password" type="password" required placeholder="Sua senha" autoComplete="current-password" />
              </div>
              {error && <p className="text-sm font-medium text-red-600">{error}</p>}
              <Button type="submit" className="w-full gap-2" disabled={!!loading}>
                {loading === "password" && <Loader2 className="h-4 w-4 animate-spin" />}
                Entrar
              </Button>
            </form>
            <p className="mt-5 text-center text-sm text-slate-500">
              Nao tem conta?{" "}
              <Link href="/auth/cadastro" className="font-medium text-slate-950 hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
    </PageShell>
  );
}
