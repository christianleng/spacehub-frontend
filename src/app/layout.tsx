import "./globals.css";
import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
