"use client";

import { RootStore } from "@/app/core/store/root.store";
import { ReactNode, createContext } from "react";

let rootStore: RootStore | null = null;

export const StoreContext = createContext<RootStore>(new RootStore());

function initializeStore(initialData = {}) {
  const _store = rootStore ?? new RootStore();
  if (initialData) _store.hydrate(initialData);
  if (typeof window === "undefined") return _store;
  if (!rootStore) rootStore = _store;
  return _store;
}

export type StoreProviderProps = {
  children: ReactNode;
  initialState?: any;
};

export const StoreProvider = ({
  children,
  initialState = {},
}: StoreProviderProps) => {
  const store = initializeStore(initialState);
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
