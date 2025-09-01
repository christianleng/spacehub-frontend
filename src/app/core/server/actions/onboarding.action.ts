"use server";

import { auth } from "@/features/auth/server/auth";
import db from "@/lib/db";
import { z } from "zod";

const TenantOnboardingSchema = z.object({
  name: z.string().min(2),
  legalName: z.string().optional(),
  phone: z.string().optional(),
  website: z.url().optional().or(z.literal("")),
  addressLine1: z.string().min(3),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  region: z.string().optional(),
  postalCode: z.string().min(2),
  country: z.string().min(2).max(2),
  timezone: z.string().min(3),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/),
});

export async function checkTenantSlugAvailable(slug: string) {
  const s = (slug ?? "").toLowerCase();
  if (!/^[a-z0-9-]{2,}$/.test(s)) {
    return { available: false, reason: "invalid" as const };
  }
  const existing = await db.tenant.findUnique({ where: { slug: s } });
  return { available: !existing };
}

export async function createTenantFromOnboarding(fd: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Unauthorized" };

  const userId = session.user.id;

  const raw = Object.fromEntries(fd.entries());
  const parsed = TenantOnboardingSchema.safeParse(raw);
  if (!parsed.success)
    return { ok: false as const, error: parsed.error.flatten() };

  const data = parsed.data;

  const existingSlug = await db.tenant.findUnique({
    where: { slug: data.slug },
  });
  if (existingSlug) return { ok: false as const, error: "Slug already taken" };

  const tenant = await db.$transaction(async (tx) => {
    const t = await tx.tenant.create({
      data: {
        slug: data.slug,
        name: data.name,
        legalName: data.legalName,
        phone: data.phone,
        website: data.website,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        region: data.region,
        postalCode: data.postalCode,
        country: data.country,
        timezone: data.timezone,
        createdByUserId: userId,
      },
    });

    await tx.membership.create({
      data: { tenantId: t.id, userId, role: "manager" },
    });

    return t;
  });

  return { ok: true as const, tenantId: tenant.id, slug: tenant.slug };
}

const UpdateContactAddressSchema = z.object({
  phone: z.string().optional().or(z.literal("")),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional().or(z.literal("")),
  city: z.string().min(1),
  region: z.string().optional().or(z.literal("")),
  postalCode: z.string().min(1),
  country: z.string().length(2),
});

export async function updateTenantContactAddress(
  tenantId: string,
  payload: z.infer<typeof UpdateContactAddressSchema>
) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Unauthorized" };

  const membership = await db.membership.findUnique({
    where: { userId_tenantId: { userId: session.user.id, tenantId } },
    select: { role: true },
  });
  if (
    !membership ||
    (membership.role !== "manager" && membership.role !== "siteAdmin")
  ) {
    return { ok: false as const, error: "Forbidden" };
  }

  const parsed = UpdateContactAddressSchema.safeParse(payload);
  if (!parsed.success)
    return { ok: false as const, error: parsed.error.flatten() };

  await db.tenant.update({
    where: { id: tenantId },
    data: {
      phone: parsed.data.phone ?? "",
      addressLine1: parsed.data.addressLine1,
      addressLine2: parsed.data.addressLine2 ?? "",
      city: parsed.data.city,
      region: parsed.data.region ?? "",
      postalCode: parsed.data.postalCode,
      country: parsed.data.country,
    },
  });

  await db.auditLog.create({
    data: {
      tenantId,
      userId: session.user.id,
      action: "tenant.update_contact_address",
      meta: parsed.data as any,
    },
  });

  return { ok: true as const };
}

const UpdateSettingsSchema = z.object({
  timezone: z.string().min(1),
});

export async function updateTenantSettings(
  tenantId: string,
  payload: z.infer<typeof UpdateSettingsSchema>
) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Unauthorized" };

  const membership = await db.membership.findUnique({
    where: { userId_tenantId: { userId: session.user.id, tenantId } },
    select: { role: true },
  });
  if (
    !membership ||
    (membership.role !== "manager" && membership.role !== "siteAdmin")
  ) {
    return { ok: false as const, error: "Forbidden" };
  }

  const parsed = UpdateSettingsSchema.safeParse(payload);
  if (!parsed.success)
    return { ok: false as const, error: parsed.error.flatten() };

  await db.tenant.update({
    where: { id: tenantId },
    data: { timezone: parsed.data.timezone },
  });

  await db.auditLog.create({
    data: {
      tenantId,
      userId: session.user.id,
      action: "tenant.update_settings",
      meta: parsed.data as any,
    },
  });

  return { ok: true as const };
}

export async function completeTenantOnboarding(tenantId: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false as const, error: "Unauthorized" };

  const membership = await db.membership.findUnique({
    where: { userId_tenantId: { userId: session.user.id, tenantId } },
    select: { role: true },
  });
  if (
    !membership ||
    (membership.role !== "manager" && membership.role !== "siteAdmin")
  ) {
    return { ok: false as const, error: "Forbidden" };
  }

  await db.auditLog.create({
    data: {
      tenantId,
      userId: session.user.id,
      action: "tenant.onboarding_completed",
      meta: {},
    },
  });

  return { ok: true as const };
}
