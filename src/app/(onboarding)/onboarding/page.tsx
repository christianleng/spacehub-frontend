import { auth } from "@/features/auth/server/auth";
import { redirect } from "next/navigation";
import SignOut from "@/components/sign-out";
import { shouldRedirectToOnboarding } from "@/app/core/server/queries/queries";
import OnboardingForm from "@/features/onboarding/OnboardingForm";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id || !session) redirect("/sign-in");

  const needsOnboarding = await shouldRedirectToOnboarding(session.user.id);
  if (!needsOnboarding) redirect("/");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Bienvenue !</h1>
      <p className="text-muted-foreground mb-6">
        Configurer votre espace de coworking.
      </p>
      <OnboardingForm />
      <SignOut />
    </div>
  );
}
