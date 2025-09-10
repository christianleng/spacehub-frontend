export const runtime = "nodejs";

import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/sidebar/app-sidebar";
import { SiteHeader } from "@/features/sidebar/site-header";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Coworking App",
  description: "Multi-tenant coworking — bootstrap",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <Providers>{children}</Providers>
            <Toaster position="bottom-right" richColors />
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
