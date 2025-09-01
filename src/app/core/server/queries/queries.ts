import db from "@/lib/db";

export async function shouldRedirectToOnboarding(
  userId: string
): Promise<boolean> {
  const membership = await db.membership.findFirst({
    where: { userId },
    select: { id: true },
  });
  return !Boolean(membership);
}

export async function getFirstTenantForUser(userId: string) {
  return db.membership.findFirst({
    where: { userId },
    select: {
      tenant: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function listTenantsForUser(userId: string) {
  return db.membership.findMany({
    where: { userId },
    select: {
      role: true,
      tenant: { select: { id: true, slug: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}
