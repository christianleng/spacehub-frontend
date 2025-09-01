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
    .regex(/^[a-zA-Z0-9-_]+$/),
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
