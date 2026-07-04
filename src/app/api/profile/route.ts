import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { getCurrentProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isJsonBodyWithinLimit } from "@/lib/security";
import { profileSchema, type ProfileInput } from "@/lib/validations";

export async function PATCH(request: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }

    if (!isJsonBodyWithinLimit(request, 32 * 1024)) {
      return NextResponse.json({ error: "Payload muito grande" }, { status: 413 });
    }

    const body = await request.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload: ProfileInput = parsed.data;
    const usernameOwner = await prisma.profile.findUnique({
      where: { username: payload.username },
      select: { id: true },
    });

    if (usernameOwner && usernameOwner.id !== profile.id) {
      return NextResponse.json(
        { error: "Este username ja esta em uso" },
        { status: 400 }
      );
    }

    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        name: payload.name,
        username: payload.username,
        bio: payload.bio || null,
        avatarUrl: payload.avatarUrl || null,
        skills: payload.skills,
      } satisfies Prisma.ProfileUpdateInput,
      select: {
        name: true,
        username: true,
        bio: true,
        avatarUrl: true,
        skills: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}
