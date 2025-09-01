"use client";

import { observer } from "mobx-react-lite";
import { useOnboarding } from "@/app/core/hooks/store/use-onboarding";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StepIndex } from "@/app/core/store/onboarding.store";

const STEPS = ["Commerce", "Adresse", "Préférences"] as const;

export default observer(function OnboardingForm() {
  const onboardingStore = useOnboarding();

  const updateIdentity = (
    patch: Partial<typeof onboardingStore.data.identity>
  ) =>
    onboardingStore.setIdentity({ ...onboardingStore.data.identity, ...patch });

  const updateContact = (patch: Partial<typeof onboardingStore.data.contact>) =>
    onboardingStore.setContact({ ...onboardingStore.data.contact, ...patch });

  const updateSettings = (
    patch: Partial<typeof onboardingStore.data.settings>
  ) =>
    onboardingStore.setSettings({ ...onboardingStore.data.settings, ...patch });

  const goPrev = () => {
    if (onboardingStore.step > 0) {
      onboardingStore.setStep((onboardingStore.step - 1) as StepIndex);
    }
  };

  const goNext = async () => {
    if (onboardingStore.step === 0) {
      await onboardingStore.submitStep1(onboardingStore.data.identity);
      if (!onboardingStore.error) onboardingStore.setStep(1);
      return;
    }
    if (onboardingStore.step === 1) {
      await onboardingStore.submitStep2(onboardingStore.data.contact);
      if (!onboardingStore.error) onboardingStore.setStep(2);
      return;
    }
  };

  const finish = async () => {
    await onboardingStore.submitStep3(onboardingStore.data.settings);
    if (!onboardingStore.error) {
      window.location.href = "/";
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center text-sm",
                i <= onboardingStore.step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {i + 1}
            </div>
            <span
              className={cn(
                "text-sm",
                i === onboardingStore.step && "font-medium"
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="w-8 h-px bg-border mx-2" />
            )}
          </div>
        ))}
      </div>

      {onboardingStore.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {onboardingStore.error.message}
        </div>
      )}

      {onboardingStore.step === 0 && (
        <div className="grid gap-3">
          <Input
            placeholder="Nom du commerce *"
            value={onboardingStore.data.identity.name}
            onChange={(e) => updateIdentity({ name: e.target.value })}
          />
          <Input
            placeholder="Raison sociale (optionnel)"
            value={onboardingStore.data.identity.legalName}
            onChange={(e) => updateIdentity({ legalName: e.target.value })}
          />
          <Input
            placeholder="Téléphone (optionnel)"
            value={onboardingStore.data.contact.phone}
            onChange={(e) => updateContact({ phone: e.target.value })}
          />
          <Input
            placeholder="Site web (optionnel)"
            value={onboardingStore.data.identity.website}
            onChange={(e) => updateIdentity({ website: e.target.value })}
          />
          <Input
            placeholder="Slug (ex: paris-centre) *"
            value={onboardingStore.data.identity.slug}
            onChange={(e) => updateIdentity({ slug: e.target.value })}
          />
        </div>
      )}

      {onboardingStore.step === 1 && (
        <div className="grid gap-3">
          <Input
            placeholder="Adresse ligne 1 *"
            value={onboardingStore.data.contact.addressLine1}
            onChange={(e) => updateContact({ addressLine1: e.target.value })}
          />
          <Input
            placeholder="Adresse ligne 2"
            value={onboardingStore.data.contact.addressLine2}
            onChange={(e) => updateContact({ addressLine2: e.target.value })}
          />
          <Input
            placeholder="Ville *"
            value={onboardingStore.data.contact.city}
            onChange={(e) => updateContact({ city: e.target.value })}
          />
          <Input
            placeholder="Région/État"
            value={onboardingStore.data.contact.region}
            onChange={(e) => updateContact({ region: e.target.value })}
          />
          <Input
            placeholder="Code postal *"
            value={onboardingStore.data.contact.postalCode}
            onChange={(e) => updateContact({ postalCode: e.target.value })}
          />
          <Input
            placeholder="Pays (ISO-2, ex: FR) *"
            value={onboardingStore.data.contact.country}
            onChange={(e) =>
              updateContact({ country: e.target.value.toUpperCase() })
            }
          />
        </div>
      )}

      {onboardingStore.step === 2 && (
        <div className="grid gap-3">
          <Input
            placeholder="Fuseau horaire (IANA) *"
            value={onboardingStore.data.settings.timezone}
            onChange={(e) => updateSettings({ timezone: e.target.value })}
          />
        </div>
      )}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={onboardingStore.step === 0 || onboardingStore.isLoading}
          onClick={goPrev}
        >
          Précédent
        </Button>

        {onboardingStore.step < STEPS.length - 1 ? (
          <Button
            type="button"
            onClick={goNext}
            disabled={onboardingStore.isLoading}
          >
            {onboardingStore.isLoading ? "..." : "Suivant"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={finish}
            disabled={onboardingStore.isLoading}
          >
            {onboardingStore.isLoading ? "..." : "Terminer"}
          </Button>
        )}
      </div>
    </div>
  );
});
