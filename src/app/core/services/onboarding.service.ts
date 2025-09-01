"use client";

import {
  checkTenantSlugAvailable,
  createTenantFromOnboarding,
  updateTenantContactAddress,
  updateTenantSettings,
  completeTenantOnboarding,
} from "../server/actions/onboarding.action";

export type CreateOrganizationPayload = {
  name: string;
  legalName: string;
  phone: string;
  website: string;
  slug: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  timezone: string;
};

export type UpdateContactAddressPayload = {
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

export type UpdateSettingsPayload = {
  timezone: string;
};

export class OnboardingService {
  async checkSlugAvailable(slug: string): Promise<boolean> {
    const res = await checkTenantSlugAvailable(slug);
    return res.available;
  }

  async createOrganization(
    payload: CreateOrganizationPayload
  ): Promise<{ orgId: string }> {
    const fd = new FormData();
    fd.set("name", payload.name);
    fd.set("legalName", payload.legalName ?? "");
    fd.set("phone", payload.phone ?? "");
    fd.set("website", payload?.website?.trim() ?? "");
    fd.set("slug", payload.slug);

    fd.set("addressLine1", payload.addressLine1);
    fd.set("addressLine2", payload.addressLine2 ?? "");
    fd.set("city", payload.city);
    fd.set("region", payload.region ?? "");
    fd.set("postalCode", payload.postalCode);
    fd.set("country", payload.country);

    fd.set("timezone", payload.timezone);

    const res = await createTenantFromOnboarding(fd);
    if (!res.ok) {
      throw new Error(
        "CreateOrganization failed: " + JSON.stringify(res.error)
      );
    }
    return { orgId: res.tenantId };
  }

  async updateContactAndAddress(
    orgId: string,
    payload: UpdateContactAddressPayload
  ): Promise<void> {
    const res = await updateTenantContactAddress(orgId, payload);
    if (!res.ok) {
      throw new Error(
        "UpdateContactAndAddress failed: " + JSON.stringify(res.error)
      );
    }
  }

  async updateSettings(
    orgId: string,
    payload: UpdateSettingsPayload
  ): Promise<void> {
    const res = await updateTenantSettings(orgId, payload);
    if (!res.ok) {
      throw new Error("UpdateSettings failed: " + JSON.stringify(res.error));
    }
  }

  async completeOnboarding(orgId: string): Promise<void> {
    const res = await completeTenantOnboarding(orgId);
    if (!res.ok) {
      throw new Error(
        "CompleteOnboarding failed: " + JSON.stringify(res.error)
      );
    }
  }
}

export const onboardingService = new OnboardingService();
