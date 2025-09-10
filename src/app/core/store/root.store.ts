import { makeAutoObservable } from "mobx";
import { OnboardingStore } from "./onboarding.store";
import { ResourcesStore } from "./resources.store";

export class RootStore {
  onboarding: OnboardingStore;
  resources: ResourcesStore;

  constructor() {
    this.onboarding = new OnboardingStore();
    this.resources = new ResourcesStore();
    makeAutoObservable(this, {}, { autoBind: true });
  }

  hydrate(initialData: any = {}) {
    if (initialData.onboarding) {
      this.onboarding.hydrate(initialData.onboarding);
    }
  }
}
