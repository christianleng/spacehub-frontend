import { makeAutoObservable } from "mobx";
import { OnboardingStore } from "./onboarding.store";

export class RootStore {
  onboarding: OnboardingStore;

  constructor() {
    this.onboarding = new OnboardingStore();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  hydrate(initialData: any = {}) {
    if (initialData.onboarding) {
      this.onboarding.hydrate(initialData.onboarding);
    }
  }
}
