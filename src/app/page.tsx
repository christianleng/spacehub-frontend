import { redirect } from "next/navigation";
import { auth } from "@/features/auth/server/auth";
import {
  getFirstTenantForUser,
  shouldRedirectToOnboarding,
} from "./core/server/queries/queries";
import { SectionCards } from "@/features/sidebar/section-cards";

const Home = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const userId = session.user.id;
  const needsOnboarding = await shouldRedirectToOnboarding(userId);
  if (needsOnboarding) redirect("/onboarding");

  const first = await getFirstTenantForUser(userId);
  const tenant = first?.tenant;
  if (!tenant) redirect("/onboarding");

  return (
    <main className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-semibold">Tableau de bord</h1>
            <section className="space-y-2">
              <h2 className="text-xl font-medium">Votre espace</h2>
              <div className="rounded-lg border p-4">
                <div>
                  <span className="text-muted-foreground">Nom :</span>{" "}
                  {tenant.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Slug :</span>{" "}
                  {tenant.slug}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
