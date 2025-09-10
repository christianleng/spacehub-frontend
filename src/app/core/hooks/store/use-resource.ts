"use client";

import { useContext } from "react";
import { StoreContext } from "@/lib/store-provider";
import { ResourcesStore } from "../../store/resources.store";

export function useResources(): ResourcesStore {
  const context = useContext(StoreContext);
  if (!context)
    throw new Error("useResources must be used within a StoreProvider");
  return context.resources;
}
