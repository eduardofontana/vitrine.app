"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@prisma/client";
import { Loader2, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseJsonArray } from "@/lib/utils";

type EditableProfile = Profile & {
  skills?: unknown;
};

interface ProfileFormProps {
  profile: EditableProfile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const initialSkills = useMemo(() => parseJsonArray(profile.skills).join(", "), [profile.skills]);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);
    const skills = String(form.get("skills") || "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const payload = {
      name: String(form.get("name") || ""),
      username: String(form.get("username") || ""),
      avatarUrl: String(form.get("avatarUrl") || "") || undefined,
      bio: String(form.get("bio") || "") || undefined,
      skills,
    };

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Nao foi possivel salvar o perfil");
      }

      setSuccess("Perfil atualizado com sucesso.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel salvar o perfil");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-2xl shadow-slate-900/10">
      <CardHeader>
        <CardTitle className="text-2xl">Dados publicos</CardTitle>
        <CardDescription>
          Mostre quem voce e e quais tecnologias domina.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={profile.name} />}
              <AvatarFallback className="text-xl">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Label htmlFor="avatarUrl">URL da foto</Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                defaultValue={profile.avatarUrl || ""}
                onChange={(event) => setAvatarUrl(event.target.value)}
                placeholder="https://…"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome publico</Label>
              <Input id="name" name="name" required defaultValue={profile.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" required defaultValue={profile.username} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={profile.bio || ""}
              rows={5}
              placeholder="Conte brevemente sobre sua experiencia, foco e tipo de projeto que voce cria."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Habilidades</Label>
            <Input
              id="skills"
              name="skills"
              defaultValue={initialSkills}
              placeholder="Python, HTML, CSS, C#, React, Supabase"
            />
            <p className="text-xs text-slate-500">
              Separe as habilidades por virgula. Elas aparecem no seu perfil publico.
            </p>
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          {success && <p className="text-sm font-medium text-emerald-700">{success}</p>}

          <Button type="submit" className="gap-2" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar perfil
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
