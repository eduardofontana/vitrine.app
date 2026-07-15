import Link from "next/link";
import { Store } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
                <Store className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-heading text-lg font-bold text-slate-950">
                Vitrine App
              </span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              O marketplace brasileiro para devs venderem micro-SaaS, apps
              prontos, templates, landing pages e side projects.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-950">Plataforma</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/marketplace" className="text-sm text-slate-500 hover:text-slate-950">
                  Explorar projetos
                </Link>
              </li>
              <li>
                <Link href="/auth/cadastro" className="text-sm text-slate-500 hover:text-slate-950">
                  Anunciar projeto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-950">Para devs</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>Curadoria manual</li>
              <li>Perfis publicos</li>
              <li>Leads qualificados</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-8">
          <p className="text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Vitrine App. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
