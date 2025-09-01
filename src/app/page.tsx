import { redirect } from "next/navigation";

import { auth } from "@/features/auth/server/auth";
import {
  getFirstTenantForUser,
  shouldRedirectToOnboarding,
} from "./core/server/queries/queries";
import SignOut from "@/components/sign-out";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;

  const needsOnboarding = await shouldRedirectToOnboarding(userId);
  if (needsOnboarding) redirect("/onboarding");

  const first = await getFirstTenantForUser(userId);
  const tenant = first?.tenant;

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Tableau de bord</h1>

      {tenant ? (
        <section className="space-y-2">
          <h2 className="text-xl font-medium">Votre espace</h2>
          <div className="rounded-lg border p-4">
            <div>
              <span className="text-muted-foreground">Nom :</span> {tenant.name}
            </div>
            <div>
              <span className="text-muted-foreground">Slug :</span>{" "}
              {tenant.slug}
            </div>
          </div>
        </section>
      ) : (
        <p className="text-muted-foreground">ERROR</p>
      )}
      <SignOut />
    </main>
  );
}
