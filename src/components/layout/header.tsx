import Link from "next/link";
import { Store } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { sanitizeHttpUrl } from "@/lib/security";
import { Button } from "@/components/ui/button";
import { AccountMenu } from "@/components/layout/account-menu";

export async function Header() {
  const profile = await getCurrentProfile();
  const avatarUrl = sanitizeHttpUrl(profile?.avatarUrl);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/70 bg-white/80 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
            <Store className="h-4 w-4" />
          </span>
          <span className="font-heading text-lg font-bold text-slate-950">
            Vitrine App
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/marketplace"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
          >
            Explorar projetos
          </Link>
          {profile ? (
            <div className="flex items-center gap-3">
              {profile.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    Curadoria
                  </Button>
                </Link>
              )}
              <Link href="/dashboard/projetos/novo">
                <Button size="sm">Anunciar projeto</Button>
              </Link>
              <AccountMenu profile={profile} avatarUrl={avatarUrl} />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/auth/cadastro">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </div>
          )}
        </nav>

        <nav className="flex items-center gap-2 md:hidden">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm">
              Explorar
            </Button>
          </Link>
          {profile ? (
            <AccountMenu profile={profile} avatarUrl={avatarUrl} />
          ) : (
            <Link href="/auth/login">
              <Button size="sm">Entrar</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
