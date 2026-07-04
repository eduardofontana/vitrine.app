import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export function getProfileDefaults(user: User) {
  const metadata = user.user_metadata ?? {};
  const name =
    (metadata.full_name as string | undefined) ||
    (metadata.name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Novo usuario";
  const usernameBase =
    (metadata.user_name as string | undefined) ||
    (metadata.preferred_username as string | undefined) ||
    user.email?.split("@")[0] ||
    user.id.slice(0, 8);

  return {
    name,
    email: user.email || `${user.id}@users.vitrine.app`,
    username: usernameBase
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 24),
    avatarUrl:
      (metadata.avatar_url as string | undefined) ||
      (metadata.picture as string | undefined) ||
      null,
  };
}

async function uniqueUsername(base: string, userId: string) {
  const fallback = `user_${userId.slice(0, 8)}`;
  const cleanBase = base || fallback;
  let candidate = cleanBase;
  let suffix = 1;

  while (await prisma.profile.findUnique({ where: { username: candidate } })) {
    candidate = `${cleanBase.slice(0, 20)}_${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getOrCreateProfile(user: User) {
  const existing = await prisma.profile.findUnique({ where: { id: user.id } });
  if (existing) return existing;

  const defaults = getProfileDefaults(user);
  const username = await uniqueUsername(defaults.username, user.id);

  return prisma.profile.create({
    data: {
      id: user.id,
      name: defaults.name,
      email: defaults.email,
      username,
      avatarUrl: defaults.avatarUrl,
    },
  });
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  return getOrCreateProfile(user);
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  return user;
}

export async function requireProfile() {
  const user = await requireUser();
  return getOrCreateProfile(user);
}

export async function requireAdminProfile() {
  const profile = await requireProfile();
  if (profile.role !== "ADMIN") redirect("/dashboard");
  return profile;
}
