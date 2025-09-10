"use server";

import { auth } from "@/features/auth/server/auth";
import db from "@/lib/db";
import { ResourceSchema, IResourceForm } from "../../store/resources.store";

export async function createResource(data: IResourceForm) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false as const, error: "Unauthorized" };
  }

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    select: { tenantId: true },
  });

  if (!membership) {
    return { ok: false as const, error: "No tenant found for this user" };
  }

  const tenantId = membership.tenantId;

  const parsed = ResourceSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }

  const resource = await db.openingHour.create({
    data: {
      tenantId,
      date: parsed.data.date,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      capacity: parsed.data.capacity,
      description: parsed.data.description,
      isActive: parsed.data.isActive,
    },
  });

  return { ok: true as const, resource };
}

export async function updateResource(id: string, data: Partial<IResourceForm>) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Unauthorized" };

  const parsed = ResourceSchema.partial().safeParse(data);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }

  const updated = await db.openingHour.update({
    where: { id },
    data: parsed.data,
  });

  return { ok: true as const, resource: updated };
}

export async function deleteResource(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Unauthorized" };

  await db.openingHour.delete({ where: { id } });

  return { ok: true as const };
}

export async function listResources() {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Unauthorized" };

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    select: { tenantId: true },
  });

  if (!membership) {
    return { ok: false as const, error: "No tenant found for this user" };
  }

  const tenantId = membership.tenantId;

  const resources = await db.openingHour.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });

  return { ok: true as const, resources };
}
