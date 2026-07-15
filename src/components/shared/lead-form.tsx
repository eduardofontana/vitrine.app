"use client";

import { useState } from "react";
import { Send } from "lucide-react";
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
import { INTEREST_TYPES } from "@/lib/constants";
import { analyticsEvents, trackEvent } from "@/lib/analytics-events";

interface LeadFormProps {
  projectId: string;
  projectName: string;
}

export function LeadForm({ projectId, projectName }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      projectId,
      buyerName: form.get("buyerName") as string,
      buyerEmail: form.get("buyerEmail") as string,
      message: form.get("message") as string,
      interestType: form.get("interestType") as string,
      offerAmount: form.get("offerAmount")
        ? Number(form.get("offerAmount"))
        : undefined,
    };

    try {
      trackEvent(analyticsEvents.leadStarted, {
        projectId,
        interestType: data.interestType,
        hasOffer: Boolean(data.offerAmount),
      });

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erro ao enviar");
      trackEvent(analyticsEvents.leadSubmitted, {
        projectId,
        interestType: data.interestType,
        hasOffer: Boolean(data.offerAmount),
      });
      setSubmitted(true);
    } catch {
      setError("Erro ao enviar interesse. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/85 p-6 text-center shadow-sm shadow-emerald-950/5">
        <p className="font-semibold text-emerald-950">
          Interesse enviado com sucesso!
        </p>
        <p className="mt-1 text-sm text-emerald-800">
          O vendedor de {projectName} recebera sua mensagem.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="premium-panel space-y-4 p-6">
      <div className="space-y-2">
        <Label htmlFor="buyerName">Seu nome</Label>
        <Input id="buyerName" name="buyerName" required placeholder="Seu nome completo" autoComplete="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="buyerEmail">Seu email</Label>
        <Input
          id="buyerEmail"
          name="buyerEmail"
          type="email"
          required
          placeholder="seu@email.com"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="interestType">Tipo de interesse</Label>
        <Select name="interestType" required>
          <SelectTrigger id="interestType" aria-label="Tipo de interesse">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {INTEREST_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="offerAmount">Valor da proposta (opcional)</Label>
        <Input
          id="offerAmount"
          name="offerAmount"
          type="number"
          step="0.01"
          placeholder="Ex: 15000"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mensagem</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Conte sobre seu interesse no projeto…"
          rows={4}
        />
      </div>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <Button type="submit" className="w-full gap-2" disabled={loading}>
        <Send className="h-4 w-4" aria-hidden="true" />
        {loading ? "Enviando…" : "Tenho interesse"}
      </Button>
    </form>
  );
}
