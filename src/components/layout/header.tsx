import Link from "next/link";
import { Store } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { sanitizeHttpUrl } from "@/lib/security";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/layout/logout-button";

export async function Header() {
  const profile = await getCurrentProfile();
  const avatarUrl = sanitizeHttpUrl(profile?.avatarUrl);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
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
              <Link href="/dashboard/perfil" className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={profile.name} />}
                  <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              <LogoutButton />
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
            <>
              <Link href="/dashboard/perfil">
                <Avatar className="h-9 w-9">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={profile.name} />}
                  <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              <LogoutButton />
            </>
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
