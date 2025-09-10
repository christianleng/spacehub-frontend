"use client";

import { OnboardingStore } from "../../store/onboarding.store";
import { useContext } from "react";
import { StoreContext } from "@/lib/store-provider";

export function useOnboarding(): OnboardingStore {
  const context = useContext(StoreContext);
  if (!context)
    throw new Error("useOnboarding must be used within a StoreProvider");
  return context.onboarding;
}
