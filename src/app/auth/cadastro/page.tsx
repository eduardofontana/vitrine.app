"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chrome, Github, Loader2, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/auth-errors";
import { analyticsEvents, trackEvent } from "@/lib/analytics-events";
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

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading("password");

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    if (password.length < 8) {
      setError("Use uma senha com pelo menos 8 caracteres.");
      setLoading(null);
      return;
    }

    trackEvent(analyticsEvents.signupStarted, { method: "password" });
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: form.get("name") as string,
          full_name: form.get("name") as string,
          user_name: form.get("username") as string,
        },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (signUpError) {
      setError(authErrorMessage(signUpError.message));
      setLoading(null);
      return;
    }

    if (!data.session) {
      trackEvent(analyticsEvents.signupCompleted, {
        method: "password",
        requiresEmailConfirmation: true,
      });
      setSuccess("Conta criada. Confirme seu email para ativar o acesso.");
      setLoading(null);
      return;
    }

    trackEvent(analyticsEvents.signupCompleted, {
      method: "password",
      requiresEmailConfirmation: false,
    });
    router.push("/dashboard");
    router.refresh();
  }

  async function handleOAuth(provider: "google" | "github") {
    setError("");
    setSuccess("");
    setLoading(provider);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/api/auth/callback?next=/dashboard`;

    trackEvent(analyticsEvents.socialAuthStarted, { provider, flow: "signup" });
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
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden flex-col justify-center lg:flex">
          <div className="inline-flex w-fit items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            Publique seu projeto em minutos
          </div>
          <h1 className="mt-6 font-heading text-5xl font-bold text-slate-950">
            Crie sua vitrine e comece a receber compradores.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Projetos novos entram em curadoria antes de aparecer no
            marketplace, mantendo a qualidade da plataforma.
          </p>
        </div>

        <Card className="shadow-xl shadow-slate-200/70">
          <CardHeader className="text-center">
            <Link href="/" className="mx-auto flex items-center justify-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Store className="h-5 w-5" />
              </span>
              <span className="font-heading text-xl font-bold text-slate-950">
                Vitrine App
              </span>
            </Link>
            <CardTitle className="pt-4 text-2xl">Criar conta</CardTitle>
            <CardDescription>Use email ou login social</CardDescription>
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
              ou cadastre com email
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" name="name" required placeholder="Seu nome" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="seu@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" required placeholder="seuusername" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" name="password" type="password" required minLength={8} placeholder="Minimo 8 caracteres" />
              </div>
              {error && <p className="text-sm font-medium text-red-600">{error}</p>}
              {success && <p className="text-sm font-medium text-emerald-700">{success}</p>}
              <Button type="submit" className="w-full gap-2" disabled={!!loading}>
                {loading === "password" && <Loader2 className="h-4 w-4 animate-spin" />}
                Criar conta
              </Button>
            </form>
            <p className="mt-5 text-center text-sm text-slate-500">
              Ja tem conta?{" "}
              <Link href="/auth/login" className="font-medium text-slate-950 hover:underline">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
