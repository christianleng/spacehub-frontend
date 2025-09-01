import { makeAutoObservable, runInAction } from "mobx";
import { onboardingService } from "../services/onboarding.service";
import { z } from "zod";

export interface IIdentityForm {
  name: string;
  legalName: string;
  website: string;
  slug: string;
}

export interface IContactForm {
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface ISettingsForm {
  timezone: string;
}

export interface IOnboardingData {
  identity: IIdentityForm;
  contact: IContactForm;
  settings: ISettingsForm;
}

export type StepIndex = 0 | 1 | 2;

const getDefaultTimezone = () => {
  if (typeof Intl !== "undefined" && typeof window !== "undefined") {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Paris";
  }
  return "Europe/Paris";
};

export const IdentitySchema = z.object({
  name: z.string(),
  legalName: z.string(),
  website: z.string(),
  slug: z.string(),
});

export const ContactSchema = z.object({
  phone: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  city: z.string(),
  region: z.string(),
  postalCode: z.string(),
  country: z.string().length(2),
});

export const SettingsSchema = z.object({
  timezone: z.string(),
});

export const OnboardingSchema = z.object({
  identity: IdentitySchema,
  contact: ContactSchema,
  settings: SettingsSchema,
});

const DEFAULT_DATA: IOnboardingData = {
  identity: { name: "", legalName: "", website: "", slug: "" },
  contact: {
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "FR",
  },
  settings: { timezone: getDefaultTimezone() },
};

export interface IOnboardingStore {
  step: StepIndex;
  data: IOnboardingData;
  orgId: string | null;

  isLoading: boolean;
  error: Error | null;

  setStep: (step: StepIndex) => void;

  setIdentity: (payload: IIdentityForm) => void;
  setContact: (payload: IContactForm) => void;
  setSettings: (payload: ISettingsForm) => void;

  submitStep1: (values: IIdentityForm) => Promise<void>;
  submitStep2: (values: IContactForm) => Promise<void>;
  submitStep3: (values: ISettingsForm) => Promise<void>;

  reset: () => void;

  hydrate: (
    initial?: Partial<IOnboardingData> & {
      step?: StepIndex;
      orgId?: string | null;
    }
  ) => void;
}

export class OnboardingStore implements IOnboardingStore {
  step: StepIndex = 0;
  data: IOnboardingData = DEFAULT_DATA;
  orgId: string | null = null;

  isLoading = false;
  error: Error | null = null;

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("onboarding");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const res = OnboardingSchema.safeParse(parsed);
          if (res.success) this.data = res.data;
        } catch {
          console.log("ERROR ");
        }
      }
    }
  }

  setStep(next: StepIndex) {
    this.step = next;
  }

  private persist() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("onboarding", JSON.stringify(this.data));
    }
  }

  setIdentity(values: IIdentityForm) {
    this.data.identity = values;
    this.persist();
  }
  setContact(values: IContactForm) {
    this.data.contact = values;
    this.persist();
  }
  setSettings(values: ISettingsForm) {
    this.data.settings = values;
    this.persist();
  }

  async submitStep1(values: IIdentityForm) {
    this.isLoading = true;
    this.error = null;
    try {
      const slugAlreadyExist = await onboardingService.checkSlugAvailable(
        values.slug
      );
      if (!slugAlreadyExist) throw new Error("Ce slug est déjà pris");
    } catch (e: unknown) {
      runInAction(() => {
        this.error = e instanceof Error ? e : new Error(String(e));
      });
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async submitStep2(values: IContactForm) {
    this.isLoading = true;
    this.error = null;
    try {
      if (!values.addressLine1?.trim())
        throw new Error("Adresse ligne 1 requise");
      if (!values.city?.trim()) throw new Error("Ville requise");
      if (!values.postalCode?.trim()) throw new Error("Code postal requis");
      if (!values.country?.trim() || values.country.trim().length !== 2) {
        throw new Error("Pays requis au format ISO-2");
      }

      runInAction(() => {
        this.setContact(values);
      });
    } catch (e: unknown) {
      runInAction(() => {
        this.error = e instanceof Error ? e : new Error(String(e));
      });
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async submitStep3(values: ISettingsForm) {
    if (!this.data.identity?.name || !this.data.identity?.slug) {
      throw new Error("Informations d'identité incomplètes");
    }
    if (
      !this.data.contact?.addressLine1 ||
      !this.data.contact?.city ||
      !this.data.contact?.postalCode ||
      !this.data.contact?.country
    ) {
      throw new Error("Informations d'adresse incomplètes");
    }

    this.isLoading = true;
    this.error = null;
    try {
      this.setSettings(values);

      const res = await onboardingService.createOrganization({
        name: this.data.identity.name,
        legalName: this.data.identity.legalName,
        website: this.data?.identity?.website,
        slug: this.data.identity.slug,
        phone: this.data.contact.phone ?? "",
        addressLine1: this.data.contact.addressLine1,
        addressLine2: this.data.contact.addressLine2 ?? "",
        city: this.data.contact.city,
        region: this.data.contact.region ?? "",
        postalCode: this.data.contact.postalCode,
        country: this.data.contact.country,
        timezone: this.data.settings.timezone,
      });

      runInAction(() => {
        this.orgId = res.orgId;
        this.reset();
      });
    } catch (e: unknown) {
      runInAction(() => {
        this.error = e instanceof Error ? e : new Error(String(e));
      });
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  reset() {
    this.step = 0;
    this.data = DEFAULT_DATA;
    this.orgId = null;
    this.isLoading = false;
    this.error = null;

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("onboarding");
    }
  }

  hydrate = (
    initial: Partial<IOnboardingData> & {
      step?: StepIndex;
      orgId?: string | null;
    } = {}
  ): void => {
    const PartialSchema = z.object({
      identity: IdentitySchema.partial().optional(),
      contact: ContactSchema.partial().optional(),
      settings: SettingsSchema.partial().optional(),
      step: z.number().int().min(0).max(2).optional(),
      orgId: z.string().nullable().optional(),
    });

    const parsed = PartialSchema.safeParse(initial);
    const payload = parsed.success ? parsed.data : {};

    runInAction(() => {
      if (payload.identity) {
        this.data.identity = { ...this.data.identity, ...payload.identity };
      }
      if (payload.contact) {
        this.data.contact = { ...this.data.contact, ...payload.contact };
      }
      if (payload.settings) {
        this.data.settings = { ...this.data.settings, ...payload.settings };
      }
      if (payload.orgId !== undefined) {
        this.orgId = payload.orgId;
      }
      if (typeof payload.step === "number") {
        this.step = payload.step as StepIndex;
      }
      this.persist();
    });
  };
}

export const onboardingStore = new OnboardingStore();
