"use client";

import { StoreProvider } from "@/lib/store-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
