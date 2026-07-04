"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Gauge, Loader2, LogOut, Settings, Store, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface AccountMenuProps {
  profile: {
    name: string;
    username: string;
    role: string;
  };
  avatarUrl: string | null;
}

export function AccountMenu({ profile, avatarUrl }: AccountMenuProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } finally {
      router.replace("/");
      router.refresh();
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="rounded-full outline-none ring-offset-2 transition hover:opacity-85 focus-visible:ring-2 focus-visible:ring-emerald-600"
          aria-label="Abrir menu da conta"
        >
          <Avatar className="h-9 w-9">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={profile.name} />}
            <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-50 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10"
        >
          <div className="px-3 py-3">
            <p className="truncate text-sm font-semibold text-slate-950">{profile.name}</p>
            <p className="truncate text-xs text-slate-500">@{profile.username}</p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
          <MenuLink href="/dashboard" icon={Gauge}>
            Dashboard
          </MenuLink>
          <MenuLink href="/dashboard/perfil" icon={Settings}>
            Configuracoes do perfil
          </MenuLink>
          <MenuLink href={`/devs/${profile.username}`} icon={UserRound}>
            Perfil publico
          </MenuLink>
          <MenuLink href="/dashboard/projetos/novo" icon={Store}>
            Anunciar projeto
          </MenuLink>
          <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-red-700 outline-none transition hover:bg-red-50 focus:bg-red-50"
            disabled={loading}
            onSelect={(event) => {
              event.preventDefault();
              void handleLogout();
            }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Sair
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenu.Item asChild>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 outline-none transition",
          "hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-950"
        )}
      >
        <Icon className="h-4 w-4 text-slate-400" />
        {children}
      </Link>
    </DropdownMenu.Item>
  );
}
