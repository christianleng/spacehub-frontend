"use client";

import { useContext } from "react";
import { StoreContext } from "@/lib/store-provider";
import { RootStore } from "@/app/core/store/root.store";

export function useStore(): RootStore {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
