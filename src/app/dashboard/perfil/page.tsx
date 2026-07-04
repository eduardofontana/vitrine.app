import { Eye, UserRound } from "lucide-react";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "./profile-form";

export default async function ProfileSettingsPage() {
  const profile = await requireProfile();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase text-emerald-700">
            <UserRound className="h-4 w-4" />
            Perfil
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-slate-950">
            Editar perfil publico
          </h1>
          <p className="mt-2 text-slate-500">
            Essas informacoes aparecem para compradores e visitantes.
          </p>
        </div>
        <Link href={`/devs/${profile.username}`}>
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Ver publico
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
